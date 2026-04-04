"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminUsuarios() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: result } = await supabase
        .from("profiles")
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
      key: "role",
      label: "Role",
      render: (row) => <StatusBadge status={row.role || "member"} />,
    },
    {
      key: "organization",
      label: "Organização",
      render: (row) => {
        const org = row.organizations as any;
        return <span className="text-white/50">{org?.name || "—"}</span>;
      },
    },
    {
      key: "onboarding_completed",
      label: "Onboarding",
      render: (row) =>
        row.onboarding_completed ? (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-emerald-500/15 text-emerald-400">
            Completo
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-white/10 text-white/40">
            Pendente
          </span>
        ),
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
      <PageHeader title="Usuários" subtitle={`${data.length} usuários registrados`} />
      <DataTable columns={columns} data={data} emptyMessage="Nenhum usuário encontrado" />
    </>
  );
}
