"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function RoboticaPage() {
  return (
      <main className="bg-black min-h-screen">
        <section className="relative pt-40 pb-32 overflow-hidden flex items-center min-h-[80vh]">
          <div className="shader-blob absolute w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-[13px] tracking-[0.3em] uppercase text-white/60 font-medium"
            >
              Robótica
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1 }}
              className="mt-6 text-5xl sm:text-6xl lg:text-8xl font-black tracking-[-0.03em] text-white leading-[0.9]"
            >
              Em breve.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-lg text-white/50 max-w-md mx-auto leading-relaxed font-light"
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
                className="group btn-glass px-8 py-3.5 rounded-full text-sm font-medium tracking-wide inline-flex items-center gap-3"
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
