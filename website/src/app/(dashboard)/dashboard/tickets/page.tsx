"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TicketIcon, X } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

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

interface Paciente { id: string; nome: string; }

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
  { key: "prioridade", label: "Prioridade", render: (row) => <StatusBadge status={row.prioridade} /> },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "criado", label: "Criado" },
];

export default function TicketsPage() {
  const { orgId, loading: orgLoading } = useOrg();
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({ paciente_id: "", tipo: "duvida", prioridade: "media", descricao: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!orgId) return;
    const supabase = createClient();
    const { data: rows } = await supabase
      .from("tickets")
      .select("*, pacientes(nome)")
      .eq("organization_id", orgId)
      .order("criado_em", { ascending: false });
    const mapped: Ticket[] = (rows ?? []).map((r: TicketRaw) => ({
      id: `#${r.id.slice(0, 8)}`,
      paciente: r.pacientes?.nome ?? "—",
      tipo: r.tipo ?? "—",
      prioridade: r.prioridade ?? "—",
      status: r.status ?? "—",
      criado: formatDate(r.criado_em),
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
    await supabase.from("tickets").insert({
      organization_id: orgId,
      paciente_id: form.paciente_id,
      tipo: form.tipo,
      prioridade: form.prioridade,
      descricao: form.descricao,
    });
    setSubmitting(false);
    setShowCreate(false);
    setForm({ paciente_id: "", tipo: "duvida", prioridade: "media", descricao: "" });
    await loadData();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageHeader
        title="Tickets"
        subtitle="Gerenciamento de chamados e suporte"
        action={
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={16} />Novo Ticket
          </button>
        }
      />

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <TicketIcon className="w-10 h-10 text-[#333] mx-auto mb-4" />
          <p className="text-[#888]">Nenhum ticket ainda</p>
          <p className="text-sm text-[#999] mt-1">Os tickets aparecerão aqui quando abertos.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} emptyMessage="Nenhum ticket encontrado" />
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
                <h3 className="text-lg font-semibold text-white">Novo Ticket</h3>
                <button type="button" onClick={() => setShowCreate(false)} className="text-[#666] hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {pacientes.length === 0 ? (
                <p className="text-sm text-[#999] py-6 text-center">Cadastre um paciente em Contatos antes de abrir ticket.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Paciente</label>
                    <select required value={form.paciente_id}
                      onChange={(e) => setForm({ ...form, paciente_id: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none">
                      <option value="">Selecione…</option>
                      {pacientes.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#888] mb-1.5">Tipo</label>
                      <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                        className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none">
                        <option value="duvida">Dúvida</option>
                        <option value="reclamacao">Reclamação</option>
                        <option value="solicitacao">Solicitação</option>
                        <option value="cancelamento">Cancelamento</option>
                        <option value="reembolso">Reembolso</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#888] mb-1.5">Prioridade</label>
                      <select value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
                        className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none">
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#888] mb-1.5">Descrição</label>
                    <textarea required rows={3} value={form.descricao}
                      onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none resize-none"
                      placeholder="Descreva o motivo do ticket…" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                    {submitting ? "Abrindo…" : "Abrir ticket"}
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
