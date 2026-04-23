"use client";

import { motion } from "framer-motion";
import { Workflow, Clock, Shield, TrendingUp, ArrowRight } from "lucide-react";

const features = [
  { icon: Workflow, name: "Automacao End-to-End", desc: "Processos completos executados de forma autonoma, sem intervencao humana." },
  { icon: Clock, name: "Operacao 24/7", desc: "Seus Digital Workers nunca param. Produtividade continua sem burnout." },
  { icon: Shield, name: "Compliance Nativo", desc: "Cada acao e logada, auditavel e respeita suas politicas internas." },
  { icon: TrendingUp, name: "Auto-otimizacao", desc: "Aprendem com cada interacao e melhoram continuamente sem retreino." },
];

export default function DigitalWorkersPage() {
  return (
      <main className="min-h-screen">
        <section className="relative pt-40 pb-32 overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-[13px] tracking-[0.3em] uppercase text-violet-400 font-medium"
            >
              Digital Workers
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.95]"
            >
              A forca de trabalho
              <br />
              <span className="text-violet-400">do futuro.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Trabalhadores digitais autonomos que executam, decidem e aprendem.
              Nao sao bots — sao colegas digitais.
            </motion.p>
          </div>
        </section>

        <section className="py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="border-t border-border mb-20" />
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-muted/50 border border-border rounded-2xl p-8 transition-all duration-300 hover:bg-muted hover:border-border hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-400/10 flex items-center justify-center mb-5">
                    <f.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <a href="/demo" className="group bg-primary text-primary-foreground rounded-full px-8 py-4 text-sm font-medium tracking-wide inline-flex items-center gap-3 transition-all duration-300 hover:opacity-90">
              Conhecer Digital Workers
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>
      </main>
  );
}
