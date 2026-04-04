"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

interface FaturaRaw {
  id: string;
  descricao: string;
  valor: number;
  status: string;
  vencimento: string;
  criado_em: string;
  pacientes?: { nome: string } | null;
  [key: string]: unknown;
}

interface Fatura {
  paciente: string;
  descricao: string;
  valor: string;
  status: string;
  vencimento: string;
  [key: string]: unknown;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const columns: Column<Fatura>[] = [
  { key: "paciente", label: "Paciente" },
  { key: "descricao", label: "Descrição" },
  { key: "valor", label: "Valor", render: (row) => <span className="font-mono text-white">{row.valor}</span> },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: "vencimento", label: "Vencimento" },
];

export default function FinanceiroPage() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [raw, setRaw] = useState<FaturaRaw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("faturas")
      .select("*, pacientes(nome)")
      .order("criado_em", { ascending: false })
      .then(({ data: rows }) => {
        const items = (rows ?? []) as FaturaRaw[];
        setRaw(items);
        const mapped: Fatura[] = items.map((r) => ({
          paciente: r.pacientes?.nome ?? "—",
          descricao: r.descricao ?? "—",
          valor: formatCurrency(r.valor ?? 0),
          status: r.status ?? "—",
          vencimento: r.vencimento ? formatDate(r.vencimento) : "—",
        }));
        setFaturas(mapped);
        setLoading(false);
      });
  }, []);

  const totalPendente = raw.filter((f) => f.status === "pendente").reduce((s, f) => s + (f.valor ?? 0), 0);
  const totalPago = raw.filter((f) => f.status === "pago").reduce((s, f) => s + (f.valor ?? 0), 0);
  const totalAtrasado = raw.filter((f) => f.status === "atrasado").reduce((s, f) => s + (f.valor ?? 0), 0);
  const countPendente = raw.filter((f) => f.status === "pendente").length;
  const countAtrasado = raw.filter((f) => f.status === "atrasado").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Financeiro" subtitle="Faturas e pagamentos da clínica" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="Total Pendente"
          value={loading ? "—" : formatCurrency(totalPendente)}
          icon={DollarSign}
          trend="neutral"
          trendValue={loading ? "—" : `${countPendente} fatura${countPendente !== 1 ? "s" : ""}`}
          delay={0}
        />
        <KPICard
          title="Total Pago"
          value={loading ? "—" : formatCurrency(totalPago)}
          icon={CheckCircle}
          trend="up"
          trendValue="—"
          delay={0.1}
        />
        <KPICard
          title="Total Atrasado"
          value={loading ? "—" : formatCurrency(totalAtrasado)}
          icon={AlertTriangle}
          trend="down"
          trendValue={loading ? "—" : `${countAtrasado} fatura${countAtrasado !== 1 ? "s" : ""}`}
          delay={0.2}
        />
      </div>

      <h3 className="text-[12px] font-mono text-white/40 uppercase tracking-wider mb-4">Faturas</h3>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
        </div>
      ) : faturas.length === 0 ? (
        <div className="text-center py-20">
          <DollarSign className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-white/30">Nenhum registro encontrado</p>
          <p className="text-sm text-white/15 mt-1">Os dados aparecerão aqui quando houver atividade.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={faturas} emptyMessage="Nenhuma fatura encontrada" />
      )}
    </motion.div>
  );
}
