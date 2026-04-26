import { type NextRequest } from "next/server";
import { verifyMetaSignature } from "@/lib/whatsapp/verify";
import type { WhatsAppWebhookEvent } from "@/lib/whatsapp/types";

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

      if (messages?.length) {
        for (const msg of messages) {
          console.log("[whatsapp-webhook] message", {
            from: msg.from,
            type: msg.type,
            id: msg.id,
            phone_number_id: metadata.phone_number_id,
            contact_name: contacts?.find((c) => c.wa_id === msg.from)?.profile.name,
          });
        }
      }

      if (statuses?.length) {
        for (const s of statuses) {
          console.log("[whatsapp-webhook] status", {
            id: s.id,
            recipient: s.recipient_id,
            status: s.status,
          });
        }
      }
    }
  }

  return new Response("OK", { status: 200 });
}
