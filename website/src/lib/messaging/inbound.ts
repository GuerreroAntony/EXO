// Handler de mensagens recebidas compartilhado entre transportes (Meta Cloud API e Evolution).
// Cada transporte normaliza a mensagem para NormalizedInbound e fornece um OutboundAdapter
// para enviar a resposta. A lógica de Claude + persistência fica aqui.

import { buildSystemPromptWithKnowledge } from "@/lib/agents/prompt-builder";
import { generateReply } from "@/lib/anthropic/client";
import type { RoutedAgent } from "@/lib/agents/router";
import {
  isExternalMessageProcessed,
  findOrCreateConversation,
  insertInboundMessageGeneric,
  insertOutboundMessage,
  setOutboundMessageSentGeneric,
  setOutboundMessageFailed,
  getRecentHistory,
  escalateConversation,
  type ConversationRow,
} from "@/lib/conversations/repo";

export type Transport = "meta" | "evolution";

export interface NormalizedInbound {
  externalId: string;
  fromPhone: string;
  contactName: string | null;
  text: string | null;
  rawType: string;
}

export interface OutboundAdapter {
  sendText(to: string, body: string): Promise<{ id: string }>;
  markAsRead?(externalId: string): Promise<void>;
}

const FALLBACK_REPLY =
  "Desculpe, tive um problema técnico para responder agora. Já avisei a equipe e em breve um humano vai te atender.";

const UNSUPPORTED_REPLY =
  "Por enquanto consigo responder apenas mensagens de texto. Em breve vou suportar áudio, imagem e documentos.";

export async function handleInboundMessage(
  agent: RoutedAgent,
  inbound: NormalizedInbound,
  adapter: OutboundAdapter,
  transport: Transport,
): Promise<void> {
  if (await isExternalMessageProcessed(transport, inbound.externalId)) {
    console.log("[messaging/inbound] skip duplicate", { transport, id: inbound.externalId });
    return;
  }

  const conversation = await findOrCreateConversation({
    organizationId: agent.organization_id,
    agentId: agent.id,
    contactPhone: inbound.fromPhone,
    contactName: inbound.contactName,
  });

  const inboundContent = inbound.text ?? `[${inbound.rawType}]`;

  await insertInboundMessageGeneric({
    conversationId: conversation.id,
    content: inboundContent,
    transport,
    externalMessageId: inbound.externalId,
  });

  if (adapter.markAsRead) {
    adapter.markAsRead(inbound.externalId).catch((err) =>
      console.warn("[messaging/inbound] markAsRead failed", {
        id: inbound.externalId,
        err: String(err),
      }),
    );
  }

  if (!conversation.auto_reply || conversation.status !== "active") {
    console.log("[messaging/inbound] auto_reply off, skipping LLM", {
      conv: conversation.id,
      status: conversation.status,
    });
    return;
  }

  if (inbound.text === null) {
    await sendAndPersistAgentReply(conversation, UNSUPPORTED_REPLY, inbound.fromPhone, adapter, transport, undefined);
    return;
  }

  if (!agent.system_prompt) {
    console.error("[messaging/inbound] agent missing system_prompt", agent.id);
    await sendAndPersistAgentReply(conversation, FALLBACK_REPLY, inbound.fromPhone, adapter, transport, undefined);
    await escalateConversation(conversation.id);
    return;
  }

  let replyText: string;
  let metrics: { inputTokens: number; outputTokens: number; costUsd: number } | undefined;

  try {
    const history = await getRecentHistory(conversation.id, 20);
    const fullPrompt = await buildSystemPromptWithKnowledge(
      agent.id,
      agent.organization_id,
      agent.system_prompt,
    );
    const result = await generateReply(fullPrompt, history);
    replyText = result.text || FALLBACK_REPLY;
    metrics = {
      inputTokens: result.inputTokens + result.cacheReadTokens + result.cacheCreationTokens,
      outputTokens: result.outputTokens,
      costUsd: result.costUsd,
    };
    console.log("[messaging/inbound] claude reply", {
      transport,
      conv: conversation.id,
      inputTokens: metrics.inputTokens,
      outputTokens: metrics.outputTokens,
      costUsd: metrics.costUsd,
      cacheRead: result.cacheReadTokens,
    });
  } catch (err) {
    console.error("[messaging/inbound] claude failed", {
      conv: conversation.id,
      err: err instanceof Error ? err.message : String(err),
    });
    replyText = FALLBACK_REPLY;
    await escalateConversation(conversation.id);
  }

  await sendAndPersistAgentReply(conversation, replyText, inbound.fromPhone, adapter, transport, metrics);
}

async function sendAndPersistAgentReply(
  conversation: ConversationRow,
  text: string,
  to: string,
  adapter: OutboundAdapter,
  transport: Transport,
  metrics: { inputTokens: number; outputTokens: number; costUsd: number } | undefined,
): Promise<void> {
  const outbound = await insertOutboundMessage({
    conversationId: conversation.id,
    content: text,
    senderType: "agent",
    claudeMetrics: metrics,
  });

  try {
    const sent = await adapter.sendText(to, text);
    await setOutboundMessageSentGeneric(outbound.id, transport, sent.id);
    console.log("[messaging/inbound] sent", { transport, conv: conversation.id, id: sent.id });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[messaging/inbound] sendText failed", {
      transport,
      conv: conversation.id,
      err: errMsg,
    });
    await setOutboundMessageFailed(outbound.id, errMsg);
  }
}
