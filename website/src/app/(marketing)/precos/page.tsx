"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, Brain, Users, Cog } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { ScrollReveal } from "@/components/ScrollReveal";

const products = [
  {
    icon: Bot,
    title: "Call Center IA",
    starting: "R$ 500",
    unit: "/agente/mês",
    desc: "Monte sua equipe de atendentes virtuais. Escolha quantos agentes sua operação precisa.",
    features: ["Voz + WhatsApp", "24/7 sem fila", "Escalação para humanos", "Analytics em tempo real"],
    href: "/callcenter",
    cta: "Configurar agentes",
    available: true,
  },
  {
    icon: Brain,
    title: "Influencers Virtuais",
    starting: "Sob consulta",
    unit: "",
    desc: "Influenciadores digitais com IA para redes sociais e marketing de conteúdo.",
    features: ["Criação de conteúdo", "Presença em redes sociais", "Interação com público", "Personalidade customizada"],
    href: "/inteligencia-virtual",
    cta: "Falar com vendas",
    available: false,
  },
  {
    icon: Users,
    title: "Digital Workers",
    starting: "Sob consulta",
    unit: "",
    desc: "Trabalhadores digitais autônomos que executam processos complexos de ponta a ponta.",
    features: ["Automação E2E", "Compliance nativo", "Auto-otimização", "Operação 24/7"],
    href: "/digital-workers",
    cta: "Falar com vendas",
    available: false,
  },
  {
    icon: Cog,
    title: "Robótica",
    starting: "Em breve",
    unit: "",
    desc: "Automação física inteligente para logística, manufatura e operações industriais.",
    features: ["Robôs autônomos", "Manutenção preditiva", "Integração com IA", "Logística"],
    href: "/robotica",
    cta: "Saber mais",
    available: false,
  },
];

export default function PrecosPage() {
  return (
    <main className="bg-black min-h-screen pt-36 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
              Preços
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-[-0.03em]">
              Pague pelo que usar.
            </h1>
            <p className="mt-4 text-white/35 font-light max-w-lg mx-auto">
              Cada vertical tem seu próprio modelo de preço.
              Comece pequeno e escale quando quiser.
            </p>
          </div>
        </ScrollReveal>

        {/* Product cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={product.href} className="group block h-full">
                <GlowCard className="h-full">
                  <div className="p-8 sm:p-10 flex flex-col h-full">
                    {/* Icon + title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-[#5B9BF3]/25 transition-all duration-500">
                        <product.icon className="w-5 h-5 text-white/30 group-hover:text-[#5B9BF3] transition-colors duration-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                        {!product.available && product.starting === "Em breve" && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/20">Soon</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{product.starting}</span>
                      <span className="text-sm text-white/30 ml-1">{product.unit}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/35 leading-relaxed mb-6">{product.desc}</p>

                    {/* Features */}
                    <div className="space-y-2.5 flex-1">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-[#5B9BF3]/50" />
                          <span className="text-sm text-white/40">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      <span
                        className={`w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-500 ${
                          product.available
                            ? "bg-white text-black group-hover:bg-white/90"
                            : "bg-white/[0.06] text-white/40 border border-white/[0.06]"
                        }`}
                      >
                        {product.cta}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-white/20">
            Todos os planos incluem 7 dias grátis • Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </div>
    </main>
  );
}
