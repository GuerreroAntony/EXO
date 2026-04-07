"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PhoneCall,
  Bot,
  Ticket,
  Timer,
  Phone,
  MessageCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

interface ProvisionedAgent {
  id: string;
  agent_name: string;
  agent_type: string;
  status: string;
  phone_number: string | null;
  vapi_assistant_id: string | null;
}

interface ActivityRow {
  id: string;
  criado_em: string;
  agente: string;
  resultado: string;
  canal: string;
  duracao_segundos: number | null;
  pacientes?: { nome: string } | null;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const typeColors: Record<string, string> = {
  recepcionista: "text-violet-400 bg-violet-500/15",
  sac: "text-blue-400 bg-blue-500/15",
  cobranca: "text-amber-400 bg-amber-500/15",
  agendamento: "text-emerald-400 bg-emerald-500/15",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalLigacoes, setTotalLigacoes] = useState(0);
  const [agentesAtivos, setAgentesAtivos] = useState(0);
  const [ticketsAbertos, setTicketsAbertos] = useState(0);
  const [minutosTotal, setMinutosTotal] = useState(0);
  const [agents, setAgents] = useState<ProvisionedAgent[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityRow[]>([]);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from("atendimentos_log").select("id, duracao_segundos"),
      supabase.from("agent_provisioning").select("id, agent_name, agent_type, status, phone_number, vapi_assistant_id"),
      supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "aberto"),
      supabase.from("atendimentos_log").select("*, pacientes(nome)").order("criado_em", { ascending: false }).limit(10),
    ]).then(([atendRes, agentsRes, ticketsRes, activityRes]) => {
      const atendimentos = atendRes.data ?? [];
      setTotalLigacoes(atendimentos.length);
      const totalSec = atendimentos.reduce((sum: number, a: { duracao_segundos: number | null }) => sum + (a.duracao_segundos ?? 0), 0);
      setMinutosTotal(Math.round(totalSec / 60));

      const allAgents = (agentsRes.data ?? []) as ProvisionedAgent[];
      setAgents(allAgents);
      setAgentesAtivos(allAgents.filter((a) => a.status === "active" || a.status === "ativo").length);

      setTicketsAbertos(ticketsRes.count ?? 0);
      setRecentActivity((activityRes.data ?? []) as ActivityRow[]);
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Ligações"
          value={loading ? "—" : String(totalLigacoes)}
          icon={PhoneCall}
          trend="neutral"
          trendValue="—"
          delay={0}
        />
        <KPICard
          title="Agentes Ativos"
          value={loading ? "—" : String(agentesAtivos)}
          icon={Bot}
          trend="neutral"
          trendValue="—"
          delay={0.1}
        />
        <KPICard
          title="Tickets Abertos"
          value={loading ? "—" : String(ticketsAbertos)}
          icon={Ticket}
          trend="neutral"
          trendValue="—"
          delay={0.2}
        />
        <KPICard
          title="Minutos Totais"
          value={loading ? "—" : `${minutosTotal} min`}
          icon={Timer}
          trend="neutral"
          trendValue="—"
          delay={0.3}
        />
      </div>

      {/* Agentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider">Agentes</h3>
          <Link
            href="/dashboard/agentes/novo"
            className="flex items-center gap-1.5 text-[12px] text-[#5B9BF3] hover:text-[#5B9BF3]/80 transition-colors"
          >
            <Plus size={14} />
            Novo Agente
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-[#333] border-t-[#888] rounded-full animate-spin mx-auto" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl">
            <Bot className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-[#888]">Nenhum agente configurado</p>
            <Link
              href="/dashboard/agentes/novo"
              className="inline-flex items-center gap-2 mt-3 text-sm text-[#5B9BF3] hover:underline"
            >
              Criar primeiro agente <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {agents.map((agent) => {
              const color = typeColors[agent.agent_type] ?? "text-[#999] bg-[#1e1e1e]";
              const isActive = agent.status === "active" || agent.status === "ativo";
              return (
                <div
                  key={agent.id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#333] transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                      <Bot size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{agent.agent_name}</p>
                      <p className="text-[11px] text-[#666] font-mono">{agent.agent_type}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-emerald-500" : "bg-yellow-500"}`} />
                  </div>
                  {agent.phone_number && (
                    <p className="text-[12px] text-[#888] font-mono">{agent.phone_number}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Atividade Recente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-mono text-[#888] uppercase tracking-wider">Atividade Recente</h3>
          <Link
            href="/dashboard/atendimentos"
            className="text-[12px] text-[#5B9BF3] hover:text-[#5B9BF3]/80 transition-colors"
          >
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-6 h-6 border-2 border-[#333] border-t-[#888] rounded-full animate-spin mx-auto" />
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl">
            <PhoneCall className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-[#888]">Nenhuma ligação registrada</p>
            <p className="text-[13px] text-[#555] mt-1">As ligações aparecerão aqui quando os agentes atenderem.</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            {recentActivity.map((item, i) => (
              <div
                key={item.id ?? i}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-[#1e1e1e] last:border-b-0 hover:bg-[#161616] transition-colors"
              >
                <span className="text-[11px] text-[#666] font-mono w-12 shrink-0">
                  {formatTime(item.criado_em)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#ccc] truncate">
                    <span className="text-white font-medium">{item.pacientes?.nome ?? "—"}</span>
                    {" — "}
                    {item.resultado ?? "—"}
                  </p>
                </div>
                {item.duracao_segundos && (
                  <span className="text-[11px] text-[#555] font-mono shrink-0">
                    {Math.floor(item.duracao_segundos / 60)}:{String(item.duracao_segundos % 60).padStart(2, "0")}
                  </span>
                )}
                <span className="text-[11px] text-[#666] font-mono shrink-0">{item.agente ?? "—"}</span>
                <StatusBadge status={(item.canal ?? "").toLowerCase() === "whatsapp" ? "whatsapp" : "voz"} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
