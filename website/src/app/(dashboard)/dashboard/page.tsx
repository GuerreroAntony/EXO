"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, CheckCircle, Clock, AlertCircle, Bot, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { mockSparklines } from "@/data/mock/analytics";
import { mockEscalonamentos } from "@/data/mock/escalonamentos";
import KPICard from "@/components/dashboard/KPICard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

interface AgentRow {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  canais: string[];
  [key: string]: unknown;
}

interface ActivityRow {
  id: string;
  criado_em: string;
  agente: string;
  resultado: string;
  canal: string;
  pacientes?: { nome: string } | null;
  [key: string]: unknown;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalAtendimentos, setTotalAtendimentos] = useState<number | null>(null);
  const [totalAgendamentos, setTotalAgendamentos] = useState<number | null>(null);
  const [ticketsAbertos, setTicketsAbertos] = useState<number | null>(null);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityRow[]>([]);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      supabase.from("atendimentos_log").select("id", { count: "exact", head: true }),
      supabase.from("agendamentos").select("id", { count: "exact", head: true }),
      supabase.from("tickets").select("id", { count: "exact", head: true }).eq("status", "aberto"),
      supabase.from("agents").select("*"),
      supabase.from("atendimentos_log").select("*, pacientes(nome)").order("criado_em", { ascending: false }).limit(5),
    ]).then(([atend, agend, tickets, agentsRes, activity]) => {
      setTotalAtendimentos(atend.count ?? 0);
      setTotalAgendamentos(agend.count ?? 0);
      setTicketsAbertos(tickets.count ?? 0);
      setAgents((agentsRes.data ?? []) as AgentRow[]);
      setRecentActivity((activity.data ?? []) as ActivityRow[]);
      setLoading(false);
    });
  }, []);

  function formatNumber(n: number | null): string {
    if (n === null) return "—";
    return n.toLocaleString("pt-BR");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Atendimentos"
          value={loading ? "—" : formatNumber(totalAtendimentos)}
          icon={Headphones}
          trend="up"
          trendValue="+12%"
          delay={0}
          sparklineData={mockSparklines.atendimentos}
        />
        <KPICard
          title="Taxa de Resolução"
          value="89%"
          icon={CheckCircle}
          trend="up"
          trendValue="+3%"
          delay={0.1}
          sparklineData={mockSparklines.resolucao}
        />
        <KPICard
          title="Tempo Médio"
          value="2m 48s"
          icon={Clock}
          trend="down"
          trendValue="-15s"
          delay={0.2}
          sparklineData={mockSparklines.tempoMedio}
        />
        <KPICard
          title="Tickets Abertos"
          value={loading ? "—" : formatNumber(ticketsAbertos)}
          icon={AlertCircle}
          trend="neutral"
          trendValue="="
          delay={0.3}
          sparklineData={mockSparklines.tickets}
        />
      </div>

      {/* Agentes Ativos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-[12px] font-mono text-white/40 uppercase tracking-wider mb-4">Agentes Ativos</h3>
        {loading ? (
          <div className="text-center py-20">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <Bot className="w-10 h-10 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">Nenhum agente configurado</p>
            <p className="text-sm text-white/15 mt-1">Os dados aparecerão aqui quando houver atividade.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => {
              const hasWhatsApp = (agent.canais ?? []).includes("WhatsApp");
              const Icon = hasWhatsApp ? MessageCircle : Phone;
              const channelLabel = (agent.canais ?? []).join(" + ") || "—";
              return (
                <div
                  key={agent.id}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#5B9BF3]/10 flex items-center justify-center">
                      <Bot size={18} className="text-[#5B9BF3]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{agent.nome}</p>
                      <p className="text-[11px] text-white/30 font-mono">{agent.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={agent.status} />
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                      <Icon size={12} />
                      {channelLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Escalonamentos Pendentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-mono text-white/40 uppercase tracking-wider">Escalonamentos Pendentes</h3>
          <Link href="/dashboard/escalonamentos" className="text-[12px] text-[#5B9BF3] hover:text-[#5B9BF3]/80 transition-colors">
            Ver todos &rarr;
          </Link>
        </div>
        {(() => {
          const pendentes = mockEscalonamentos.filter((e) => e.status === "aguardando");
          if (pendentes.length === 0) return null;
          return (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur overflow-hidden">
              {pendentes.slice(0, 3).map((esc) => (
                <div
                  key={esc.id}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${esc.prioridade === "urgente" ? "bg-red-400 animate-pulse" : esc.prioridade === "alta" ? "bg-orange-400" : "bg-yellow-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 truncate">
                      <span className="text-white">{esc.contato_nome}</span>
                      {" — "}
                      {esc.motivo.slice(0, 60)}...
                    </p>
                  </div>
                  <span className="text-[11px] text-white/30 font-mono shrink-0">{esc.tempo_aguardando}</span>
                  <StatusBadge status={esc.prioridade} />
                </div>
              ))}
            </div>
          );
        })()}
      </motion.div>

      {/* Atividade Recente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-[12px] font-mono text-white/40 uppercase tracking-wider mb-4">Atividade Recente</h3>
        {loading ? (
          <div className="text-center py-20">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-20">
            <Headphones className="w-10 h-10 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">Nenhum registro encontrado</p>
            <p className="text-sm text-white/15 mt-1">Os dados aparecerão aqui quando houver atividade.</p>
          </div>
        ) : (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur overflow-hidden">
            {recentActivity.map((item, i) => (
              <div
                key={item.id ?? i}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-[11px] text-white/30 font-mono w-12 shrink-0">
                  {formatTime(item.criado_em)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">
                    <span className="text-white">{item.pacientes?.nome ?? "—"}</span>
                    {" — "}
                    {item.resultado ?? "—"}
                  </p>
                </div>
                <span className="text-[11px] text-white/30 font-mono shrink-0">{item.agente ?? "—"}</span>
                <StatusBadge status={(item.canal ?? "").toLowerCase() === "whatsapp" ? "whatsapp" : "voz"} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
