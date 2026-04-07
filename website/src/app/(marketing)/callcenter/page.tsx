"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Phone,
  MessageSquare,
  Calendar,
  CreditCard,
  Minus,
  Plus,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const PRICE_PER_AGENT = 500;

const includedAgents = [
  { icon: Phone, name: "Recepcionista", desc: "Atende e roteia chamadas" },
  { icon: MessageSquare, name: "SAC", desc: "Suporte ao cliente" },
  { icon: Calendar, name: "Agendamento", desc: "Marca e confirma consultas" },
  { icon: CreditCard, name: "Cobrança", desc: "Negocia pagamentos" },
];

const features = [
  "Disponível 24/7, sem fila de espera",
  "Português brasileiro natural",
  "Voz + WhatsApp simultâneo",
  "Escalação inteligente para humanos",
  "Resposta em menos de 1 segundo",
  "LGPD compliant, dados criptografados",
  "Dashboard de analytics em tempo real",
  "Gravação e transcrição de chamadas",
  "Integração com CRM via API",
  "Knowledge base customizada",
  "Relatórios semanais automáticos",
  "Suporte técnico prioritário",
];

export default function CallCenterPage() {
  const [agentCount, setAgentCount] = useState(1);

  const totalPrice = agentCount * PRICE_PER_AGENT;
  const finalPrice = totalPrice;

  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30"
          >
            Call Center IA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[0.95]"
          >
            Atendimento que
            <br />
            <span className="text-white/30">nunca dorme.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-lg text-white/30 max-w-xl leading-relaxed font-light"
          >
            Cada agente inclui todos os módulos: recepção, SAC, agendamento e
            cobrança. Escolha quantos agentes sua operação precisa.
          </motion.p>
        </div>
      </section>

      {/* Pricing configurator */}
      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left — Agent selector (3 cols) */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                  <div className="p-8 sm:p-10">
                    {/* Quantity selector */}
                    <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider mb-6">
                      Quantos agentes você precisa?
                    </p>

                    <div className="flex items-center justify-center gap-6 py-8">
                      <button
                        onClick={() => setAgentCount(Math.max(1, agentCount - 1))}
                        className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                      >
                        <Minus size={18} />
                      </button>

                      <div className="text-center min-w-[120px]">
                        <span className="text-6xl font-bold text-white tabular-nums">
                          {agentCount}
                        </span>
                        <p className="text-sm text-white/30 mt-1">
                          {agentCount === 1 ? "agente" : "agentes"}
                        </p>
                      </div>

                      <button
                        onClick={() => setAgentCount(Math.min(20, agentCount + 1))}
                        className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Included modules */}
                    <div className="border-t border-white/[0.06] pt-8 mt-4">
                      <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider mb-5">
                        Incluso em cada agente
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {includedAgents.map((a) => (
                          <div
                            key={a.name}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                          >
                            <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                              <a.icon size={14} className="text-white/60" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white/60">{a.name}</p>
                              <p className="text-[11px] text-white/25">{a.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Summary (2 cols, sticky) */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <ScrollReveal>
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                    <div className="p-8">
                      <p className="text-[11px] font-mono text-white/30 uppercase tracking-wider mb-8">
                        Resumo
                      </p>

                      {/* Line item */}
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/50">
                          {agentCount}x Agente IA
                        </span>
                        <span className="text-white/40 font-mono">
                          R$ {totalPrice.toLocaleString("pt-BR")}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="border-t border-white/[0.06] pt-6 mt-6">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-white/40">Total mensal</span>
                          <div className="text-right">
                            <span className="text-4xl font-bold text-white">
                              R$ {finalPrice.toLocaleString("pt-BR")}
                            </span>
                            <span className="text-sm text-white/25">/mês</span>
                          </div>
                        </div>
                        <p className="mt-1 text-[11px] text-white/20 text-right font-mono">
                          R$ {Math.round(finalPrice / agentCount)}/agente/mês
                        </p>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/signup?product=callcenter&agents=${agentCount}`}
                        className="mt-8 w-full py-4 rounded-full text-sm font-medium tracking-wide flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 transition-all duration-500"
                      >
                        Começar agora
                        <ArrowRight size={15} />
                      </Link>

                      <p className="mt-4 text-[11px] text-white/20 text-center">
                        7 dias grátis • Cancele quando quiser
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything included */}
      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">
              Tudo incluído.
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <ScrollReveal key={i}>
                <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <Check size={14} className="text-white/25 shrink-0" />
                  <span className="text-sm text-white/45">{f}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Pronto para nunca mais
              <br />
              <span className="text-white/30">perder uma ligação?</span>
            </h2>
            <p className="mt-6 text-white/30 font-light">
              Configure em minutos. Resultados imediatos.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
                className="group flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide bg-white text-black rounded-full hover:bg-white/90 transition-all duration-500"
              >
                Montar minha equipe
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/demo"
                className="px-8 py-4 text-sm text-white/40 border border-white/[0.08] rounded-full hover:text-white/60 hover:border-white/[0.12] transition-all font-medium"
              >
                Agendar demonstração
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
