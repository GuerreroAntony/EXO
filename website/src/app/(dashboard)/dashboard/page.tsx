"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  PhoneCall,
  Headphones,
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Ligações"
          value={loading ? "--" : String(totalLigacoes)}
          icon={PhoneCall}
          trend="neutral"
          trendValue="--"
          delay={0}
          color="#5B9BF3"
        />
        <KPICard
          title="Agentes Ativos"
          value={loading ? "--" : String(agentesAtivos)}
          icon={Headphones}
          trend="neutral"
          trendValue="--"
          delay={0.05}
          color="#22c55e"
        />
        <KPICard
          title="Tickets Abertos"
          value={loading ? "--" : String(ticketsAbertos)}
          icon={Ticket}
          trend="neutral"
          trendValue="--"
          delay={0.1}
          color="#f59e0b"
        />
        <KPICard
          title="Minutos Totais"
          value={loading ? "--" : `${minutosTotal} min`}
          icon={Timer}
          trend="neutral"
          trendValue="--"
          delay={0.15}
          color="#a78bfa"
        />
      </div>

      {/* Agentes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs text-[#666] uppercase tracking-wider font-medium">Agentes</h3>
          <Link
            href="/dashboard/agentes/novo"
            className="flex items-center gap-1.5 text-[12px] text-[#5B9BF3] hover:text-[#7DB4F8] transition-colors font-medium"
          >
            <Plus size={14} />
            Novo Agente
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-5 h-5 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-16 bg-[#151515] rounded-2xl border border-[#333]">
            <Headphones className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#999]">Nenhum agente configurado</p>
            <Link
              href="/dashboard/agentes/novo"
              className="inline-flex items-center gap-2 mt-3 text-sm text-[#5B9BF3] hover:text-[#7DB4F8] font-medium"
            >
              Criar primeiro agente <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => {
              const color = typeColors[agent.agent_type] ?? "text-[#999] bg-[#1a1a1a]";
              const isActive = agent.status === "active" || agent.status === "ativo";
              return (
                <div
                  key={agent.id}
                  className="bg-[#151515] rounded-xl border border-[#333] p-4 hover:bg-[#1a1a1a] hover:border-[#2a2a2a] transition-all duration-150"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                      <Headphones size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{agent.agent_name}</p>
                      <p className="text-[11px] text-[#666]">{agent.agent_type}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-emerald-500" : "bg-[#444]"}`} />
                  </div>
                  {agent.phone_number && (
                    <p className="text-[12px] text-[#999] font-mono">{agent.phone_number}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Atividade Recente */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs text-[#666] uppercase tracking-wider font-medium">Atividade Recente</h3>
          <Link
            href="/dashboard/atendimentos"
            className="text-[12px] text-[#5B9BF3] hover:text-[#7DB4F8] transition-colors font-medium"
          >
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-5 h-5 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-16 bg-[#151515] rounded-2xl border border-[#333]">
            <PhoneCall className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#999]">Nenhuma ligação registrada</p>
            <p className="text-[13px] text-[#666] mt-1">As ligações aparecerão aqui quando os agentes atenderem.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden bg-[#151515] border border-[#333]">
            {recentActivity.map((item, i) => (
              <div
                key={item.id ?? i}
                className="flex items-center gap-4 px-6 py-4 border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#1a1a1a] transition-colors duration-100"
              >
                <span className="text-xs text-[#666] font-mono w-12 shrink-0">
                  {formatTime(item.criado_em)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white font-medium">{item.pacientes?.nome ?? "--"}</span>
                  <span className="text-sm text-[#999] ml-2">{item.resultado ?? "--"}</span>
                </div>
                {item.duracao_segundos && (
                  <span className="text-xs text-[#666] font-mono shrink-0">
                    {Math.floor(item.duracao_segundos / 60)}:{String(item.duracao_segundos % 60).padStart(2, "0")}
                  </span>
                )}
                <span className="text-xs text-[#666] font-mono shrink-0">{item.agente ?? "--"}</span>
                <StatusBadge status={(item.canal ?? "").toLowerCase() === "whatsapp" ? "whatsapp" : "voz"} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
