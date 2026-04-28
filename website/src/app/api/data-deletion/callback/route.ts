import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseSignedRequest } from "@/lib/whatsapp/signed-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Data Deletion Callback da Meta.
 * Spec: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 *
 * - Recebe POST x-www-form-urlencoded com `signed_request`
 * - Valida HMAC-SHA256 do payload com WHATSAPP_APP_SECRET
 * - Apaga dados do user_id (= WhatsApp ID do contato): conversations + messages
 * - Sempre retorna 200 com { url, confirmation_code } pra Meta (mesmo se nada existir)
 * - Página pública /data-deletion-status/<code> mostra status
 */
export async function POST(request: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error("[data-deletion-callback] WHATSAPP_APP_SECRET not configured");
    return new Response("Server misconfigured", { status: 500 });
  }

  // Meta envia application/x-www-form-urlencoded
  let signedRequest: string | null = null;
  try {
    const form = await request.formData();
    signedRequest = form.get("signed_request")?.toString() ?? null;
  } catch {
    // Fallback: alguns clientes mandam JSON
    try {
      const body = (await request.json().catch(() => null)) as { signed_request?: string } | null;
      signedRequest = body?.signed_request ?? null;
    } catch {
      // ignore
    }
  }

  if (!signedRequest) {
    return new Response("Missing signed_request", { status: 400 });
  }

  const payload = parseSignedRequest(signedRequest, appSecret);
  if (!payload) {
    console.warn("[data-deletion-callback] invalid signed_request");
    return new Response("Invalid signed_request", { status: 400 });
  }

  const userId = payload.user_id;
  const supabase = createAdminClient();

  // Insere request com confirmation_code gerado automaticamente pelo default
  const { data: requestRow, error: insertError } = await supabase
    .from("data_deletion_requests")
    .insert({
      meta_user_id: userId,
      source: "meta_callback",
      status: "processing",
    })
    .select("confirmation_code")
    .single<{ confirmation_code: string }>();

  if (insertError || !requestRow) {
    console.error("[data-deletion-callback] insert failed", insertError?.message);
    return new Response("Failed to register request", { status: 500 });
  }

  const confirmationCode = requestRow.confirmation_code;
  const statusUrl = `https://exo.tec.br/data-deletion-status/${confirmationCode}`;

  // Apaga dados em background — Meta exige resposta rápida (< 30s)
  // user_id da Meta = WhatsApp ID = contact_phone (ex: "5511999999999")
  deleteUserData(userId, confirmationCode).catch((err) => {
    console.error("[data-deletion-callback] delete crashed", {
      userId,
      err: err instanceof Error ? err.message : String(err),
    });
  });

  return Response.json({
    url: statusUrl,
    confirmation_code: confirmationCode,
  });
}

async function deleteUserData(userId: string, confirmationCode: string): Promise<void> {
  const supabase = createAdminClient();

  // 1) Busca conversations do user
  const { data: convs } = await supabase
    .from("conversations")
    .select("id")
    .eq("contact_phone", userId);

  const convIds = (convs ?? []).map((c) => c.id);

  // 2) Apaga messages dessas conversations (se messages.conversation_id não tiver CASCADE)
  if (convIds.length > 0) {
    await supabase.from("messages").delete().in("conversation_id", convIds);
  }

  // 3) Apaga conversations
  if (convIds.length > 0) {
    await supabase.from("conversations").delete().in("id", convIds);
  }

  // 4) Atualiza status do request
  const finalStatus = convIds.length > 0 ? "completed" : "completed_no_data";
  await supabase
    .from("data_deletion_requests")
    .update({
      status: finalStatus,
      processed_at: new Date().toISOString(),
    })
    .eq("confirmation_code", confirmationCode);

  console.log("[data-deletion-callback] processed", {
    userId: `***${userId.slice(-4)}`,
    convsDeleted: convIds.length,
    status: finalStatus,
  });
}
