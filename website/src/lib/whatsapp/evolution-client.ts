// Cliente da Evolution API (WhatsApp Web não-oficial via Baileys).
// Espelha a interface de client.ts (Meta Cloud API) para que a camada de
// envio possa escolher o adapter pelo discriminador agent_provisioning.transport.

const BASE = process.env.EVOLUTION_API_URL;
const KEY = process.env.EVOLUTION_API_KEY;
const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL;
const WEBHOOK_TOKEN = process.env.EVOLUTION_WEBHOOK_TOKEN;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function evoFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = requireEnv("EVOLUTION_API_URL", BASE);
  const apikey = requireEnv("EVOLUTION_API_KEY", KEY);

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey,
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Evolution ${res.status}: ${errText}`);
  }

  return (await res.json()) as T;
}

export interface EvolutionInstanceCreated {
  instance: { instanceName: string; instanceId?: string; status: string };
  hash?: string;
}

export async function createInstance(
  instanceName: string,
): Promise<EvolutionInstanceCreated> {
  const publicAppUrl = requireEnv("PUBLIC_APP_URL", PUBLIC_APP_URL);
  const webhookToken = requireEnv("EVOLUTION_WEBHOOK_TOKEN", WEBHOOK_TOKEN);

  return evoFetch<EvolutionInstanceCreated>("/instance/create", {
    method: "POST",
    body: JSON.stringify({
      instanceName,
      qrcode: false,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
        url: `${publicAppUrl}/api/webhook/evolution?token=${webhookToken}`,
        byEvents: false,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE", "MESSAGES_UPDATE"],
      },
    }),
  });
}

export interface EvolutionPairingResult {
  pairingCode: string;
  code?: string;
  base64?: string;
}

export async function connectInstance(
  instanceName: string,
  phoneE164NoPlus: string,
): Promise<EvolutionPairingResult> {
  return evoFetch<EvolutionPairingResult>(
    `/instance/connect/${encodeURIComponent(instanceName)}?number=${encodeURIComponent(phoneE164NoPlus)}`,
  );
}

export interface EvolutionConnectionState {
  instance: { instanceName: string; state: "open" | "close" | "connecting" };
}

export async function getConnectionState(
  instanceName: string,
): Promise<EvolutionConnectionState> {
  return evoFetch<EvolutionConnectionState>(
    `/instance/connectionState/${encodeURIComponent(instanceName)}`,
  );
}

export interface EvolutionFetchedInstance {
  instance: {
    instanceName: string;
    owner?: string;
    profileName?: string;
    profilePictureUrl?: string;
    status?: string;
  };
}

export async function fetchInstance(
  instanceName: string,
): Promise<EvolutionFetchedInstance | null> {
  const list = await evoFetch<EvolutionFetchedInstance[]>(
    `/instance/fetchInstances?instanceName=${encodeURIComponent(instanceName)}`,
  );
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}

export interface EvolutionSendResult {
  key: { id: string; remoteJid: string; fromMe: boolean };
  message: unknown;
  status: string;
}

export async function sendText(
  instanceName: string,
  to: string,
  body: string,
): Promise<EvolutionSendResult> {
  return evoFetch<EvolutionSendResult>(
    `/message/sendText/${encodeURIComponent(instanceName)}`,
    {
      method: "POST",
      body: JSON.stringify({ number: to, text: body }),
    },
  );
}

export async function deleteInstance(instanceName: string): Promise<void> {
  await evoFetch(`/instance/delete/${encodeURIComponent(instanceName)}`, {
    method: "DELETE",
  });
}

export async function logoutInstance(instanceName: string): Promise<void> {
  await evoFetch(`/instance/logout/${encodeURIComponent(instanceName)}`, {
    method: "DELETE",
  });
}
