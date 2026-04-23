"use client";

import { motion } from "framer-motion";
import { Sparkles, Image, MessageCircle, TrendingUp, ArrowRight } from "lucide-react";

const capabilities = [
  { icon: Sparkles, name: "Personalidade Unica", desc: "Cada influencer tem uma identidade, tom de voz e estilo visual criados sob medida para a sua marca." },
  { icon: Image, name: "Conteudo Automatizado", desc: "Posts, stories e respostas geradas por IA que mantem a consistencia e frequencia sem esforco humano." },
  { icon: MessageCircle, name: "Engajamento 24/7", desc: "Responde comentarios, DMs e interage com seguidores em tempo real, sem pausas." },
  { icon: TrendingUp, name: "Escala sem Limites", desc: "Um influencer virtual pode estar em multiplas plataformas ao mesmo tempo, crescendo sem restricoes." },
];

export default function InteligenciaVirtualPage() {
  return (
      <main className="min-h-screen">
        <section className="relative pt-40 pb-32 overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-[13px] tracking-[0.3em] uppercase text-cyan-400 font-medium"
            >
              Influencers Virtuais
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.95]"
            >
              Influencia
              <br />
              <span className="text-cyan-400">que nunca para.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Crie influencers virtuais com personalidade propria que produzem conteudo,
              engajam seguidores e representam sua marca 24 horas por dia.
            </motion.p>
          </div>
        </section>

        <section className="py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="border-t border-border mb-20" />
            <div className="grid sm:grid-cols-2 gap-6">
              {capabilities.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-muted/50 border border-border rounded-2xl p-8 transition-all duration-300 hover:bg-muted hover:border-border hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-5">
                    <c.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{c.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <a href="/demo" className="group bg-primary text-primary-foreground rounded-full px-8 py-4 text-sm font-medium tracking-wide inline-flex items-center gap-3 transition-all duration-300 hover:opacity-90">
              Criar meu Influencer Virtual
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>
      </main>
  );
}
