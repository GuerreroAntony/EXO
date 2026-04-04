"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Send,
  Sparkles,
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  mockConhecimento,
  mockChatMessages,
  type KnowledgeCategory,
  type ChatMessage,
} from "@/data/mock/conhecimento";

/* ------------------------------------------------------------------ */
/*  Left Panel — Knowledge Editor                                      */
/* ------------------------------------------------------------------ */

function KnowledgeEditor() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([mockConhecimento[0]?.id]),
  );

  const toggle = (id: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-[#5B9BF3]" />
          <h3 className="text-lg font-semibold text-white">
            Base de Conhecimento
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors">
            <Plus size={14} />
            Adicionar Categoria
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 rounded-lg transition-colors">
            <Plus size={14} />
            Adicionar Item
          </button>
        </div>
      </div>

      {/* Accordion categories */}
      <div className="flex flex-col gap-3">
        {mockConhecimento.map((cat: KnowledgeCategory) => {
          const isExpanded = expandedCategories.has(cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              {/* Category header */}
              <button
                onClick={() => toggle(cat.id)}
                className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-white/40" />
                  ) : (
                    <ChevronRight size={16} className="text-white/40" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {cat.nome}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-medium text-white/40 bg-white/[0.06] rounded-full">
                    {cat.items.length}
                  </span>
                </div>
              </button>

              {/* Expanded items */}
              {isExpanded && (
                <div className="flex flex-col gap-3 px-5 pb-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-white/90">
                          {item.pergunta}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={item.status} />
                          <button className="p-1 text-white/20 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <textarea
                        readOnly
                        value={item.resposta}
                        className="w-full bg-transparent text-sm text-white/50 resize-none outline-none leading-relaxed"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Right Panel — AI Assistant                                         */
/* ------------------------------------------------------------------ */

function AIAssistant() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
        <Sparkles size={18} className="text-[#5B9BF3]" />
        <h3 className="text-sm font-semibold text-white">
          Assistente de Conhecimento
        </h3>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {mockChatMessages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#5B9BF3]/20 text-white/80"
                  : "bg-white/[0.06] text-white/70"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5">
          <input
            type="text"
            placeholder="Diga o que quer atualizar..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            readOnly
          />
          <button className="p-1.5 text-white/30 hover:text-[#5B9BF3] transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ConhecimentoPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Conhecimento"
        subtitle="Gerencie a base de conhecimento do seu agente"
      />

      <div className="flex flex-col lg:flex-row gap-0 bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden min-h-[600px]">
        {/* Left — Knowledge editor (60%) */}
        <div className="w-full lg:w-[60%] p-6 overflow-y-auto">
          <KnowledgeEditor />
        </div>

        {/* Right — AI assistant (40%) */}
        <div className="w-full lg:w-[40%] bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-white/[0.06]">
          <AIAssistant />
        </div>
      </div>
    </motion.div>
  );
}
