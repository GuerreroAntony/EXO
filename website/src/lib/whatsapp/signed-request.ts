import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Parser do `signed_request` do Meta (formato Facebook clássico, usado em Data Deletion Callback).
 *
 * Formato: `<signature_base64url>.<payload_base64url>`
 *  - signature: HMAC-SHA256 do payload (string original, antes de decode) com app_secret
 *  - payload: JSON com { algorithm, expires, issued_at, user_id, ... }
 *
 * Doc: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */
export interface SignedRequestPayload {
  algorithm: string;
  user_id: string;
  expires?: number;
  issued_at?: number;
}

export function parseSignedRequest(
  input: string | null | undefined,
  appSecret: string,
): SignedRequestPayload | null {
  if (!input || !appSecret) return null;

  const parts = input.split(".");
  if (parts.length !== 2) return null;

  const [encodedSig, encodedPayload] = parts;
  if (!encodedSig || !encodedPayload) return null;

  let receivedSig: Buffer;
  try {
    receivedSig = Buffer.from(encodedSig, "base64url");
  } catch {
    return null;
  }

  const expectedSig = createHmac("sha256", appSecret).update(encodedPayload).digest();

  if (expectedSig.length !== receivedSig.length) return null;
  if (!timingSafeEqual(expectedSig, receivedSig)) return null;

  let payload: SignedRequestPayload;
  try {
    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
    payload = JSON.parse(decoded) as SignedRequestPayload;
  } catch {
    return null;
  }

  if (payload.algorithm?.toUpperCase() !== "HMAC-SHA256") return null;
  if (typeof payload.user_id !== "string" || !payload.user_id) return null;

  return payload;
}
