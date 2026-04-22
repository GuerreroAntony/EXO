"use client";

import { motion } from "framer-motion";
import { Workflow, Clock, Shield, TrendingUp, ArrowRight } from "lucide-react";

const features = [
  { icon: Workflow, name: "Automação End-to-End", desc: "Processos completos executados de forma autônoma, sem intervenção humana." },
  { icon: Clock, name: "Operação 24/7", desc: "Seus Digital Workers nunca param. Produtividade contínua sem burnout." },
  { icon: Shield, name: "Compliance Nativo", desc: "Cada ação é logada, auditável e respeita suas políticas internas." },
  { icon: TrendingUp, name: "Auto-otimização", desc: "Aprendem com cada interação e melhoram continuamente sem retreino." },
];

export default function DigitalWorkersPage() {
  return (
      <main className="bg-black min-h-screen">
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
              className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[0.95]"
            >
              A força de trabalho
              <br />
              <span className="text-violet-400">do futuro.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-lg text-white/50 max-w-xl leading-relaxed"
            >
              Trabalhadores digitais autônomos que executam, decidem e aprendem.
              Não são bots — são colegas digitais.
            </motion.p>
          </div>
        </section>

        <section className="py-32 bg-black">
          <div className="max-w-6xl mx-auto px-6">
            <div className="border-t border-white/[0.06] mb-20" />
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-400/10 flex items-center justify-center mb-5">
                    <f.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.name}</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-black text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <a href="/demo" className="group bg-white text-black rounded-full px-8 py-4 text-sm font-medium tracking-wide inline-flex items-center gap-3 transition-all duration-300 hover:opacity-90">
              Conhecer Digital Workers
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>
      </main>
  );
}
