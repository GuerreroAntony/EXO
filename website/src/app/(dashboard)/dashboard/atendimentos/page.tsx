"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

interface Atendimento {
  id: string;
  criado_em: string;
  agente: string;
  canal: string;
  direcao: string;
  resultado: string;
  duracao: string;
  pacientes?: { nome: string } | null;
  [key: string]: unknown;
}

interface AtendimentoRow {
  data: string;
  paciente: string;
  agente: string;
  canal: string;
  direcao: string;
  resultado: string;
  duracao: string;
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

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("atendimentos_log")
      .select("*, pacientes(nome)")
      .order("criado_em", { ascending: false })
      .then(({ data: rows }) => {
        const mapped: AtendimentoRow[] = (rows ?? []).map((r: Atendimento) => ({
          data: formatDate(r.criado_em),
          paciente: r.pacientes?.nome ?? "—",
          agente: r.agente ?? "—",
          canal: r.canal ?? "—",
          direcao: r.direcao ?? "—",
          resultado: r.resultado ?? "—",
          duracao: r.duracao ?? "—",
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
      <PageHeader title="Atendimentos" subtitle="Histórico de atendimentos realizados" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={agente}
          onChange={(e) => setAgente(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer hover:bg-white/[0.06] transition-colors"
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
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer hover:bg-white/[0.06] transition-colors"
        >
          <option value="todos">Todos os Canais</option>
          <option value="voz">Voz</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <Headphones className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">Nenhum registro encontrado</p>
          <p className="text-sm text-white/15 mt-1">Os dados aparecerão aqui quando houver atividade.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="Nenhum atendimento encontrado" />
      )}
    </motion.div>
  );
}
