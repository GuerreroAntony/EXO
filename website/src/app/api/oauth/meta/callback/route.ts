import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { encrypt } from "@/lib/crypto/secrets";
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  getMeBusinesses,
  getBusinessWabas,
  getWabaPhoneNumbers,
  registerPhoneNumber,
  subscribeApp,
} from "@/lib/meta/graph";
import { clearAgentCache } from "@/lib/agents/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_SYSTEM_PROMPT = `Você é um agente de atendimento via WhatsApp para a empresa do cliente.
Responda de forma educada, objetiva e profissional. Quando não souber a resposta, encaminhe pra equipe humana.`;

interface CallbackBody {
  code?: string;
}

/**
 * OAuth callback do Embedded Signup da Meta.
 *
 * Fluxo:
 *  1. Frontend (ConnectWhatsAppButton) chama FB.login() → recebe code
 *  2. POST aqui com { code }
 *  3. Trocamos code → user access token (curto) → long-lived (60d)
 *  4. Listamos BPs do cliente, pegamos primeiro WABA + primeiro phone number
 *  5. Registramos o número no app + subscribe webhook
 *  6. Salvamos em agent_provisioning com token criptografado
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = (await request.json().catch(() => null)) as CallbackBody | null;
  if (!body?.code) return new Response("Missing code", { status: 400 });

  // Resolve org do usuário
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single<{ organization_id: string | null }>();

  const orgId = profile?.organization_id;
  if (!orgId) return new Response("User has no organization", { status: 403 });

  try {
    // 1) Code → short-lived token
    const shortLived = await exchangeCodeForToken(body.code);

    // 2) Short → long-lived (60 dias)
    const longLived = await exchangeForLongLivedToken(shortLived).catch(() => shortLived);

    // 3) Lista BPs do cliente
    const businesses = await getMeBusinesses(longLived);
    if (businesses.length === 0) {
      return Response.json(
        { ok: false, error: "Nenhum Business Portfolio encontrado na sua conta." },
        { status: 400 },
      );
    }

    // MVP: pega o primeiro BP. UI multi-business virá depois.
    const business = businesses[0];

    // 4) Pega WABAs do BP
    const wabas = await getBusinessWabas(business.id, longLived);
    if (wabas.length === 0) {
      return Response.json(
        {
          ok: false,
          error: `O Business Portfolio "${business.name}" não tem nenhum WhatsApp Business Account.`,
        },
        { status: 400 },
      );
    }

    const waba = wabas[0];

    // 5) Pega phone numbers do WABA
    const phones = await getWabaPhoneNumbers(waba.id, longLived);
    if (phones.length === 0) {
      return Response.json(
        {
          ok: false,
          error: `O WABA "${waba.name}" não tem nenhum número cadastrado.`,
        },
        { status: 400 },
      );
    }

    const phone = phones[0];

    // 6) Registra número no app (no-op se já registrado)
    await registerPhoneNumber(phone.id, longLived).catch((err) => {
      console.warn("[oauth-callback] registerPhoneNumber failed (continuing)", String(err));
    });

    // 7) Subscribe app no WABA (idempotente)
    await subscribeApp(waba.id, longLived);

    // 8) Persiste em agent_provisioning (admin client pra bypassar RLS no upsert)
    const admin = createAdminClient();
    const tokenEncrypted = encrypt(longLived);

    const { data: existing } = await admin
      .from("agent_provisioning")
      .select("id")
      .eq("organization_id", orgId)
      .eq("waba_id", waba.id)
      .eq("whatsapp_phone_number_id", phone.id)
      .maybeSingle<{ id: string }>();

    let agentId: string;

    if (existing) {
      // Atualiza token (re-OAuth)
      await admin
        .from("agent_provisioning")
        .update({
          tenant_access_token_encrypted: tokenEncrypted,
          whatsapp_display_name: phone.verified_name ?? phone.display_phone_number,
          status: "active",
        })
        .eq("id", existing.id);
      agentId = existing.id;
    } else {
      // Tenta encontrar agente "vazio" da org pra preencher; senão cria novo
      const { data: empty } = await admin
        .from("agent_provisioning")
        .select("id")
        .eq("organization_id", orgId)
        .is("whatsapp_phone_number_id", null)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle<{ id: string }>();

      if (empty) {
        await admin
          .from("agent_provisioning")
          .update({
            waba_id: waba.id,
            whatsapp_phone_number_id: phone.id,
            whatsapp_display_name: phone.verified_name ?? phone.display_phone_number,
            tenant_access_token_encrypted: tokenEncrypted,
            status: "active",
          })
          .eq("id", empty.id);
        agentId = empty.id;
      } else {
        const { data: created, error: insertErr } = await admin
          .from("agent_provisioning")
          .insert({
            organization_id: orgId,
            agent_name: "Atendimento WhatsApp",
            agent_type: "sac",
            tone: "amigavel",
            status: "active",
            system_prompt: DEFAULT_SYSTEM_PROMPT,
            waba_id: waba.id,
            whatsapp_phone_number_id: phone.id,
            whatsapp_display_name: phone.verified_name ?? phone.display_phone_number,
            tenant_access_token_encrypted: tokenEncrypted,
          })
          .select("id")
          .single<{ id: string }>();

        if (insertErr || !created) {
          console.error("[oauth-callback] insert failed", insertErr?.message);
          return Response.json(
            { ok: false, error: "Falha ao salvar agente. Tente de novo." },
            { status: 500 },
          );
        }
        agentId = created.id;
      }
    }

    // Limpa cache do router pra novo phone_number_id ser visto pelo webhook
    clearAgentCache();

    console.log("[oauth-callback] connected", {
      orgId,
      agentId,
      wabaId: waba.id,
      phoneNumberId: phone.id,
      displayName: phone.verified_name,
    });

    return Response.json({
      ok: true,
      agent_id: agentId,
      waba_id: waba.id,
      phone_number_id: phone.id,
      display_name: phone.verified_name ?? phone.display_phone_number,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[oauth-callback] failed", errMsg);
    return Response.json(
      { ok: false, error: "Falha ao conectar WhatsApp. Verifique permissões e tente de novo." },
      { status: 500 },
    );
  }
}
