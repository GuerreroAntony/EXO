import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInstance, connectInstance, deleteInstance } from "@/lib/whatsapp/evolution-client";
import { sendPairingEmail } from "@/lib/email/resend-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PairRequestBody {
  phone?: string;
  agentName?: string;
  capabilities?: string[];
  email?: string;
}

const VALID_CAPABILITIES = new Set(["recepcionista", "sac", "cobranca", "agendamento"]);
const PAIRING_TTL_SECONDS = 180;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = (await request.json().catch(() => null)) as PairRequestBody | null;
  if (!body) return Response.json({ ok: false, error: "Body inválido" }, { status: 400 });

  const phoneE164NoPlus = normalizePhone(body.phone);
  if (!phoneE164NoPlus) {
    return Response.json(
      { ok: false, error: "Telefone inválido. Use formato +55 11 99999-9999." },
      { status: 400 },
    );
  }

  const agentName = (body.agentName ?? "").trim();
  if (!agentName) return Response.json({ ok: false, error: "agentName obrigatório" }, { status: 400 });

  const capabilities = (body.capabilities ?? []).filter((c) => VALID_CAPABILITIES.has(c));
  if (capabilities.length === 0) {
    return Response.json({ ok: false, error: "Selecione ao menos uma capacidade" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single<{ organization_id: string | null }>();

  const orgId = profile?.organization_id;
  if (!orgId) return Response.json({ ok: false, error: "Usuário sem organização" }, { status: 403 });

  const agentType = capabilities.length === 1 ? capabilities[0] : "custom";
  const instanceName = buildInstanceName(orgId, agentName);

  const admin = createAdminClient();
  const expiresAt = new Date(Date.now() + PAIRING_TTL_SECONDS * 1000).toISOString();

  const { data: draft, error: draftError } = await admin
    .from("agent_provisioning")
    .insert({
      organization_id: orgId,
      agent_type: agentType,
      capabilities,
      agent_name: agentName,
      status: "draft",
      transport: "evolution",
      evolution_instance_name: instanceName,
      whatsapp_phone_number: `+${phoneE164NoPlus}`,
      evolution_pairing_expires_at: expiresAt,
    })
    .select("id")
    .single<{ id: string }>();

  if (draftError || !draft) {
    console.error("[evolution/pair] failed to insert draft", draftError);
    return Response.json(
      { ok: false, error: "Falha ao criar registro de provisionamento" },
      { status: 500 },
    );
  }

  let pairingCode: string;
  try {
    await createInstance(instanceName);
  } catch (err) {
    console.error("[evolution/pair] createInstance failed", err);
    await admin.from("agent_provisioning").delete().eq("id", draft.id);
    return Response.json(
      { ok: false, error: "Falha ao criar instância na Evolution" },
      { status: 502 },
    );
  }

  try {
    const result = await connectInstance(instanceName, phoneE164NoPlus);
    if (!result.pairingCode) {
      throw new Error("Evolution não retornou pairingCode");
    }
    pairingCode = result.pairingCode;
  } catch (err) {
    console.error("[evolution/pair] connectInstance failed", err);
    await deleteInstance(instanceName).catch(() => undefined);
    await admin.from("agent_provisioning").delete().eq("id", draft.id);
    return Response.json(
      { ok: false, error: "Falha ao gerar pairing code" },
      { status: 502 },
    );
  }

  const { error: updateError } = await admin
    .from("agent_provisioning")
    .update({
      evolution_pairing_code: pairingCode,
      evolution_connection_state: "connecting",
    })
    .eq("id", draft.id);

  if (updateError) {
    console.error("[evolution/pair] failed to persist pairing code", updateError);
    await deleteInstance(instanceName).catch(() => undefined);
    await admin.from("agent_provisioning").delete().eq("id", draft.id);
    return Response.json(
      { ok: false, error: "Falha ao salvar pairing code" },
      { status: 500 },
    );
  }

  let emailSent: { id: string } | null = null;
  let emailError: string | null = null;
  const recipientEmail = (body.email ?? "").trim();
  if (recipientEmail) {
    try {
      emailSent = await sendPairingEmail({
        to: recipientEmail,
        agentName,
        pairingCode,
        phoneE164: `+${phoneE164NoPlus}`,
        expiresAt,
      });
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.warn("[evolution/pair] sendPairingEmail failed", emailError);
    }
  }

  return Response.json({
    ok: true,
    provisioningId: draft.id,
    instanceName,
    pairingCode,
    expiresAt,
    email: recipientEmail
      ? { sent: !!emailSent, id: emailSent?.id ?? null, error: emailError }
      : null,
  });
}

function normalizePhone(input: string | undefined): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

function buildInstanceName(orgId: string, agentName: string): string {
  const slug = agentName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "agent";
  const orgPrefix = orgId.slice(0, 8);
  const nonce = Math.random().toString(36).slice(2, 8);
  return `org_${orgPrefix}_${slug}_${nonce}`;
}
