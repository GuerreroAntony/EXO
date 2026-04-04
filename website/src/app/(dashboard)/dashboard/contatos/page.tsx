"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DataTable, { type Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ContactDrawer from "@/components/dashboard/ContactDrawer";
import { mockContatos, type Contato } from "@/data/mock/contatos";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month} ${hours}:${mins}`;
}

interface ContatoRow extends Record<string, unknown> {
  _original: Contato;
  nome: string;
  telefone: string;
  email: string;
  canal_preferido: string;
  tags: string[];
  ultima_interacao: string;
  total_atendimentos: number;
}

function toRow(c: Contato): ContatoRow {
  return {
    _original: c,
    nome: c.nome,
    telefone: c.telefone,
    email: c.email,
    canal_preferido: c.canal_preferido,
    tags: c.tags,
    ultima_interacao: c.ultima_interacao,
    total_atendimentos: c.total_atendimentos,
  };
}

const allTags = Array.from(new Set(mockContatos.flatMap((c) => c.tags))).filter(Boolean);

const columns: Column<ContatoRow>[] = [
  { key: "nome", label: "Nome" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "Email" },
  {
    key: "canal_preferido",
    label: "Canal Preferido",
    render: (row) => <StatusBadge status={row.canal_preferido} />,
  },
  {
    key: "tags",
    label: "Tags",
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {(row.tags as string[]).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/50"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: "ultima_interacao",
    label: "Última Interação",
    render: (row) => <span>{formatDate(row.ultima_interacao as string)}</span>,
  },
  { key: "total_atendimentos", label: "Total Atendimentos" },
];

export default function ContatosPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);

  const filtered = mockContatos.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.nome.toLowerCase().includes(q) ||
      c.telefone.includes(q) ||
      c.email.toLowerCase().includes(q);
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((t) => c.tags.includes(t));
    return matchesSearch && matchesTags;
  });

  const rows = filtered.map(toRow);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function handleRowClick(row: ContatoRow) {
    setSelectedContato(row._original as Contato);
    setDrawerOpen(true);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageHeader
        title="Contatos"
        action={
          <button className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white transition-colors">
            <UserPlus size={16} />
            Novo Contato
          </button>
        }
      />

      {/* Search + Tag filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                    active
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        emptyMessage="Nenhum contato encontrado"
        onRowClick={handleRowClick}
      />

      <ContactDrawer
        contato={selectedContato}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </motion.div>
  );
}
