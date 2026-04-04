"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminAgentes() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: result } = await supabase
        .from("agents")
        .select("*, organizations(name)")
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
    { key: "nome", label: "Nome" },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => <StatusBadge status={row.tipo || "—"} />,
    },
    {
      key: "canal",
      label: "Canal",
      render: (row) => <StatusBadge status={row.canal || "—"} />,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status || "ativo"} />,
    },
    {
      key: "organization",
      label: "Organizacao",
      render: (row) => {
        const org = row.organizations as any;
        return <span className="text-white/50">{org?.name || "—"}</span>;
      },
    },
    {
      key: "criado_em",
      label: "Criado em",
      render: (row) =>
        row.criado_em ? new Date(row.criado_em as string).toLocaleDateString("pt-BR") : "—",
    },
  ];

  return (
    <>
      <PageHeader title="Todos os Agentes" subtitle={`${data.length} agentes em todas as organizacoes`} />
      <DataTable columns={columns} data={data} emptyMessage="Nenhum agente encontrado" />
    </>
  );
}
