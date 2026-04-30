import { Resend } from "resend";

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  cachedClient = new Resend(apiKey);
  return cachedClient;
}

function getFrom(): string {
  return process.env.EMAIL_FROM || "EXO <parear@mail.exo.tec.br>";
}

export interface PairingEmailParams {
  to: string;
  agentName: string;
  pairingCode: string;
  phoneE164: string;
  expiresAt: string;
}

function formatPairingCode(code: string): string {
  const clean = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  if (clean.length === 8) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  return clean;
}

export async function sendPairingEmail(params: PairingEmailParams): Promise<{ id: string }> {
  const code = formatPairingCode(params.pairingCode);
  const expires = new Date(params.expiresAt);
  const expiresStr = expires.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#e5e5e5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellspacing="0" cellpadding="0" style="background:#151515;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#5B9BF3;font-weight:600;">EXO · Pareamento</p>
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#fff;line-height:1.3;">Conecte seu WhatsApp ao agente <span style="color:#5B9BF3;">${escapeHtml(params.agentName)}</span></h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 16px;font-size:14px;color:#aaa;line-height:1.6;">
                Use o código abaixo no WhatsApp do número <strong style="color:#fff;">${escapeHtml(params.phoneE164)}</strong> pra ativar o agente. Válido até <strong style="color:#fff;">${escapeHtml(expiresStr)}</strong>.
              </p>
              <div style="background:#0d0d0d;border:1px solid #2a4a7a;border-radius:12px;padding:24px;text-align:center;margin:8px 0 24px;">
                <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#5B9BF3;font-weight:600;">Código de pareamento</p>
                <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.25em;color:#fff;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${escapeHtml(code)}</p>
              </div>
              <ol style="margin:0;padding-left:20px;font-size:14px;color:#bbb;line-height:1.8;">
                <li>Abra o <strong style="color:#fff;">WhatsApp</strong> no celular.</li>
                <li>Toque em <strong style="color:#fff;">⋮ → Aparelhos conectados</strong>.</li>
                <li>Toque em <strong style="color:#fff;">Conectar com número de telefone</strong>.</li>
                <li>Digite o código acima.</li>
              </ol>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <div style="border-top:1px solid #2a2a2a;padding-top:20px;">
                <p style="margin:0;font-size:12px;color:#666;line-height:1.5;">
                  Não esperava esse email? Ignore — sem o código no app, ninguém consegue conectar seu WhatsApp.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const text = `EXO — Código de pareamento WhatsApp

Use o código abaixo no WhatsApp do número ${params.phoneE164} pra ativar o agente "${params.agentName}".

CÓDIGO: ${code}

Válido até ${expiresStr}.

Como usar:
1. Abra o WhatsApp no celular
2. Toque em ⋮ → Aparelhos conectados
3. Toque em "Conectar com número de telefone"
4. Digite o código

Não esperava esse email? Pode ignorar.`;

  const result = await getClient().emails.send({
    from: getFrom(),
    to: params.to,
    subject: `Seu código de pareamento WhatsApp: ${code}`,
    html,
    text,
  });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`);
  }
  if (!result.data?.id) {
    throw new Error("Resend não retornou id da mensagem");
  }
  return { id: result.data.id };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
