/**
 * Wrapper tipado da Meta Graph API pra fluxo Embedded Signup.
 * Doc: https://developers.facebook.com/docs/whatsapp/embedded-signup
 */

const GRAPH_VERSION = process.env.WHATSAPP_API_VERSION ?? "v25.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

interface GraphFetchOptions {
  method?: "GET" | "POST" | "DELETE";
  token?: string;
  body?: Record<string, unknown>;
  query?: Record<string, string>;
  retries?: number;
}

class GraphError extends Error {
  constructor(public status: number, message: string, public detail?: unknown) {
    super(message);
    this.name = "GraphError";
  }
}

async function metaGraphFetch<T>(path: string, opts: GraphFetchOptions = {}): Promise<T> {
  const { method = "GET", token, body, query, retries = 0 } = opts;

  const url = new URL(`${GRAPH_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  }

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  let lastErr: Error | null = null;
  const attempts = retries + 1;

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const text = await res.text();
      const data = text ? (JSON.parse(text) as unknown) : null;

      if (!res.ok) {
        throw new GraphError(res.status, `Graph ${method} ${path} → ${res.status}`, data);
      }

      return data as T;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      if (i < attempts - 1) {
        const wait = Math.pow(2, i) * 1000;
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }

  throw lastErr ?? new Error("metaGraphFetch failed");
}

// ============================================================
// OAuth: trocar código por access token
// ============================================================
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appId) throw new Error("Missing env var: META_APP_ID");
  if (!appSecret) throw new Error("Missing env var: WHATSAPP_APP_SECRET");

  const res = await metaGraphFetch<TokenResponse>("/oauth/access_token", {
    query: {
      client_id: appId,
      client_secret: appSecret,
      code,
    },
  });

  return res.access_token;
}

/**
 * Converte short-lived em long-lived (60 dias).
 * Sem isso, token expira em 1-2h.
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appId) throw new Error("Missing env var: META_APP_ID");
  if (!appSecret) throw new Error("Missing env var: WHATSAPP_APP_SECRET");

  const res = await metaGraphFetch<TokenResponse>("/oauth/access_token", {
    query: {
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortLivedToken,
    },
  });

  return res.access_token;
}

// ============================================================
// Listagem de assets do cliente
// ============================================================
export interface MetaBusiness {
  id: string;
  name: string;
}

export async function getMeBusinesses(token: string): Promise<MetaBusiness[]> {
  const res = await metaGraphFetch<{ data: MetaBusiness[] }>("/me/businesses", {
    token,
    query: { fields: "id,name" },
  });
  return res.data ?? [];
}

export interface WabaPhoneNumber {
  id: string;
  display_phone_number: string;
  verified_name: string;
  quality_rating?: string;
}

export async function getWabaPhoneNumbers(
  wabaId: string,
  token: string,
): Promise<WabaPhoneNumber[]> {
  const res = await metaGraphFetch<{ data: WabaPhoneNumber[] }>(
    `/${wabaId}/phone_numbers`,
    {
      token,
      query: { fields: "id,display_phone_number,verified_name,quality_rating" },
    },
  );
  return res.data ?? [];
}

export async function getBusinessWabas(
  businessId: string,
  token: string,
): Promise<{ id: string; name: string }[]> {
  const res = await metaGraphFetch<{ data: { id: string; name: string }[] }>(
    `/${businessId}/owned_whatsapp_business_accounts`,
    {
      token,
      query: { fields: "id,name" },
    },
  );
  return res.data ?? [];
}

// ============================================================
// Provisioning: registrar número + subscribe app
// ============================================================
export async function registerPhoneNumber(
  phoneNumberId: string,
  token: string,
  pin: string = "000000",
): Promise<void> {
  await metaGraphFetch(`/${phoneNumberId}/register`, {
    method: "POST",
    token,
    body: {
      messaging_product: "whatsapp",
      pin,
    },
  });
}

export async function subscribeApp(wabaId: string, token: string): Promise<void> {
  // Retry porque a Meta tem race condition logo após embedded signup
  await metaGraphFetch(`/${wabaId}/subscribed_apps`, {
    method: "POST",
    token,
    retries: 2,
  });
}
