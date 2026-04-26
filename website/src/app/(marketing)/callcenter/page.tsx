"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Phone,
  MessageSquare,
  Calendar,
  CreditCard,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

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
            Cada agente inclui todos os módulos: recepção, SAC, agendamento e
            cobrança. Sua operação, dimensionada sob medida.
          </motion.p>
        </div>
      </section>

      {/* Modules included */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="bg-muted/50 border border-border rounded-2xl">
              <div className="p-8 sm:p-10">
                <p className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-wider mb-5">
                  Incluso em cada agente
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
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
          </ScrollReveal>
        </div>
      </section>

      {/* Everything included */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-10 tracking-tight">
              Tudo incluído.
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
              <span className="text-muted-foreground/70">perder uma ligação?</span>
            </h2>
            <p className="mt-6 text-muted-foreground/70 font-light">
              Configure em minutos. Resultados imediatos.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="group flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-wide bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-500"
              >
                Falar com o comercial
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
