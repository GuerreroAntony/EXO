"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, CheckCircle, Phone, MessageCircle } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import KPICard from "@/components/dashboard/KPICard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EscalationDrawer from "@/components/dashboard/EscalationDrawer";
import { mockEscalonamentos, type Escalonamento } from "@/data/mock/escalonamentos";

/* ── helpers ─────────────────────────────────────────────── */

const prioridadeDot: Record<Escalonamento["prioridade"], string> = {
  urgente: "bg-red-400",
  alta: "bg-orange-400",
  media: "bg-yellow-400",
  baixa: "bg-blue-400",
};

interface EscalonamentoRow extends Record<string, unknown> {
  _original: Escalonamento;
  prioridade: string;
  contato_nome: string;
  motivo: string;
  agente_origem: string;
  canal: string;
  tempo_aguardando: string;
  status: string;
}

function toRow(e: Escalonamento): EscalonamentoRow {
  return {
    _original: e,
    prioridade: e.prioridade,
    contato_nome: e.contato_nome,
    motivo: e.motivo,
    agente_origem: e.agente_origem,
    canal: e.canal,
    tempo_aguardando: e.tempo_aguardando,
    status: e.status,
  };
}

/* ── KPI calculations ────────────────────────────────────── */

const pendentes = mockEscalonamentos.filter((e) => e.status === "aguardando").length;
const resolvidosHoje = mockEscalonamentos.filter((e) => e.status === "resolvido").length;

/* ── columns ─────────────────────────────────────────────── */

const columns: Column<EscalonamentoRow>[] = [
  {
    key: "prioridade",
    label: "Prioridade",
    render: (row) => (
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${prioridadeDot[row.prioridade as Escalonamento["prioridade"]] ?? "bg-[#444]"}`}
        />
        <StatusBadge status={row.prioridade as string} />
      </div>
    ),
  },
  { key: "contato_nome", label: "Contato" },
  {
    key: "motivo",
    label: "Motivo",
    render: (row) => (
      <span className="block max-w-[220px] truncate" title={row.motivo as string}>
        {row.motivo as string}
      </span>
    ),
  },
  { key: "agente_origem", label: "Agente Origem" },
  {
    key: "canal",
    label: "Canal",
    render: (row) => <StatusBadge status={row.canal as string} />,
  },
  { key: "tempo_aguardando", label: "Tempo Aguardando" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status as string} />,
  },
];

/* ── page ────────────────────────────────────────────────── */

export default function EscalonamentosPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Escalonamento | null>(null);

  const rows = mockEscalonamentos.map(toRow);

  function handleRowClick(row: EscalonamentoRow) {
    setSelected(row._original as Escalonamento);
    setDrawerOpen(true);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageHeader title="Escalonamentos" subtitle="Casos escalados pelos agentes de IA" />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="Pendentes"
          value={String(pendentes)}
          icon={AlertTriangle}
          trend="neutral"
          trendValue="—"
          delay={0}
        />
        <KPICard
          title="Resolvidos Hoje"
          value={String(resolvidosHoje)}
          icon={CheckCircle}
          trend="up"
          trendValue="+1"
          delay={0.1}
        />
        <KPICard
          title="Tempo Médio Resposta"
          value="1h 15min"
          icon={Clock}
          trend="down"
          trendValue="-12%"
          delay={0.2}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={rows}
        emptyMessage="Nenhum escalonamento encontrado"
        onRowClick={handleRowClick}
      />

      {/* Drawer */}
      <EscalationDrawer
        escalonamento={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </motion.div>
  );
}
