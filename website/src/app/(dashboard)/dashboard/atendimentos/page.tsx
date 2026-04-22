"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, X, Clock, User, Headphones, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

/* ───── Live Calls Component ───── */
interface LiveCall {
  id: string;
  vapi_call_id: string;
  agent_name: string;
  agent_type: string;
  customer_number: string;
  customer_name: string | null;
  status: string;
  started_at: string;
  last_transcript: string | null;
}

const typeColors: Record<string, string> = {
  recepcionista: "text-violet-400 bg-violet-500/15",
  sac: "text-blue-400 bg-blue-500/15",
  cobranca: "text-amber-400 bg-amber-500/15",
  agendamento: "text-emerald-400 bg-emerald-500/15",
};

function LiveCalls() {
  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    const fetchCalls = async () => {
      const { data } = await supabase
        .from("ligacoes_ativas")
        .select("*")
        .order("started_at", { ascending: false });
      setCalls((data ?? []) as LiveCall[]);
    };
    fetchCalls();

    // Poll every 3 seconds
    const interval = setInterval(fetchCalls, 3000);

    // Timer for duration display
    const timer = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  function formatElapsed(startedAt: string): string {
    const seconds = Math.floor((now - new Date(startedAt).getTime()) / 1000);
    if (seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${calls.length > 0 ? "animate-ping bg-emerald-400" : "bg-[#444]"}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${calls.length > 0 ? "bg-emerald-500" : "bg-[#444]"}`} />
        </span>
        <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider">
          Ao vivo {calls.length > 0 && <span className="text-emerald-400 ml-1">({calls.length})</span>}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {calls.length === 0 ? (
          <div className="bg-[#151515] border border-[#333] border-dashed rounded-xl p-5 flex items-center justify-center min-h-[100px]">
            <div className="text-center">
              <PhoneCall className="w-6 h-6 text-[#333] mx-auto mb-2" />
              <p className="text-[13px] text-[#999]">Nenhuma ligação ativa</p>
            </div>
          </div>
        ) : (
          calls.map((call) => {
            const color = typeColors[call.agent_type] ?? "text-[#999] bg-[#1a1a1a]";
            return (
              <div key={call.id} className="bg-[#151515] border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/30">
                  <div className="h-full bg-emerald-400 animate-pulse" style={{ width: "100%" }} />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                      <Headphones size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{call.agent_name}</p>
                      <p className="text-[11px] text-[#999] capitalize">{call.agent_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[12px] font-mono">{formatElapsed(call.started_at)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-[#999]" />
                    <span className="text-[13px] text-[#666]">{call.customer_name || call.customer_number}</span>
                  </div>
                  {call.customer_name && (
                    <span className="text-[11px] text-[#999] font-mono">{call.customer_number}</span>
                  )}
                </div>

                {call.last_transcript && (
                  <div className="mt-3 bg-[#1a1a1a] rounded-lg px-3 py-2">
                    <p className="text-[12px] text-[#888] italic truncate">&ldquo;{call.last_transcript}&rdquo;</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ───── Types ───── */
interface Atendimento {
  id: string;
  criado_em: string;
  agente: string;
  canal: string;
  direcao: string;
  resultado: string;
  resumo: string;
  duracao_segundos: number | null;
  transcricao: string | null;
  recording_url: string | null;
  pacientes?: { nome: string; telefone: string } | null;
}

interface AtendimentoRow {
  id: string;
  data: string;
  paciente: string;
  telefone: string;
  agente: string;
  canal: string;
  direcao: string;
  resultado: string;
  resumo: string;
  duracao: string;
  duracao_segundos: number | null;
  transcricao: string | null;
  recording_url: string | null;
  criado_em: string;
  [key: string]: unknown;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month} ${hours}:${mins}`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const columns: Column<AtendimentoRow>[] = [
  { key: "data", label: "Data" },
  { key: "paciente", label: "Paciente" },
  { key: "agente", label: "Agente" },
  {
    key: "canal",
    label: "Canal",
    render: (row) => <StatusBadge status={row.canal.toLowerCase() === "whatsapp" ? "whatsapp" : "voz"} />,
  },
  { key: "direcao", label: "Direção" },
  { key: "resultado", label: "Resultado" },
  { key: "duracao", label: "Duração" },
];

export default function AtendimentosPage() {
  const [data, setData] = useState<AtendimentoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [agente, setAgente] = useState("todos");
  const [canal, setCanal] = useState("todos");
  const [selected, setSelected] = useState<AtendimentoRow | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("atendimentos_log")
      .select("*, pacientes(nome, telefone)")
      .order("criado_em", { ascending: false })
      .then(({ data: rows }) => {
        const mapped: AtendimentoRow[] = (rows ?? []).map((r: Atendimento) => ({
          id: r.id,
          data: formatDate(r.criado_em),
          paciente: r.pacientes?.nome ?? "—",
          telefone: r.pacientes?.telefone ?? "—",
          agente: r.agente ?? "—",
          canal: r.canal ?? "—",
          direcao: r.direcao ?? "—",
          resultado: r.resultado ?? "—",
          resumo: r.resumo ?? "",
          duracao: formatDuration(r.duracao_segundos),
          duracao_segundos: r.duracao_segundos,
          transcricao: r.transcricao ?? null,
          recording_url: r.recording_url ?? null,
          criado_em: r.criado_em,
        }));
        setData(mapped);
        setLoading(false);
      });
  }, []);

  const filtered = data.filter((row) => {
    if (agente !== "todos" && !row.agente.toLowerCase().includes(agente)) return false;
    if (canal !== "todos" && row.canal.toLowerCase() !== canal) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Ligações" subtitle="Monitore ligações em tempo real e consulte o histórico" />

      {/* Live Calls */}
      <LiveCalls />

      {/* History section */}
      <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider mb-4">Histórico</h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={agente}
          onChange={(e) => setAgente(e.target.value)}
          className="bg-[#151515] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white appearance-none cursor-pointer hover:bg-[#1a1a1a] transition-colors"
        >
          <option value="todos">Todos os Agentes</option>
          <option value="recepcionista">Recepcionista</option>
          <option value="sac">SAC</option>
          <option value="cobranca">Cobrança</option>
          <option value="agendamento">Agendamento</option>
        </select>
        <select
          value={canal}
          onChange={(e) => setCanal(e.target.value)}
          className="bg-[#151515] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white appearance-none cursor-pointer hover:bg-[#1a1a1a] transition-colors"
        >
          <option value="todos">Todos os Canais</option>
          <option value="voz">Voz</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <PhoneCall className="w-10 h-10 text-[#333] mx-auto mb-4" />
          <p className="text-[#888]">Nenhuma ligação registrada</p>
          <p className="text-sm text-[#999] mt-1">As ligações aparecerão aqui quando os agentes atenderem.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Nenhuma ligação encontrada"
          onRowClick={(row) => setSelected(row)}
        />
      )}

      {/* Call Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-[#111] border-l border-[#2a2a2a] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#111] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-lg font-semibold text-white">Detalhes da ligação</h2>
                  <p className="text-sm text-[#888]">{selected.data}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#222] text-[#888] hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Info cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[#888] mb-2">
                      <User size={14} />
                      <span className="text-[11px] uppercase tracking-wider">Paciente</span>
                    </div>
                    <p className="text-sm text-white font-medium">{selected.paciente}</p>
                    <p className="text-[12px] text-[#999] font-mono mt-0.5">{selected.telefone}</p>
                  </div>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[#888] mb-2">
                      <Headphones size={14} />
                      <span className="text-[11px] uppercase tracking-wider">Agente</span>
                    </div>
                    <p className="text-sm text-white font-medium capitalize">{selected.agente}</p>
                    <div className="mt-1">
                      <StatusBadge status={selected.canal.toLowerCase() === "whatsapp" ? "whatsapp" : "voz"} />
                    </div>
                  </div>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[#888] mb-2">
                      {selected.direcao === "inbound" ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />}
                      <span className="text-[11px] uppercase tracking-wider">Direção</span>
                    </div>
                    <p className="text-sm text-white font-medium">{selected.direcao === "inbound" ? "Recebida" : "Realizada"}</p>
                  </div>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[#888] mb-2">
                      <Clock size={14} />
                      <span className="text-[11px] uppercase tracking-wider">Duração</span>
                    </div>
                    <p className="text-sm text-white font-medium">{selected.duracao}</p>
                  </div>
                </div>

                {/* Resultado */}
                <div>
                  <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider mb-2">Resultado</h3>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <p className="text-sm text-[#666]">{selected.resultado}</p>
                  </div>
                </div>

                {/* Resumo */}
                {selected.resumo && (
                  <div>
                    <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider mb-2">Resumo</h3>
                    <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                      <p className="text-sm text-[#666]">{selected.resumo}</p>
                    </div>
                  </div>
                )}

                {/* Transcrição */}
                <div>
                  <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider mb-2">Transcrição</h3>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-5">
                    {selected.transcricao ? (
                      <div className="space-y-3">
                        {selected.transcricao.split("\n").map((line, i) => {
                          const isAgent = line.startsWith("Agente:");
                          const text = line.replace(/^(Agente|Cliente):\s*/, "");
                          return (
                            <div key={i} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                                isAgent
                                  ? "bg-[#5B9BF3]/10 border border-[#5B9BF3]/20"
                                  : "bg-[#1a1a1a] border border-[#333]"
                              }`}>
                                <p className="text-[11px] font-mono text-[#999] mb-1">{isAgent ? "Agente" : "Cliente"}</p>
                                <p className="text-[13px] text-white">{text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PhoneCall className="w-8 h-8 text-[#333] mx-auto mb-3" />
                        <p className="text-sm text-[#888]">Transcrição não disponível</p>
                        <p className="text-[12px] text-[#999] mt-1">Faça uma ligação para gerar a transcrição automaticamente.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gravação */}
                <div>
                  <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider mb-2">Gravação</h3>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-5">
                    {selected.recording_url ? (
                      <audio controls className="w-full" src={selected.recording_url}>
                        Seu navegador não suporta áudio.
                      </audio>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-[#888]">Gravação não disponível</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
