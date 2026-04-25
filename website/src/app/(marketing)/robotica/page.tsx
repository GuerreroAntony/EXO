"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function RoboticaPage() {
  return (
      <main className="min-h-screen">
        <section className="relative pt-40 pb-32 overflow-hidden flex items-center min-h-[80vh]">
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-[13px] tracking-[0.3em] uppercase text-emerald-400 font-medium"
            >
              Robótica
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mt-6 text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[0.9]"
            >
              <span className="text-emerald-400">Em breve.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              Automação física inteligente para logística, manufatura e operações.
              O corpo da evolução.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <a
                href="/"
                className="group border border-border text-muted-foreground rounded-full px-8 py-4 text-sm font-medium tracking-wide inline-flex items-center gap-3 transition-all duration-300 hover:border-border hover:text-foreground"
              >
                Voltar ao início
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
  );
}
