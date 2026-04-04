"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminOrganizacoes() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: result } = await supabase
        .from("organizations")
        .select("*")
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
    { key: "name", label: "Nome" },
    { key: "slug", label: "Slug", render: (row) => <span className="font-mono text-white/50 text-xs">{row.slug}</span> },
    {
      key: "plano",
      label: "Plano",
      render: (row) => <StatusBadge status={row.plano || "starter"} />,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status || "ativo"} />,
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
      <PageHeader title="Organizações" subtitle={`${data.length} organizações cadastradas`} />
      <DataTable columns={columns} data={data} emptyMessage="Nenhuma organização encontrada" />
    </>
  );
}
