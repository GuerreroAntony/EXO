"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import type { Contato, TimelineItem } from "@/data/mock/contatos";

interface ContactDrawerProps {
  contato: Contato | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${mins}`;
}

const timelineIcon: Record<TimelineItem["tipo"], React.ReactNode> = {
  agendamento: <Calendar size={14} />,
  atendimento: <Phone size={14} />,
  fatura: <DollarSign size={14} />,
  ticket: <MessageSquare size={14} />,
};

const tagColors = [
  "bg-violet-500/15 text-violet-400",
  "bg-emerald-500/15 text-emerald-400",
  "bg-blue-500/15 text-blue-400",
  "bg-orange-500/15 text-orange-400",
  "bg-pink-500/15 text-pink-400",
  "bg-yellow-500/15 text-yellow-400",
];

function tagColor(index: number) {
  return tagColors[index % tagColors.length];
}

export default function ContactDrawer({ contato, open, onClose }: ContactDrawerProps) {
  return (
    <AnimatePresence>
      {open && contato && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            role="dialog"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#111] border-l border-[#2a2a2a] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-[#2a2a2a]">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{contato.nome}</h3>
                <div className="flex flex-col gap-1 mt-2 text-sm text-[#999]">
                  <span className="flex items-center gap-2">
                    <Phone size={13} className="shrink-0" />
                    {contato.telefone}
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail size={13} className="shrink-0" />
                    {contato.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <FileText size={13} className="shrink-0" />
                    {contato.documento}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#999] hover:text-white transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Tags */}
              {contato.tags.length > 0 && (
                <section>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#999] mb-3">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {contato.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tagColor(i)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Notas */}
              <section>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#999] mb-3">
                  Notas
                </h4>
                {contato.notas.length > 0 ? (
                  <div className="space-y-3">
                    {contato.notas.map((nota) => (
                      <div
                        key={nota.id}
                        className="bg-[#151515] border border-[#333] rounded-xl p-3"
                      >
                        <p className="text-sm text-white leading-relaxed">{nota.texto}</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-[#999]">
                          <span>{nota.autor}</span>
                          <span>&middot;</span>
                          <span>{formatDate(nota.criado_em)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#999]">Nenhuma nota registrada.</p>
                )}

                {/* Add note textarea (non-functional) */}
                <textarea
                  placeholder="Adicionar nota..."
                  rows={3}
                  className="mt-3 w-full bg-[#151515] border border-[#333] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#999] focus:outline-none focus:border-[#5B9BF3]/50 transition-colors resize-none"
                />
              </section>

              {/* Timeline */}
              <section>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#999] mb-3">
                  Timeline
                </h4>
                {contato.timeline.length > 0 ? (
                  <div className="relative space-y-0">
                    {/* Vertical line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#222]" />

                    {contato.timeline.map((item) => (
                      <div key={item.id} className="relative flex gap-3 py-3">
                        {/* Icon circle */}
                        <div className="relative z-10 flex items-center justify-center w-[23px] h-[23px] rounded-full bg-[#1e1e1e] border border-[#333] text-[#999] shrink-0">
                          {timelineIcon[item.tipo]}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white leading-snug">{item.resumo}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-[11px] text-[#999]">
                              {formatDate(item.data)}
                            </span>
                            <span className="text-[11px] text-[#555]">&middot;</span>
                            <span className="text-[11px] text-[#999]">{item.agente}</span>
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#999]">Nenhum evento na timeline.</p>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
