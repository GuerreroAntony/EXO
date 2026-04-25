"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function DemoConfirmacao() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6 max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-muted/50 border border-border flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground">Recebemos sua solicitação!</h1>
        <p className="mt-4 text-muted-foreground font-light leading-relaxed">
          Nossa equipe entrará em contato em até 24 horas para agendar sua demonstração personalizada.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 border border-border text-muted-foreground rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:border-border hover:text-foreground"
        >
          Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}
