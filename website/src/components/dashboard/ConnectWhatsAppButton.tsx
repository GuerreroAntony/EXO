"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import { Loader2, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    FB?: {
      init: (config: { appId: string; cookie?: boolean; xfbml?: boolean; version: string }) => void;
      login: (
        callback: (response: FBLoginResponse) => void,
        options: FBLoginOptions,
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

interface FBLoginResponse {
  authResponse?: {
    accessToken?: string;
    code?: string;
    userID?: string;
  } | null;
  status?: string;
}

interface FBLoginOptions {
  config_id?: string;
  response_type?: string;
  override_default_response_type?: boolean;
  scope?: string;
  extras?: Record<string, unknown>;
}

const FB_SDK_VERSION = "v25.0";

interface ConnectionResult {
  ok: boolean;
  display_name?: string;
  phone_number_id?: string;
  error?: string;
}

export default function ConnectWhatsAppButton({
  onConnected,
}: {
  onConnected?: (result: ConnectionResult) => void;
}) {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const configId = process.env.NEXT_PUBLIC_META_CONFIG_ID;

  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConnectionResult | null>(null);

  const initSdk = useCallback(() => {
    if (!appId) {
      console.error("[ConnectWhatsApp] NEXT_PUBLIC_META_APP_ID não configurado");
      return;
    }
    if (typeof window === "undefined" || !window.FB) return;
    window.FB.init({
      appId,
      cookie: true,
      xfbml: false,
      version: FB_SDK_VERSION,
    });
    setSdkReady(true);
  }, [appId]);

  useEffect(() => {
    // Se SDK já carregou (cache), inicializa direto
    if (typeof window !== "undefined" && window.FB) {
      initSdk();
    }
    // Hook do SDK quando ele carrega
    if (typeof window !== "undefined") {
      window.fbAsyncInit = initSdk;
    }
  }, [initSdk]);

  function launchSignup() {
    if (!appId || !configId) {
      setResult({
        ok: false,
        error: "Configuração da Meta não está completa. Avise o suporte.",
      });
      return;
    }
    if (!window.FB) {
      setResult({ ok: false, error: "SDK do Facebook ainda carregando, tente de novo." });
      return;
    }

    setLoading(true);
    setResult(null);

    window.FB.login(
      async (response) => {
        const code = response.authResponse?.code;
        if (!code) {
          setLoading(false);
          if (response.status !== "connected") {
            setResult({ ok: false, error: "Conexão cancelada." });
          }
          return;
        }

        try {
          const res = await fetch("/api/oauth/meta/callback", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const data = (await res.json()) as ConnectionResult;
          setResult(data);
          if (data.ok && onConnected) onConnected(data);
        } catch (err) {
          setResult({
            ok: false,
            error: err instanceof Error ? err.message : "Falha ao conectar.",
          });
        } finally {
          setLoading(false);
        }
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "whatsapp_embedded_signup",
          sessionInfoVersion: "3",
        },
      },
    );
  }

  const isConfigured = Boolean(appId && configId);

  return (
    <>
      <Script
        src={`https://connect.facebook.net/en_US/sdk.js`}
        strategy="afterInteractive"
        onReady={initSdk}
      />

      <div className="space-y-3">
        <button
          type="button"
          onClick={launchSignup}
          disabled={loading || !sdkReady || !isConfigured}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <MessageCircle size={16} />
              {sdkReady ? "Conectar WhatsApp" : "Carregando..."}
            </>
          )}
        </button>

        {!isConfigured && (
          <div className="flex items-start gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-400">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>
              Configure as variáveis NEXT_PUBLIC_META_APP_ID e NEXT_PUBLIC_META_CONFIG_ID no Vercel
              pra habilitar a conexão.
            </span>
          </div>
        )}

        {result?.ok && (
          <div className="flex items-start gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
            <span>
              WhatsApp conectado: <strong>{result.display_name}</strong>. Mensagens já vão chegar
              no painel.
            </span>
          </div>
        )}

        {result && !result.ok && (
          <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{result.error ?? "Falha desconhecida."}</span>
          </div>
        )}
      </div>
    </>
  );
}
