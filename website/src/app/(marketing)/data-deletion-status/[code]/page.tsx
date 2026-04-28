import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Status da exclusão de dados — EXO",
  description: "Acompanhe o status do seu pedido de exclusão de dados.",
};

export const dynamic = "force-dynamic";

interface DeletionRow {
  status: string;
  source: string;
  created_at: string;
  processed_at: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string; description: string }> = {
  pending: {
    label: "Aguardando processamento",
    color: "text-yellow-400",
    description: "Seu pedido foi recebido e entrará em processamento em breve.",
  },
  processing: {
    label: "Em processamento",
    color: "text-blue-400",
    description: "Estamos identificando e removendo seus dados. Isso pode levar até 15 dias úteis.",
  },
  completed: {
    label: "Concluído",
    color: "text-emerald-400",
    description: "Seus dados pessoais foram removidos do nosso banco de dados.",
  },
  completed_no_data: {
    label: "Concluído (sem dados encontrados)",
    color: "text-emerald-400",
    description: "Não encontramos dados pessoais associados ao identificador informado.",
  },
};

export default async function DataDeletionStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // Valida formato UUID antes de consultar
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const validCode = uuidRegex.test(code);

  let row: DeletionRow | null = null;
  if (validCode && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("data_deletion_requests")
        .select("status, source, created_at, processed_at")
        .eq("confirmation_code", code)
        .maybeSingle<DeletionRow>();
      row = data;
    } catch (err) {
      console.error("[data-deletion-status] query failed", err);
    }
  }

  const statusInfo = row ? STATUS_LABELS[row.status] : null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-3">Status da exclusão</h1>
        <p className="text-[#888] mb-10">
          Acompanhe o status do seu pedido de exclusão de dados pessoais.
        </p>

        {!row ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Pedido não encontrado</h2>
            <p className="text-sm text-[#999]">
              O código <code className="font-mono text-xs text-[#666]">{code}</code> não corresponde
              a nenhum pedido em nosso sistema. Verifique se o link está correto.
            </p>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#666] mb-2">Status</p>
              <p className={`text-2xl font-semibold ${statusInfo?.color ?? "text-white"}`}>
                {statusInfo?.label ?? row.status}
              </p>
              {statusInfo?.description && (
                <p className="text-sm text-[#999] mt-2">{statusInfo.description}</p>
              )}
            </div>

            <div className="border-t border-[#1e1e1e] pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Código de confirmação</span>
                <span className="font-mono text-xs text-[#999]">{code}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Origem</span>
                <span className="text-[#999]">
                  {row.source === "meta_callback" ? "Solicitação via Meta/Facebook" : "Formulário web"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Recebido em</span>
                <span className="text-[#999]">
                  {new Date(row.created_at).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              {row.processed_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Processado em</span>
                  <span className="text-[#999]">
                    {new Date(row.processed_at).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-10 p-5 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl">
          <p className="text-sm text-[#999]">
            Tem dúvidas? Escreva pra{" "}
            <a href="mailto:privacidade@exo.tec.br" className="text-blue-400 hover:underline">
              privacidade@exo.tec.br
            </a>
            .
          </p>
          <p className="text-xs text-[#666] mt-3">
            Veja também a nossa{" "}
            <Link href="/privacidade" className="text-blue-400 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
