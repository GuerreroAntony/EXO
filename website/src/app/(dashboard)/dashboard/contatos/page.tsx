"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, X, Users } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

interface PacienteRow extends Record<string, unknown> {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  convenio: string;
}

const columns: Column<PacienteRow>[] = [
  { key: "nome", label: "Nome" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "Email" },
  { key: "cpf", label: "CPF" },
  { key: "convenio", label: "Convênio" },
];

export default function ContatosPage() {
  const { orgId, loading: orgLoading } = useOrg();
  const [data, setData] = useState<PacienteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", cpf: "", convenio: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!orgId) return;
    const supabase = createClient();
    const { data: rows } = await supabase
      .from("pacientes")
      .select("id, nome, telefone, email, cpf, convenio")
      .eq("organization_id", orgId)
      .eq("ativo", true)
      .order("nome");
    setData(
      (rows ?? []).map((r) => ({
        id: r.id as string,
        nome: (r.nome as string) ?? "—",
        telefone: (r.telefone as string) ?? "—",
        email: (r.email as string) ?? "—",
        cpf: (r.cpf as string) ?? "—",
        convenio: (r.convenio as string) ?? "—",
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    if (orgLoading) return;
    if (!orgId) { setLoading(false); return; }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, orgLoading]);

  const filtered = data.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.nome.toLowerCase().includes(q) ||
      p.telefone.includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.cpf.includes(q)
    );
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("pacientes").insert({
      organization_id: orgId,
      nome: form.nome,
      telefone: form.telefone,
      email: form.email || null,
      cpf: form.cpf,
      convenio: form.convenio || null,
    });
    setSubmitting(false);
    if (error) {
      alert(`Erro: ${error.message}`);
      return;
    }
    setShowCreate(false);
    setForm({ nome: "", telefone: "", email: "", cpf: "", convenio: "" });
    await loadData();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageHeader
        title="Contatos"
        subtitle="Pacientes cadastrados da sua empresa"
        action={
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
            <UserPlus size={16} />Novo Contato
          </button>
        }
      />

      <div className="relative max-w-md mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444]" />
        <input type="text" placeholder="Buscar por nome, telefone, email, CPF..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151515] border border-[#333] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#999] focus:outline-none focus:border-[#5B9BF3]/50 transition-colors" />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-10 h-10 text-[#333] mx-auto mb-4" />
          <p className="text-[#888]">Nenhum contato cadastrado</p>
          <p className="text-sm text-[#999] mt-1">Clique em &ldquo;Novo Contato&rdquo; para começar.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="Nenhum contato encontrado" />
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
              onClick={(e) => e.stopPropagation()} onSubmit={submit}
              className="bg-[#151515] border border-[#333] rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">Novo Contato</h3>
                <button type="button" onClick={() => setShowCreate(false)} className="text-[#666] hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Nome completo</label>
                  <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none"
                    placeholder="Ex: Maria Silva" />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Telefone</label>
                  <input required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none font-mono"
                    placeholder="+55 11 98765-4321" />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">CPF</label>
                  <input required value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none font-mono"
                    placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Email (opcional)</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none"
                    placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5">Convênio (opcional)</label>
                  <input value={form.convenio} onChange={(e) => setForm({ ...form, convenio: e.target.value })}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5B9BF3]/50 outline-none"
                    placeholder="Ex: Unimed" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                  {submitting ? "Salvando…" : "Cadastrar contato"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
