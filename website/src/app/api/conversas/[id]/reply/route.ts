import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendText } from "@/lib/whatsapp/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, ctx: RouteContext<"/api/conversas/[id]/reply">) {
  const supabase = await createClient();
  const { id: conversationId } = await ctx.params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = (await request.json().catch(() => null)) as { content?: string } | null;
  const content = body?.content?.trim();
  if (!content) return new Response("Missing content", { status: 400 });

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, contact_phone, auto_reply, status")
    .eq("id", conversationId)
    .maybeSingle<{ id: string; contact_phone: string; auto_reply: boolean; status: string }>();

  if (!conv) return new Response("Conversation not found", { status: 404 });

  const { data: outbound, error: insertErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      direction: "outbound",
      sender_type: "human",
      content,
      status: "pending",
    })
    .select("id")
    .single<{ id: string }>();

  if (insertErr || !outbound) {
    return new Response(`Insert failed: ${insertErr?.message}`, { status: 500 });
  }

  if (conv.auto_reply) {
    await supabase.from("conversations").update({ auto_reply: false }).eq("id", conversationId);
  }

  try {
    const sent = await sendText(conv.contact_phone, content);
    await supabase
      .from("messages")
      .update({ wamid: sent.id, status: "sent" })
      .eq("id", outbound.id);

    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    return Response.json({ ok: true, wamid: sent.id });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await supabase
      .from("messages")
      .update({ status: "failed", error_message: errMsg })
      .eq("id", outbound.id);
    return new Response(`sendText failed: ${errMsg}`, { status: 502 });
  }
}
