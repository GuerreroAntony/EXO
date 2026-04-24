"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CalendarDays, X } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

interface AgendamentoRaw {
  id: string;
  data_hora: string;
  servico: string;
  profissional: string;
  status: string;
  canal_origem: string;
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

interface Paciente {
  id: string;
  nome: string;
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
  const { orgId, orgName, loading: orgLoading } = useOrg();
  const [data, setData] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    paciente_id: "",
    servico: "",
    profissional: "",
    data_hora: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!orgId) return;
    const supabase = createClient();
    const { data: rows } = await supabase
      .from("agendamentos")
      .select("*, pacientes(nome)")
      .eq("organization_id", orgId)
      .order("data_hora", { ascending: false });
    const mapped: Agendamento[] = (rows ?? []).map((r: AgendamentoRaw) => ({
      dataHora: formatDateTime(r.data_hora),
      paciente: r.pacientes?.nome ?? "—",
      servico: r.servico ?? "—",
      profissional: r.profissional ?? "—",
      status: r.status ?? "—",
      canal: r.canal_origem ?? "—",
    }));
    setData(mapped);
    setLoading(false);
  };

  useEffect(() => {
    if (orgLoading) return;
    if (!orgId) { setLoading(false); return; }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, orgLoading]);

  const openCreate = async () => {
    if (!orgId) return;
    const supabase = createClient();
    const { data: rows } = await supabase
      .from("pacientes")
      .select("id, nome")
      .eq("organization_id", orgId)
      .order("nome");
    setPacientes(rows ?? []);
    setShowCreate(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setSubmitting(true);
    const supabase = createClient();
    await supabase.from("agendamentos").insert({
      organization_id: orgId,
      paciente_id: form.paciente_id,
      servico: form.servico,
      profissional: form.profissional,
      data_hora: form.data_hora,
    });
    setSubmitting(false);
    setShowCreate(false);
    setForm({ paciente_id: "", servico: "", profissional: "", data_hora: "" });
    await loadData();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Agendamentos"
        subtitle={orgName ? `Agenda de ${orgName}` : "Gerencie seus agendamentos"}
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={16} />
            Novo Agendamento
          </button>
        }
      />

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <CalendarDays className="w-10 h-10 text-[#333] mx-auto mb-4" />
          <p className="text-[#888]">Nenhum agendamento ainda</p>
          <p className="text-sm text-[#999] mt-1">Cadastre o primeiro ou espere os agentes receberem ligações.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} emptyMessage="Nenhum agendamento encontrado" />
      )}

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={submit}
              className="bg-[#151515] border border-[#333] rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Novo Agendamento</h3>
                <button type="button" onClick={() => setShowCreate(false)} className="text-[#666] hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {pacientes.length === 0 ? (
                <p className="text-sm text-[#999] py-6 text-center">Cadastre um paciente em Contatos antes de criar agendamento.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Paciente</label>
                    <select
                      required value={form.paciente_id}
                      onChange={(e) => setForm({ ...form, paciente_id: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none"
                    >
                      <option value="">Selecione…</option>
                      {pacientes.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Serviço</label>
                    <input required value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none"
                      placeholder="Ex: Consulta inicial" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Profissional</label>
                    <input required value={form.profissional} onChange={(e) => setForm({ ...form, profissional: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none"
                      placeholder="Nome do profissional" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Data e hora</label>
                    <input required type="datetime-local" value={form.data_hora} onChange={(e) => setForm({ ...form, data_hora: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                    {submitting ? "Salvando…" : "Criar agendamento"}
                  </button>
                </div>
              )}
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
