// Tipos do webhook da Evolution API.
// Formato Baileys-like — mais cru que o webhook do Meta Cloud API.

export type EvolutionConnectionStateValue = "open" | "close" | "connecting";

export type EvolutionWebhookEvent =
  | EvolutionMessagesUpsertEvent
  | EvolutionConnectionUpdateEvent
  | EvolutionMessagesUpdateEvent;

export interface EvolutionRawEvent {
  event: string;
  instance: string;
  data?: unknown;
}

export interface EvolutionMessagesUpsertEvent {
  event: "messages.upsert";
  instance: string;
  data: EvolutionMessage;
  destination?: string;
  date_time?: string;
  sender?: string;
  server_url?: string;
  apikey?: string;
}

export interface EvolutionConnectionUpdateEvent {
  event: "connection.update";
  instance: string;
  data: {
    state: EvolutionConnectionStateValue;
    statusReason?: number;
  };
}

export interface EvolutionMessagesUpdateEvent {
  event: "messages.update";
  instance: string;
  data: {
    keyId: string;
    remoteJid?: string;
    fromMe?: boolean;
    status?: string;
  };
}

export interface EvolutionMessageKey {
  id: string;
  remoteJid: string;
  fromMe: boolean;
  participant?: string;
}

export interface EvolutionMessageContent {
  conversation?: string;
  extendedTextMessage?: { text: string };
  imageMessage?: { caption?: string; mimetype?: string };
  audioMessage?: { mimetype?: string; ptt?: boolean };
  videoMessage?: { caption?: string; mimetype?: string };
  documentMessage?: { fileName?: string; mimetype?: string };
  stickerMessage?: { mimetype?: string };
  locationMessage?: { degreesLatitude?: number; degreesLongitude?: number };
  contactMessage?: { displayName?: string };
}

export interface EvolutionMessage {
  key: EvolutionMessageKey;
  pushName?: string;
  message?: EvolutionMessageContent;
  messageType: string;
  messageTimestamp: number;
  status?: string;
}

export function extractTextFromEvolutionMessage(
  msg: EvolutionMessage,
): string | null {
  return (
    msg.message?.conversation ??
    msg.message?.extendedTextMessage?.text ??
    null
  );
}

export function jidToPhoneNumber(jid: string): string {
  // remoteJid: "5511999999999@s.whatsapp.net" → "5511999999999"
  return jid.split("@")[0] ?? jid;
}
