"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Headphones,
  Clock,
  CheckCircle,
  Activity,
  Lightbulb,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import KPICard from "@/components/dashboard/KPICard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  mockAtendimentosPorHora,
  mockVolumePorDia,
  mockDistribuicaoCanal,
  mockVolumePorAgente,
  mockMotivosContato,
  mockSentimento,
  mockPalavrasFrequentes,
  mockPerguntasFrequentes,
  mockSugestoesIA,
  mockUltimosAtendimentos,
  mockSparklines,
} from "@/data/mock/analytics";

const tabs = ["Tempo Real", "Relatórios", "Insights"] as const;
type Tab = (typeof tabs)[number];

const periods = ["Hoje", "7 dias", "30 dias"] as const;

const chartTooltipStyle = {
  contentStyle: {
    background: "#1a1a1a",
    border: "1px solid #222",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  itemStyle: { color: "#fff" },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Tempo Real");
  const [period, setPeriod] = useState<string>("7 dias");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Analytics"
        subtitle="Métricas e insights dos atendimentos"
      />

      {/* Tab navigation */}
      <div className="flex gap-1 bg-[#151515] border border-[#333] rounded-2xl p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#222] text-white shadow-sm"
                : "text-[#888] hover:text-[#999]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Tempo Real */}
      {activeTab === "Tempo Real" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              title="Atendimentos Hoje"
              value="51"
              icon={Headphones}
              trend="up"
              trendValue="+12%"
              delay={0}
            />
            <KPICard
              title="Em Andamento"
              value="3"
              icon={Activity}
              trend="neutral"
              trendValue="0"
              delay={0.05}
            />
            <KPICard
              title="Taxa Resolução"
              value="89%"
              icon={CheckCircle}
              trend="up"
              trendValue="+2%"
              delay={0.1}
            />
            <KPICard
              title="Tempo Médio"
              value="2m 48s"
              icon={Clock}
              trend="down"
              trendValue="-15s"
              delay={0.15}
            />
          </div>

          {/* Bar Chart - Atendimentos por hora */}
          <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6 mb-8">
            <h3 className="text-sm font-medium text-[#888] mb-4">
              Atendimentos por Hora
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockAtendimentosPorHora}>
                <XAxis
                  dataKey="hora"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...chartTooltipStyle} />
                <Bar
                  dataKey="total"
                  fill="#5B9BF3"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ultimos atendimentos */}
          <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6">
            <h3 className="text-sm font-medium text-[#888] mb-4">
              Últimos Atendimentos
            </h3>
            <div className="space-y-3">
              {mockUltimosAtendimentos.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-3 border-b border-[#2a2a2a] last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white font-medium w-32 truncate">
                      {a.contato}
                    </span>
                    <span className="text-xs text-[#999] font-mono">
                      {a.agente}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.canal} />
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-[#999] font-mono w-12 text-right">
                      {a.hora}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab: Relatórios */}
      {activeTab === "Relatórios" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Period selector */}
          <div className="flex gap-1 bg-[#151515] border border-[#333] rounded-xl p-1 mb-6 w-fit">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-[#222] text-white shadow-sm"
                    : "text-[#888] hover:text-[#999]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* KPIs with sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              title="Total Atendimentos"
              value="294"
              icon={Headphones}
              trend="up"
              trendValue="+8%"
              delay={0}
              sparklineData={mockSparklines.atendimentos}
            />
            <KPICard
              title="Taxa Resolução"
              value="89%"
              icon={CheckCircle}
              trend="up"
              trendValue="+1.5%"
              delay={0.05}
              sparklineData={mockSparklines.resolucao}
            />
            <KPICard
              title="Tempo Médio"
              value="2m 48s"
              icon={Clock}
              trend="down"
              trendValue="-12s"
              delay={0.1}
              sparklineData={mockSparklines.tempoMedio}
            />
            <KPICard
              title="Tickets Abertos"
              value="5"
              icon={MessageCircle}
              trend="up"
              trendValue="+2"
              delay={0.15}
              sparklineData={mockSparklines.tickets}
            />
          </div>

          {/* Line chart - Volume por dia */}
          <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6 mb-8">
            <h3 className="text-sm font-medium text-[#888] mb-4">
              Volume por Dia
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mockVolumePorDia}>
                <XAxis
                  dataKey="dia"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#5B9BF3"
                  strokeWidth={2}
                  dot={{ fill: "#5B9BF3", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grid: Pie + Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie chart - Distribuição por canal */}
            <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6">
              <h3 className="text-sm font-medium text-[#888] mb-4">
                Distribuição por Canal
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={mockDistribuicaoCanal}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="total"
                    nameKey="canal"
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {mockDistribuicaoCanal.map((entry, i) => (
                      <Cell key={i} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {mockDistribuicaoCanal.map((c) => (
                  <div key={c.canal} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.cor }}
                    />
                    <span className="text-xs text-[#888]">
                      {c.canal}{" "}
                      <span className="text-[#666] font-mono">
                        ({c.total})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart - Volume por agente */}
            <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6">
              <h3 className="text-sm font-medium text-[#888] mb-4">
                Volume por Agente
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={mockVolumePorAgente}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="agente"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar
                    dataKey="total"
                    fill="#5B9BF3"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Motivos de contato */}
          <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6">
            <h3 className="text-sm font-medium text-[#888] mb-4">
              Motivos de Contato
            </h3>
            <div className="space-y-3">
              {mockMotivosContato.map((m, i) => {
                const maxTotal = mockMotivosContato[0].total;
                const pct = (m.total / maxTotal) * 100;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs text-[#888] w-48 truncate">
                      {m.motivo}
                    </span>
                    <div className="flex-1 h-2 bg-[#1e1e1e] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5B9BF3]/60 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#999] font-mono w-8 text-right">
                      {m.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab: Insights */}
      {activeTab === "Insights" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sentimento */}
            <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6">
              <h3 className="text-sm font-medium text-[#888] mb-5">
                Sentimento dos Atendimentos
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Positivo",
                    value: mockSentimento.positivo,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Neutro",
                    value: mockSentimento.neutro,
                    color: "bg-gray-300",
                  },
                  {
                    label: "Negativo",
                    value: mockSentimento.negativo,
                    color: "bg-red-500",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-[#888]">{s.label}</span>
                      <span className="text-xs text-white font-mono">
                        {s.value}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#1e1e1e] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.color} rounded-full transition-all duration-700`}
                        style={{ width: `${s.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Palavras frequentes */}
            <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6">
              <h3 className="text-sm font-medium text-[#888] mb-5">
                Palavras Frequentes
              </h3>
              <div className="space-y-2.5">
                {mockPalavrasFrequentes.map((p) => {
                  const maxCount = mockPalavrasFrequentes[0].count;
                  const pct = (p.count / maxCount) * 100;
                  return (
                    <div key={p.palavra} className="flex items-center gap-3">
                      <span className="text-xs text-[#888] w-24 truncate">
                        {p.palavra}
                      </span>
                      <div className="flex-1 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5B9BF3]/50 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#999] font-mono w-8 text-right">
                        {p.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Perguntas frequentes */}
          <div className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-6 mb-8">
            <h3 className="text-sm font-medium text-[#888] mb-4">
              Perguntas Frequentes
            </h3>
            <div className="space-y-3">
              {mockPerguntasFrequentes.map((pergunta, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2 border-b border-[#2a2a2a] last:border-0"
                >
                  <span className="text-xs text-[#444] font-mono w-5 pt-0.5 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-sm text-[#888]">{pergunta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sugestões da IA */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#888]">
              Sugestões da IA
            </h3>
            {mockSugestoesIA.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151515] border border-[#333] rounded-2xl backdrop-blur p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Lightbulb size={18} className="text-amber-400" />
                </div>
                <p className="text-sm text-[#888] leading-relaxed">
                  {s.texto}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
