"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DollarSign, Clock, AlertTriangle } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminFinanceiro() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ pendente: 0, pago: 0, atrasado: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: result } = await supabase
        .from("faturas")
        .select("*, pacientes(nome)")
        .order("criado_em", { ascending: false });

      const faturas = result || [];
      setData(faturas);

      const sums = { pendente: 0, pago: 0, atrasado: 0 };
      for (const f of faturas) {
        const valor = Number(f.valor) || 0;
        const status = (f.status || "").toLowerCase();
        if (status === "pago") sums.pago += valor;
        else if (status === "atrasado") sums.atrasado += valor;
        else if (status === "pendente") sums.pendente += valor;
      }
      setTotals(sums);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const columns: Column<any>[] = [
    {
      key: "paciente",
      label: "Paciente",
      render: (row) => {
        const paciente = row.pacientes as any;
        return <span>{paciente?.nome || "—"}</span>;
      },
    },
    { key: "descricao", label: "Descrição" },
    {
      key: "valor",
      label: "Valor",
      render: (row) => (
        <span className="font-mono text-white">
          {row.valor ? formatCurrency(Number(row.valor)) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status || "pendente"} />,
    },
    {
      key: "vencimento",
      label: "Vencimento",
      render: (row) =>
        row.vencimento ? new Date(row.vencimento as string).toLocaleDateString("pt-BR") : "—",
    },
  ];

  return (
    <>
      <PageHeader title="Financeiro Global" subtitle="Visão consolidada de todas as faturas" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="Total Pendente"
          value={formatCurrency(totals.pendente)}
          icon={Clock}
          trend="neutral"
          trendValue="pendente"
          delay={0}
        />
        <KPICard
          title="Total Pago"
          value={formatCurrency(totals.pago)}
          icon={DollarSign}
          trend="up"
          trendValue="pago"
          delay={0.1}
        />
        <KPICard
          title="Total Atrasado"
          value={formatCurrency(totals.atrasado)}
          icon={AlertTriangle}
          trend="down"
          trendValue="atrasado"
          delay={0.2}
        />
      </div>

      <DataTable columns={columns} data={data} emptyMessage="Nenhuma fatura encontrada" />
    </>
  );
}
