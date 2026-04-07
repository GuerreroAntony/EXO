"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, TicketIcon } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

interface TicketRaw {
  id: string;
  tipo: string;
  prioridade: string;
  status: string;
  criado_em: string;
  pacientes?: { nome: string } | null;
  [key: string]: unknown;
}

interface Ticket {
  id: string;
  paciente: string;
  tipo: string;
  prioridade: string;
  status: string;
  criado: string;
  [key: string]: unknown;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month} ${hours}:${mins}`;
}

const columns: Column<Ticket>[] = [
  { key: "id", label: "ID", render: (row) => <span className="font-mono text-[#5B9BF3]">{row.id}</span> },
  { key: "paciente", label: "Paciente" },
  { key: "tipo", label: "Tipo" },
  {
    key: "prioridade",
    label: "Prioridade",
    render: (row) => <StatusBadge status={row.prioridade} />,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: "criado", label: "Criado" },
];

export default function TicketsPage() {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("tickets")
      .select("*, pacientes(nome)")
      .order("criado_em", { ascending: false })
      .then(({ data: rows }) => {
        const mapped: Ticket[] = (rows ?? []).map((r: TicketRaw) => ({
          id: `#${r.id}`,
          paciente: r.pacientes?.nome ?? "—",
          tipo: r.tipo ?? "—",
          prioridade: r.prioridade ?? "—",
          status: r.status ?? "—",
          criado: formatDate(r.criado_em),
        }));
        setData(mapped);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Tickets"
        subtitle="Gerenciamento de chamados e suporte"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={16} />
            Novo Ticket
          </button>
        }
      />

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <TicketIcon className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-[#666]">Nenhum registro encontrado</p>
          <p className="text-sm text-[#444] mt-1">Os dados aparecerão aqui quando houver atividade.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} emptyMessage="Nenhum ticket encontrado" />
      )}
    </motion.div>
  );
}
