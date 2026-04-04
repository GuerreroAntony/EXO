"use client";

import { motion } from "framer-motion";
import { Eye, MessageCircle, BarChart3, Cpu, ArrowRight } from "lucide-react";

const capabilities = [
  { icon: MessageCircle, name: "Linguagem Natural", desc: "Compreensão e geração de texto em português com contexto profundo." },
  { icon: Eye, name: "Visão Computacional", desc: "Análise de imagens, documentos e vídeo em tempo real." },
  { icon: BarChart3, name: "Análise Preditiva", desc: "Modelos que antecipam tendências e anomalias nos seus dados." },
  { icon: Cpu, name: "Modelos Customizados", desc: "IA treinada especificamente para sua vertical e seus dados." },
];

export default function InteligenciaVirtualPage() {
  return (
      <main className="bg-black min-h-screen">
        <section className="relative pt-40 pb-32 overflow-hidden">
          <div className="shader-blob-sm absolute w-[500px] h-[500px] top-1/4 right-0 opacity-12" />
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-[13px] tracking-[0.3em] uppercase text-cyan-400/60 font-medium"
            >
              Influencers Virtuais
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white leading-[0.95]"
            >
              Cognição
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
                sem limites.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-lg text-white/60 max-w-xl leading-relaxed font-light"
            >
              IA que não só entende — raciocina, prevê e aprende. Estendemos a
              capacidade cognitiva da sua equipe para além do humanamente possível.
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="max-w-5xl mx-auto px-6">
            <div className="line-fade mb-20" />
            <div className="grid sm:grid-cols-2 gap-6">
              {capabilities.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="liquid-glass liquid-glass-hover rounded-2xl p-8"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-5">
                    <c.icon className="w-5 h-5 text-cyan-400/60" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-black text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <a href="#" className="group btn-glass px-10 py-4 rounded-full text-sm font-medium tracking-wide inline-flex items-center gap-3">
              Explorar Influencers Virtuais
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>
      </main>
  );
}
