import { type NextRequest } from "next/server";
import { verifyMetaSignature } from "@/lib/whatsapp/verify";
import { sendText, markAsRead } from "@/lib/whatsapp/client";
import type {
  WhatsAppWebhookEvent,
  WhatsAppMessage,
  WhatsAppContact,
  TextMessage,
} from "@/lib/whatsapp/types";
import { findAgentByPhoneNumberId, type RoutedAgent } from "@/lib/agents/router";
import { generateReply } from "@/lib/anthropic/client";
import {
  isWamidProcessed,
  findOrCreateConversation,
  insertInboundMessage,
  insertOutboundMessage,
  setOutboundMessageSent,
  setOutboundMessageFailed,
  updateMessageStatusByWamid,
  getRecentHistory,
  escalateConversation,
  type ConversationRow,
} from "@/lib/conversations/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_REPLY =
  "Desculpe, tive um problema técnico para responder agora. Já avisei a equipe e em breve um humano vai te atender.";

const UNSUPPORTED_REPLY =
  "Por enquanto consigo responder apenas mensagens de texto. Em breve vou suportar áudio, imagem e documentos.";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (!expected) {
    console.error("[whatsapp-webhook] WHATSAPP_WEBHOOK_VERIFY_TOKEN not configured");
    return new Response("Server misconfigured", { status: 500 });
  }

  if (mode === "subscribe" && token === expected && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error("[whatsapp-webhook] WHATSAPP_APP_SECRET not configured");
    return new Response("Server misconfigured", { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature, appSecret)) {
    console.warn("[whatsapp-webhook] Invalid signature, rejecting");
    return new Response("Unauthorized", { status: 401 });
  }

  let event: WhatsAppWebhookEvent;
  try {
    event = JSON.parse(rawBody) as WhatsAppWebhookEvent;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  for (const entry of event.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;

      const { messages, statuses, contacts, metadata } = change.value;

      if (statuses?.length) {
        for (const s of statuses) {
          await updateMessageStatusByWamid(s.id, s.status).catch((err) => {
            console.warn("[whatsapp-webhook] status update failed", { id: s.id, err: String(err) });
          });
        }
      }

      if (messages?.length) {
        const agent = await findAgentByPhoneNumberId(metadata.phone_number_id);
        if (!agent) {
          console.warn("[whatsapp-webhook] no active agent for phone_number_id", metadata.phone_number_id);
          continue;
        }

        for (const msg of messages) {
          await handleInboundMessage(msg, contacts ?? [], agent).catch((err) => {
            console.error("[whatsapp-webhook] handler crashed", {
              wamid: msg.id,
              err: err instanceof Error ? err.message : String(err),
            });
          });
        }
      }
    }
  }

  return new Response("OK", { status: 200 });
}

async function handleInboundMessage(
  msg: WhatsAppMessage,
  contacts: WhatsAppContact[],
  agent: RoutedAgent,
): Promise<void> {
  if (await isWamidProcessed(msg.id)) {
    console.log("[whatsapp-webhook] skip duplicate", msg.id);
    return;
  }

  const contactName = contacts.find((c) => c.wa_id === msg.from)?.profile.name ?? null;
  const conversation = await findOrCreateConversation({
    organizationId: agent.organization_id,
    agentId: agent.id,
    contactPhone: msg.from,
    contactName,
  });

  const textMsg = isTextMessage(msg) ? msg : null;
  const inboundContent = textMsg ? textMsg.text.body : `[${msg.type}]`;

  await insertInboundMessage({
    conversationId: conversation.id,
    content: inboundContent,
    wamid: msg.id,
  });

  markAsRead(msg.id).catch((err) =>
    console.warn("[whatsapp-webhook] markAsRead failed", { wamid: msg.id, err: String(err) }),
  );

  if (!conversation.auto_reply || conversation.status !== "active") {
    console.log("[whatsapp-webhook] auto_reply off, skipping LLM", {
      conv: conversation.id,
      status: conversation.status,
    });
    return;
  }

  if (!textMsg) {
    await sendAndPersistAgentReply(conversation, UNSUPPORTED_REPLY, msg.from, undefined);
    return;
  }

  if (!agent.system_prompt) {
    console.error("[whatsapp-webhook] agent missing system_prompt", agent.id);
    await sendAndPersistAgentReply(conversation, FALLBACK_REPLY, msg.from, undefined);
    await escalateConversation(conversation.id);
    return;
  }

  let replyText: string;
  let metrics: { inputTokens: number; outputTokens: number; costUsd: number } | undefined;

  try {
    const history = await getRecentHistory(conversation.id, 20);
    const result = await generateReply(agent.system_prompt, history);
    replyText = result.text || FALLBACK_REPLY;
    metrics = {
      inputTokens: result.inputTokens + result.cacheReadTokens + result.cacheCreationTokens,
      outputTokens: result.outputTokens,
      costUsd: result.costUsd,
    };
    console.log("[whatsapp-webhook] claude reply", {
      conv: conversation.id,
      inputTokens: metrics.inputTokens,
      outputTokens: metrics.outputTokens,
      costUsd: metrics.costUsd,
      cacheRead: result.cacheReadTokens,
    });
  } catch (err) {
    console.error("[whatsapp-webhook] claude failed", {
      conv: conversation.id,
      err: err instanceof Error ? err.message : String(err),
    });
    replyText = FALLBACK_REPLY;
    await escalateConversation(conversation.id);
  }

  await sendAndPersistAgentReply(conversation, replyText, msg.from, metrics);
}

function isTextMessage(msg: WhatsAppMessage): msg is TextMessage {
  return msg.type === "text" && typeof (msg as TextMessage).text?.body === "string";
}

async function sendAndPersistAgentReply(
  conversation: ConversationRow,
  text: string,
  to: string,
  metrics: { inputTokens: number; outputTokens: number; costUsd: number } | undefined,
): Promise<void> {
  const outbound = await insertOutboundMessage({
    conversationId: conversation.id,
    content: text,
    senderType: "agent",
    claudeMetrics: metrics,
  });

  try {
    const sent = await sendText(to, text);
    await setOutboundMessageSent(outbound.id, sent.id);
    console.log("[whatsapp-webhook] sent", { conv: conversation.id, wamid: sent.id });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[whatsapp-webhook] sendText failed", { conv: conversation.id, err: errMsg });
    await setOutboundMessageFailed(outbound.id, errMsg);
  }
}
