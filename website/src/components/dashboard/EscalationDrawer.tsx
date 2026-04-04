"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, MessageCircle, CheckCircle } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import type { Escalonamento } from "@/data/mock/escalonamentos";

interface EscalationDrawerProps {
  escalonamento: Escalonamento | null;
  open: boolean;
  onClose: () => void;
}

export default function EscalationDrawer({ escalonamento, open, onClose }: EscalationDrawerProps) {
  return (
    <AnimatePresence>
      {open && escalonamento && (
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
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#0a0a0a] border-l border-white/[0.08] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-white/[0.08]">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {escalonamento.contato_nome}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={escalonamento.prioridade} />
                  <StatusBadge status={escalonamento.canal} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Motivo */}
              <section>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/30 mb-3">
                  Motivo
                </h4>
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
                  <p className="text-sm text-white/70 leading-relaxed">
                    {escalonamento.motivo}
                  </p>
                </div>
              </section>

              {/* Transcricao */}
              <section>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/30 mb-3">
                  Transcricao
                </h4>
                <div className="space-y-2">
                  {escalonamento.transcricao.map((line, i) => {
                    const isAgent = line.startsWith("Agente:");
                    return (
                      <div
                        key={i}
                        className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            isAgent
                              ? "bg-[#5B9BF3]/15 text-[#5B9BF3]/90"
                              : "bg-white/[0.06] text-white/70"
                          }`}
                        >
                          {line}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Acoes */}
              <section>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/30 mb-3">
                  Acoes
                </h4>
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-2 border border-white/[0.12] rounded-xl px-4 py-2.5 text-white/60 hover:bg-white/[0.06] transition-colors text-sm">
                    <Phone size={16} />
                    Ligar de Volta
                  </button>
                  <button className="flex items-center gap-2 border border-white/[0.12] rounded-xl px-4 py-2.5 text-white/60 hover:bg-white/[0.06] transition-colors text-sm">
                    <MessageCircle size={16} />
                    Enviar WhatsApp
                  </button>
                  <button className="flex items-center gap-2 border border-white/[0.12] rounded-xl px-4 py-2.5 text-white/60 hover:bg-white/[0.06] transition-colors text-sm">
                    <CheckCircle size={16} />
                    Marcar Resolvido
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
