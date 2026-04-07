"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarDays } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";

interface AgendamentoRaw {
  id: string;
  data_hora: string;
  servico: string;
  profissional: string;
  status: string;
  canal: string;
  pacientes?: { nome: string } | null;
  [key: string]: unknown;
}

interface Agendamento {
  dataHora: string;
  paciente: string;
  servico: string;
  profissional: string;
  status: string;
  canal: string;
  [key: string]: unknown;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month} ${hours}:${mins}`;
}

const columns: Column<Agendamento>[] = [
  { key: "dataHora", label: "Data/Hora" },
  { key: "paciente", label: "Paciente" },
  { key: "servico", label: "Serviço" },
  { key: "profissional", label: "Profissional" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "canal",
    label: "Canal",
    render: (row) => <StatusBadge status={row.canal.toLowerCase() === "whatsapp" ? "whatsapp" : "voz"} />,
  },
];

export default function AgendamentosPage() {
  const [data, setData] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("agendamentos")
      .select("*, pacientes(nome)")
      .order("data_hora", { ascending: false })
      .then(({ data: rows }) => {
        const mapped: Agendamento[] = (rows ?? []).map((r: AgendamentoRaw) => ({
          dataHora: formatDateTime(r.data_hora),
          paciente: r.pacientes?.nome ?? "—",
          servico: r.servico ?? "—",
          profissional: r.profissional ?? "—",
          status: r.status ?? "—",
          canal: r.canal ?? "—",
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
        title="Agendamentos"
        subtitle="Gerencie os agendamentos da clínica"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={16} />
            Novo Agendamento
          </button>
        }
      />

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <CalendarDays className="w-10 h-10 text-white/10 mx-auto mb-4" />
          <p className="text-[#666]">Nenhum registro encontrado</p>
          <p className="text-sm text-[#444] mt-1">Os dados aparecerão aqui quando houver atividade.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} emptyMessage="Nenhum agendamento encontrado" />
      )}
    </motion.div>
  );
}
