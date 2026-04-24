"use client";

import { motion } from "framer-motion";
import { Users, Sparkles, Lightbulb, Cog, ArrowRight, Phone, Workflow, Clock, Shield, TrendingUp, MessageCircle, Image, Puzzle, Layers, Cpu } from "lucide-react";
import Link from "next/link";
import { MorphingTextReveal } from "@/components/ui/morphing-text-reveal";

const pillars = [
  {
    tag: "DIGITAL WORKERS",
    color: "#6366f1",
    morphTexts: ["Automatize processos", "Escale operações", "Reduza custos", "Aumente produtividade"],
    subtitle: "Funcionários digitais autônomos que executam, decidem e aprendem — sem burnout, sem férias, sem limites.",
    features: [
      { icon: Workflow, text: "Automação end-to-end" },
      { icon: Clock, text: "Operação 24/7" },
      { icon: Shield, text: "Compliance nativo" },
      { icon: TrendingUp, text: "Auto-otimização" },
    ],
    cta: "Conhecer Digital Workers",
    href: "/digital-workers",
  },
  {
    tag: "INFLUENCERS VIRTUAIS",
    color: "#0ea5e9",
    morphTexts: ["Crie conteúdo", "Engaje seguidores", "Escale presença", "Represente sua marca"],
    subtitle: "Personalidades digitais com identidade própria que produzem conteúdo, interagem com público e nunca param.",
    features: [
      { icon: Sparkles, text: "Personalidade única" },
      { icon: Image, text: "Conteúdo automatizado" },
      { icon: MessageCircle, text: "Engajamento 24/7" },
      { icon: TrendingUp, text: "Escala sem limites" },
    ],
    cta: "Criar meu Influencer",
    href: "/inteligencia-virtual",
  },
  {
    tag: "INNOVATION STUDIO",
    color: "#f97316",
    morphTexts: ["Consultoria de IA", "Soluções sob medida", "Integração total", "Resultados reais"],
    subtitle: "Nosso laboratório transforma desafios em vantagem competitiva com soluções de IA personalizadas.",
    features: [
      { icon: Lightbulb, text: "Consultoria estratégica" },
      { icon: Puzzle, text: "Soluções customizadas" },
      { icon: Layers, text: "Integração de sistemas" },
      { icon: Cpu, text: "Treinamento de modelos" },
    ],
    cta: "Falar com o Studio",
    href: "/innovation-studio",
  },
  {
    tag: "ROBÓTICA",
    color: "#10b981",
    morphTexts: ["Logística inteligente", "Manufatura autônoma", "IA embarcada", "Colaboração humano-robô"],
    subtitle: "Automação física inteligente para operações — controlada por IA, integrada ao seu sistema.",
    features: [
      { icon: Cog, text: "Logística automatizada" },
      { icon: Workflow, text: "Manufatura inteligente" },
      { icon: Cpu, text: "IA embarcada" },
      { icon: Users, text: "Colaboração humano-robô" },
    ],
    cta: "Em breve",
    href: "/robotica",
    soon: true,
  },
];

export function PillarSections() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {pillars.map((pillar, i) => (
        <motion.section
          key={pillar.tag}
          className="py-24 lg:py-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Divider */}
          {i > 0 && <div className="line-fade mb-24 lg:mb-32" />}

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Tag */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: pillar.color }} />
                <span
                  className="text-xs font-mono tracking-[0.2em] font-medium"
                  style={{ color: pillar.color }}
                >
                  {pillar.tag}
                </span>
              </div>

              {/* Morphing title */}
              <div className="mb-6">
                <MorphingTextReveal
                  texts={pillar.morphTexts}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold"
                  interval={3500}
                  glitchOnHover={true}
                />
              </div>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                {pillar.subtitle}
              </p>

              {/* CTA */}
              <Link
                href={pillar.href}
                className={`group inline-flex items-center gap-2.5 font-medium text-sm px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 ${
                  pillar.soon
                    ? "border border-border text-muted-foreground cursor-default"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {pillar.cta}
                {!pillar.soon && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </Link>
            </motion.div>

            {/* Right: feature cards */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {pillar.features.map((feature, fi) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.text}
                    className="bg-muted/50 rounded-2xl p-5 transition-all duration-300 hover:bg-muted"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + fi * 0.1 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${pillar.color}15` }}
                    >
                      <Icon size={20} style={{ color: pillar.color }} strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{feature.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
