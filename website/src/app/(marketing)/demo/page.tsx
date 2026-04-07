"use client";

import { motion } from "framer-motion";
import { DemoForm } from "@/components/forms/DemoForm";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black pt-44 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
            Agende uma demonstração
          </p>
          <h1 className="mt-4 text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Veja a EXO em ação.
          </h1>
          <p className="mt-4 text-white/35 font-light">
            Preencha o formulário e nossa equipe entrará em contato em até 24h.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DemoForm />
        </motion.div>
      </div>
    </div>
  );
}
