"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function DemoConfirmacao() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6 max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-[#5B9BF3]/10 border border-[#5B9BF3]/20 flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-8 h-8 text-[#5B9BF3]" />
        </div>
        <h1 className="text-3xl font-bold text-white">Recebemos sua solicitação!</h1>
        <p className="mt-4 text-white/40 font-light leading-relaxed">
          Nossa equipe entrará em contato em até 24 horas para agendar sua demonstração personalizada.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-3 text-sm font-medium text-white/60 border border-white/10 rounded-full hover:border-white/25 hover:text-white transition-all duration-500"
        >
          Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}
