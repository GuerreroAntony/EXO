"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Sparkles,
  Lightbulb,
  Cog,
  ArrowRight,
  Workflow,
  Clock,
  Shield,
  TrendingUp,
  MessageCircle,
  Image,
  Puzzle,
  Layers,
  Cpu,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { MorphingTextReveal } from "@/components/ui/morphing-text-reveal";

type Feature = { icon: LucideIcon; text: string; desc: string };
type Pillar = {
  tag: string;
  color: string;
  morphTexts: string[];
  subtitle: string;
  features: Feature[];
  cta: string;
  href: string;
  soon?: boolean;
};

const pillars: Pillar[] = [
  {
    tag: "DIGITAL WORKERS",
    color: "#6366f1",
    morphTexts: ["Automatize processos", "Escale operações", "Reduza custos", "Aumente produtividade"],
    subtitle: "Funcionários digitais autônomos que executam, decidem e aprendem — sem burnout, sem férias, sem limites.",
    features: [
      { icon: MessageCircle, text: "Atendimento WhatsApp Cloud API", desc: "Agentes inteligentes que atendem seus clientes via WhatsApp Business oficial da Meta — do primeiro contato ao fechamento, sem intervenção manual." },
      { icon: Clock, text: "Operação 24/7", desc: "Disponível todos os dias, sem pausas nem paradas." },
      { icon: Shield, text: "Compliance nativo", desc: "LGPD, auditoria e governança embutidas em cada execução." },
      { icon: TrendingUp, text: "Auto-otimização", desc: "Aprende com cada execução e melhora sozinho ao longo do tempo." },
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
      { icon: Sparkles, text: "Personalidade única", desc: "Identidade visual, tom de voz e história próprios da marca." },
      { icon: Image, text: "Conteúdo automatizado", desc: "Posts, reels e stories gerados continuamente em escala." },
      { icon: MessageCircle, text: "Engajamento 24/7", desc: "Responde comentários e DMs em tempo real, sem descanso." },
      { icon: TrendingUp, text: "Escala sem limites", desc: "Suporta audiências de qualquer tamanho sem perder qualidade." },
    ],
    cta: "Criar meu Influencer",
    href: "https://www.influencersvirtuais.com.br/",
  },
  {
    tag: "INNOVATION STUDIO",
    color: "#f97316",
    morphTexts: ["Consultoria de IA", "Soluções sob medida", "Integração total", "Resultados reais"],
    subtitle: "Nosso laboratório transforma desafios em vantagem competitiva com soluções de IA personalizadas.",
    features: [
      { icon: Lightbulb, text: "Consultoria estratégica", desc: "Diagnóstico e roadmap de IA desenhados para o seu negócio." },
      { icon: Puzzle, text: "Soluções customizadas", desc: "Desenvolvimento sob medida pra cada caso de uso real." },
      { icon: Layers, text: "Integração de sistemas", desc: "Conecta a IA à stack e ao fluxo de dados que você já usa." },
      { icon: Cpu, text: "Treinamento de modelos", desc: "Fine-tuning com seus dados proprietários e conhecimento interno." },
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
      { icon: Cog, text: "Logística automatizada", desc: "Armazéns e centros de distribuição operados por robôs autônomos." },
      { icon: Workflow, text: "Manufatura inteligente", desc: "Linhas de produção com visão computacional e controle adaptativo." },
      { icon: Cpu, text: "IA embarcada", desc: "Decisão local em tempo real, sem dependência de nuvem." },
      { icon: Users, text: "Colaboração humano-robô", desc: "Robôs que atuam lado a lado com equipes em segurança." },
    ],
    cta: "Em breve",
    href: "/robotica",
    soon: true,
  },
];

function PillarBody({ pillar }: { pillar: Pillar }) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
      <div>
        <div className="flex items-center gap-3 mb-5 lg:mb-6">
          <div className="h-px w-8 bg-white/80" />
          <span className="text-[10px] lg:text-xs font-mono tracking-[0.2em] font-medium text-white">
            {pillar.tag}
          </span>
        </div>

        <div className="mb-5 lg:mb-6">
          <MorphingTextReveal
            texts={pillar.morphTexts}
            className="text-[1.75rem] md:text-3xl lg:text-4xl font-bold text-white leading-tight"
            interval={3500}
            glitchOnHover={true}
          />
        </div>

        <p className="text-base lg:text-lg text-white/85 leading-relaxed mb-8 lg:mb-10 max-w-lg">
          {pillar.subtitle}
        </p>

        <Link
          href={pillar.href}
          className={`group inline-flex items-center gap-2.5 font-medium text-sm px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 ${
            pillar.soon
              ? "border border-white/40 text-white/80 cursor-default"
              : "bg-white hover:bg-white/90"
          }`}
          style={!pillar.soon ? { color: pillar.color } : undefined}
        >
          {pillar.cta}
          {!pillar.soon && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-5">
        {pillar.features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.text}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-7 border border-white/15"
            >
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-white/15 flex items-center justify-center mb-3 lg:mb-4">
                <Icon size={20} className="text-white" strokeWidth={1.5} />
              </div>
              <p className="text-sm lg:text-base font-semibold text-white leading-snug mb-1 lg:mb-1.5">
                {feature.text}
              </p>
              <p className="text-xs lg:text-sm text-white/75 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const inset = useTransform(scrollYProgress, [0, 1], ["2rem", "0rem"]);
  const radius = useTransform(scrollYProgress, [0, 1], ["48px", "0px"]);

  return (
    <section ref={sectionRef} className="relative lg:h-[150vh]">
      <div
        className="lg:hidden px-6 pt-32 pb-20"
        style={{ backgroundColor: pillar.color }}
      >
        <PillarBody pillar={pillar} />
      </div>

      <div className="hidden lg:block sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute overflow-hidden"
          style={{
            top: inset,
            right: inset,
            bottom: inset,
            left: inset,
            borderRadius: radius,
            backgroundColor: pillar.color,
          }}
        >
          <div className="w-full h-full flex items-center">
            <div className="max-w-7xl mx-auto w-full px-16 py-12">
              <PillarBody pillar={pillar} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function PillarSections() {
  return (
    <div>
      {pillars.map((pillar) => (
        <PillarCard key={pillar.tag} pillar={pillar} />
      ))}
    </div>
  );
}
