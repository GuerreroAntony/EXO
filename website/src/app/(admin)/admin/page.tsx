"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Building2, Bot, UserPlus, Headphones } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminOverview() {
  const [counts, setCounts] = useState({ orgs: 0, agents: 0, leads: 0, atendimentos: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentOrgs, setRecentOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [orgsCount, agentsCount, leadsCount, atendimentosCount, leadsData, orgsData] =
        await Promise.all([
          supabase.from("organizations").select("id", { count: "exact", head: true }),
          supabase.from("agents").select("id", { count: "exact", head: true }),
          supabase.from("demo_requests").select("id", { count: "exact", head: true }),
          supabase.from("atendimentos_log").select("id", { count: "exact", head: true }),
          supabase.from("demo_requests").select("*").order("criado_em", { ascending: false }).limit(10),
          supabase.from("organizations").select("*").order("criado_em", { ascending: false }).limit(5),
        ]);

      setCounts({
        orgs: orgsCount.count ?? 0,
        agents: agentsCount.count ?? 0,
        leads: leadsCount.count ?? 0,
        atendimentos: atendimentosCount.count ?? 0,
      });
      setRecentLeads(leadsData.data || []);
      setRecentOrgs(orgsData.data || []);
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

  const leadsColumns: Column<any>[] = [
    { key: "nome", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "empresa", label: "Empresa" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status || "novo"} />,
    },
    {
      key: "criado_em",
      label: "Criado em",
      render: (row) =>
        row.criado_em ? new Date(row.criado_em as string).toLocaleDateString("pt-BR") : "—",
    },
  ];

  const orgsColumns: Column<any>[] = [
    { key: "name", label: "Nome" },
    { key: "slug", label: "Slug" },
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
      <PageHeader title="Painel Administrativo" subtitle="Visão geral de toda a plataforma EXO" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Organizações"
          value={String(counts.orgs)}
          icon={Building2}
          trend="neutral"
          trendValue="total"
          delay={0}
        />
        <KPICard
          title="Agentes"
          value={String(counts.agents)}
          icon={Bot}
          trend="neutral"
          trendValue="total"
          delay={0.1}
        />
        <KPICard
          title="Leads"
          value={String(counts.leads)}
          icon={UserPlus}
          trend="neutral"
          trendValue="total"
          delay={0.2}
        />
        <KPICard
          title="Atendimentos"
          value={String(counts.atendimentos)}
          icon={Headphones}
          trend="neutral"
          trendValue="total"
          delay={0.3}
        />
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Leads Recentes</h3>
          <DataTable columns={leadsColumns} data={recentLeads} emptyMessage="Nenhum lead encontrado" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Organizações Recentes</h3>
          <DataTable columns={orgsColumns} data={recentOrgs} emptyMessage="Nenhuma organização encontrada" />
        </div>
      </div>
    </>
  );
}
