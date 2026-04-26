const API_VERSION = process.env.WHATSAPP_API_VERSION ?? "v25.0";
const GRAPH_BASE = `https://graph.facebook.com/${API_VERSION}`;

type SendOptions = {
  phoneNumberId?: string;
  accessToken?: string;
};

export async function sendText(
  to: string,
  body: string,
  opts: SendOptions = {},
): Promise<{ id: string }> {
  return graphPost("messages", {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: false, body },
  }, opts);
}

export async function sendTemplate(
  to: string,
  templateName: string,
  languageCode: string = "en_US",
  components: unknown[] = [],
  opts: SendOptions = {},
): Promise<{ id: string }> {
  return graphPost("messages", {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components.length > 0 ? { components } : {}),
    },
  }, opts);
}

export async function markAsRead(
  messageId: string,
  opts: SendOptions = {},
): Promise<void> {
  await graphPost("messages", {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  }, opts);
}

async function graphPost(
  path: string,
  body: unknown,
  opts: SendOptions,
): Promise<{ id: string; messages?: { id: string }[] }> {
  const phoneNumberId = opts.phoneNumberId ?? requireEnv("WHATSAPP_PHONE_NUMBER_ID");
  const accessToken = opts.accessToken ?? requireEnv("WHATSAPP_ACCESS_TOKEN");

  const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Graph API ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as { messages?: { id: string }[] };
  return { id: data.messages?.[0]?.id ?? "" };
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
