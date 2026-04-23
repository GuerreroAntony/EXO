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
  { icon: CreditCard, name: "Cobranca", desc: "Negocia pagamentos" },
];

const features = [
  "Disponivel 24/7, sem fila de espera",
  "Portugues brasileiro natural",
  "Voz + WhatsApp simultaneo",
  "Escalacao inteligente para humanos",
  "Resposta em menos de 1 segundo",
  "LGPD compliant, dados criptografados",
  "Dashboard de analytics em tempo real",
  "Gravacao e transcricao de chamadas",
  "Integracao com CRM via API",
  "Knowledge base customizada",
  "Relatorios semanais automaticos",
  "Suporte tecnico prioritario",
];

export default function CallCenterPage() {
  const [agentCount, setAgentCount] = useState(1);

  const totalPrice = agentCount * PRICE_PER_AGENT;
  const finalPrice = totalPrice;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#5B9BF3]"
          >
            Call Center IA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.95]"
          >
            Atendimento que
            <br />
            <span className="text-[#5B9BF3]">nunca dorme.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed font-light"
          >
            Cada agente inclui todos os modulos: recepcao, SAC, agendamento e
            cobranca. Escolha quantos agentes sua operacao precisa.
          </motion.p>
        </div>
      </section>

      {/* Pricing configurator */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left — Agent selector (3 cols) */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <div className="bg-muted/50 border border-border rounded-2xl">
                  <div className="p-8 sm:p-10">
                    {/* Quantity selector */}
                    <p className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-6">
                      Quantos agentes voce precisa?
                    </p>

                    <div className="flex items-center justify-center gap-6 py-8">
                      <button
                        onClick={() => setAgentCount(Math.max(1, agentCount - 1))}
                        className="w-12 h-12 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all"
                      >
                        <Minus size={18} />
                      </button>

                      <div className="text-center min-w-[120px]">
                        <span className="text-6xl font-bold text-foreground tabular-nums">
                          {agentCount}
                        </span>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                          {agentCount === 1 ? "agente" : "agentes"}
                        </p>
                      </div>

                      <button
                        onClick={() => setAgentCount(Math.min(20, agentCount + 1))}
                        className="w-12 h-12 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Included modules */}
                    <div className="border-t border-border pt-8 mt-4">
                      <p className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-5">
                        Incluso em cada agente
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {includedAgents.map((a) => (
                          <div
                            key={a.name}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border"
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <a.icon size={14} className="text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">{a.name}</p>
                              <p className="text-[11px] text-muted-foreground/70">{a.desc}</p>
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
                  <div className="bg-muted/50 border border-border rounded-2xl">
                    <div className="p-8">
                      <p className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-8">
                        Resumo
                      </p>

                      {/* Line item */}
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          {agentCount}x Agente IA
                        </span>
                        <span className="text-muted-foreground font-mono">
                          R$ {totalPrice.toLocaleString("pt-BR")}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="border-t border-border pt-6 mt-6">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Total mensal</span>
                          <div className="text-right">
                            <span className="text-4xl font-bold text-foreground">
                              R$ {finalPrice.toLocaleString("pt-BR")}
                            </span>
                            <span className="text-sm text-muted-foreground/70">/mes</span>
                          </div>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground/70 text-right font-mono">
                          R$ {Math.round(finalPrice / agentCount)}/agente/mes
                        </p>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/signup?product=callcenter&agents=${agentCount}`}
                        className="mt-8 w-full py-4 rounded-full text-sm font-medium tracking-wide flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500"
                      >
                        Comecar agora
                        <ArrowRight size={15} />
                      </Link>

                      <p className="mt-4 text-[11px] text-muted-foreground/70 text-center">
                        7 dias gratis - Cancele quando quiser
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
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-10 tracking-tight">
              Tudo incluido.
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <ScrollReveal key={i}>
                <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-muted/50 border border-border">
                  <Check size={14} className="text-muted-foreground/70 shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Pronto para nunca mais
              <br />
              <span className="text-muted-foreground/70">perder uma ligacao?</span>
            </h2>
            <p className="mt-6 text-muted-foreground/70 font-light">
              Configure em minutos. Resultados imediatos.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
                className="group flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-500"
              >
                Montar minha equipe
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/demo"
                className="px-8 py-4 text-sm text-muted-foreground border border-border rounded-full hover:text-foreground hover:border-border transition-all font-medium"
              >
                Agendar demonstracao
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
