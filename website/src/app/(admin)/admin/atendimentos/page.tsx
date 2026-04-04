"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminAtendimentos() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: result } = await supabase
        .from("atendimentos_log")
        .select("*, pacientes(nome)")
        .order("criado_em", { ascending: false });
      setData(result || []);
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

  const columns: Column<any>[] = [
    {
      key: "criado_em",
      label: "Data",
      render: (row) =>
        row.criado_em
          ? new Date(row.criado_em as string).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
    },
    {
      key: "paciente",
      label: "Paciente",
      render: (row) => {
        const paciente = row.pacientes as any;
        return <span>{paciente?.nome || "—"}</span>;
      },
    },
    { key: "agente", label: "Agente" },
    {
      key: "canal",
      label: "Canal",
      render: (row) => <StatusBadge status={row.canal || "—"} />,
    },
    { key: "direcao", label: "Direção" },
    { key: "resultado", label: "Resultado" },
    {
      key: "duracao",
      label: "Duração",
      render: (row) => {
        if (!row.duracao) return "—";
        const secs = Number(row.duracao);
        if (isNaN(secs)) return String(row.duracao);
        const min = Math.floor(secs / 60);
        const sec = secs % 60;
        return `${min}m ${sec}s`;
      },
    },
  ];

  return (
    <>
      <PageHeader title="Todos os Atendimentos" subtitle={`${data.length} atendimentos registrados`} />
      <DataTable columns={columns} data={data} emptyMessage="Nenhum atendimento encontrado" />
    </>
  );
}
