import { type NextRequest } from "next/server";
import { verifyMetaSignature } from "@/lib/whatsapp/verify";
import { sendText, markAsRead } from "@/lib/whatsapp/client";
import type {
  WhatsAppWebhookEvent,
  WhatsAppMessage,
  WhatsAppContact,
  TextMessage,
} from "@/lib/whatsapp/types";
import { findAgentByPhoneNumberId } from "@/lib/agents/router";
import {
  handleInboundMessage,
  type NormalizedInbound,
  type OutboundAdapter,
} from "@/lib/messaging/inbound";
import { updateMessageStatusByExternalId } from "@/lib/conversations/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
          await updateMessageStatusByExternalId("meta", s.id, s.status).catch((err) => {
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

        const adapter: OutboundAdapter = {
          sendText: (to, body) =>
            sendText(to, body, { phoneNumberId: metadata.phone_number_id }),
          markAsRead: (externalId) =>
            markAsRead(externalId, { phoneNumberId: metadata.phone_number_id }),
        };

        for (const msg of messages) {
          const inbound = normalizeMetaMessage(msg, contacts ?? []);
          await handleInboundMessage(agent, inbound, adapter, "meta").catch((err) => {
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

function normalizeMetaMessage(
  msg: WhatsAppMessage,
  contacts: WhatsAppContact[],
): NormalizedInbound {
  const contactName = contacts.find((c) => c.wa_id === msg.from)?.profile.name ?? null;
  const text = isTextMessage(msg) ? msg.text.body : null;
  return {
    externalId: msg.id,
    fromPhone: msg.from,
    contactName,
    text,
    rawType: msg.type,
  };
}

function isTextMessage(msg: WhatsAppMessage): msg is TextMessage {
  return msg.type === "text" && typeof (msg as TextMessage).text?.body === "string";
}
