import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatTurn } from "@/lib/anthropic/client";

export interface ConversationRow {
  id: string;
  organization_id: string;
  agent_id: string;
  paciente_id: string | null;
  contact_phone: string;
  contact_name: string | null;
  status: "active" | "paused" | "escalated" | "closed";
  auto_reply: boolean;
  last_message_at: string;
  unread_count: number;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  direction: "inbound" | "outbound";
  sender_type: "contact" | "agent" | "human";
  content: string | null;
  wamid: string | null;
  status: string;
  created_at: string;
}

export async function isWamidProcessed(wamid: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("messages")
    .select("id")
    .eq("wamid", wamid)
    .maybeSingle<{ id: string }>();
  return data != null;
}

export async function findOrCreateConversation(params: {
  organizationId: string;
  agentId: string;
  contactPhone: string;
  contactName: string | null;
}): Promise<ConversationRow> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("agent_id", params.agentId)
    .eq("contact_phone", params.contactPhone)
    .maybeSingle<ConversationRow>();

  if (existing) {
    if (params.contactName && !existing.contact_name) {
      await supabase
        .from("conversations")
        .update({ contact_name: params.contactName })
        .eq("id", existing.id);
      existing.contact_name = params.contactName;
    }
    return existing;
  }

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      organization_id: params.organizationId,
      agent_id: params.agentId,
      contact_phone: params.contactPhone,
      contact_name: params.contactName,
    })
    .select("*")
    .single<ConversationRow>();

  if (error || !created) throw new Error(`findOrCreateConversation failed: ${error?.message}`);
  return created;
}

export async function insertInboundMessage(params: {
  conversationId: string;
  content: string;
  wamid: string;
}): Promise<MessageRow> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: params.conversationId,
      direction: "inbound",
      sender_type: "contact",
      content: params.content,
      wamid: params.wamid,
      status: "received",
    })
    .select("*")
    .single<MessageRow>();

  if (error || !data) throw new Error(`insertInboundMessage failed: ${error?.message}`);

  await supabase
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      unread_count: await incrementUnread(params.conversationId),
    })
    .eq("id", params.conversationId);

  return data;
}

async function incrementUnread(conversationId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("conversations")
    .select("unread_count")
    .eq("id", conversationId)
    .single<{ unread_count: number }>();
  return (data?.unread_count ?? 0) + 1;
}

export async function insertOutboundMessage(params: {
  conversationId: string;
  content: string;
  senderType: "agent" | "human";
  claudeMetrics?: {
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
  };
}): Promise<MessageRow> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: params.conversationId,
      direction: "outbound",
      sender_type: params.senderType,
      content: params.content,
      status: "pending",
      claude_input_tokens: params.claudeMetrics?.inputTokens ?? null,
      claude_output_tokens: params.claudeMetrics?.outputTokens ?? null,
      claude_cost_usd: params.claudeMetrics?.costUsd ?? null,
    })
    .select("*")
    .single<MessageRow>();

  if (error || !data) throw new Error(`insertOutboundMessage failed: ${error?.message}`);
  return data;
}

export async function setOutboundMessageSent(messageId: string, wamid: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("messages")
    .update({ wamid, status: "sent" })
    .eq("id", messageId);
  if (error) throw new Error(`setOutboundMessageSent failed: ${error.message}`);
}

export async function setOutboundMessageFailed(messageId: string, errorMessage: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("messages")
    .update({ status: "failed", error_message: errorMessage })
    .eq("id", messageId);
}

export async function updateMessageStatusByWamid(wamid: string, status: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("messages").update({ status }).eq("wamid", wamid);
}

export async function getRecentHistory(conversationId: string, limit = 20): Promise<ChatTurn[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("messages")
    .select("direction, content")
    .eq("conversation_id", conversationId)
    .not("content", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data
    .reverse()
    .map((m: { direction: string; content: string | null }) => ({
      role: m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: m.content ?? "",
    }))
    .filter((t) => t.content.length > 0);
}

export async function escalateConversation(conversationId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("conversations")
    .update({ status: "escalated", auto_reply: false })
    .eq("id", conversationId);
}
