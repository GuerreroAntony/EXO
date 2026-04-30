import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findAgentByEvolutionInstance } from "@/lib/agents/router";
import {
  handleInboundMessage,
  type NormalizedInbound,
  type OutboundAdapter,
} from "@/lib/messaging/inbound";
import { updateMessageStatusByExternalId } from "@/lib/conversations/repo";
import {
  type EvolutionRawEvent,
  type EvolutionMessage,
  type EvolutionConnectionStateValue,
  extractTextFromEvolutionMessage,
  jidToPhoneNumber,
} from "@/lib/whatsapp/evolution-types";
import { sendText as evolutionSendText } from "@/lib/whatsapp/evolution-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const expectedToken = process.env.EVOLUTION_WEBHOOK_TOKEN;
  if (!expectedToken) {
    console.error("[evolution-webhook] EVOLUTION_WEBHOOK_TOKEN not configured");
    return new Response("Server misconfigured", { status: 500 });
  }

  const token = request.nextUrl.searchParams.get("token");
  if (token !== expectedToken) {
    console.warn("[evolution-webhook] invalid token");
    return new Response("Unauthorized", { status: 401 });
  }

  let event: EvolutionRawEvent;
  try {
    event = (await request.json()) as EvolutionRawEvent;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  try {
    if (event.event === "connection.update") {
      const data = event.data as { state?: EvolutionConnectionStateValue } | undefined;
      if (data?.state) {
        const admin = createAdminClient();
        await admin
          .from("agent_provisioning")
          .update({ evolution_connection_state: data.state })
          .eq("evolution_instance_name", event.instance);
      }
      return new Response("OK");
    }

    if (event.event === "messages.update") {
      const data = event.data as { keyId?: string; status?: string } | undefined;
      const status = data?.status?.toLowerCase();
      if (status && data?.keyId) {
        const mapped = mapBaileysStatus(status);
        if (mapped) {
          await updateMessageStatusByExternalId("evolution", data.keyId, mapped).catch((err) =>
            console.warn("[evolution-webhook] status update failed", { err: String(err) }),
          );
        }
      }
      return new Response("OK");
    }

    if (event.event === "messages.upsert") {
      const m = event.data as EvolutionMessage | undefined;
      if (!m?.key) return new Response("OK");
      if (m.key.fromMe) return new Response("OK");

      const agent = await findAgentByEvolutionInstance(event.instance);
      if (!agent) {
        console.warn("[evolution-webhook] no active agent for instance", event.instance);
        return new Response("OK");
      }

      const inbound: NormalizedInbound = {
        externalId: m.key.id,
        fromPhone: jidToPhoneNumber(m.key.remoteJid),
        contactName: m.pushName ?? null,
        text: extractTextFromEvolutionMessage(m),
        rawType: m.messageType,
      };

      const adapter: OutboundAdapter = {
        sendText: async (to, body) => {
          const result = await evolutionSendText(event.instance, to, body);
          return { id: result.key.id };
        },
      };

      await handleInboundMessage(agent, inbound, adapter, "evolution");
      return new Response("OK");
    }

    return new Response("OK");
  } catch (err) {
    console.error("[evolution-webhook] handler crashed", {
      event: event.event,
      err: err instanceof Error ? err.message : String(err),
    });
    return new Response("OK");
  }
}

function mapBaileysStatus(status: string): string | null {
  // Baileys: "ERROR" | "PENDING" | "SERVER_ACK" | "DELIVERY_ACK" | "READ" | "PLAYED"
  switch (status) {
    case "pending":
      return "pending";
    case "server_ack":
      return "sent";
    case "delivery_ack":
      return "delivered";
    case "read":
    case "played":
      return "read";
    case "error":
      return "failed";
    default:
      return null;
  }
}
