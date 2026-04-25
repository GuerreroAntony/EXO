"use client";

import { motion } from "framer-motion";
import { Link2, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

const team = [
  {
    name: "Jimmy Peixoto",
    role: "CEO & Founder",
    bio: "Empreendedor serial com passagem por Brasil, EUA e Europa. Reconhecido como um dos 14 empreendedores mais inovadores do Brasil em 2014. Especialista em modelos de negócio escaláveis, desenvolvimento de negócios e liderança estratégica.",
    avatar: "JP",
    color: "#5B9BF3",
    linkedin: "https://linkedin.com/in/jimmypeixoto",
    website: "https://jimmypeixoto.com.br",
  },
  {
    name: "Eduardo Tonielo",
    role: "CTO",
    bio: "Engenheiro de software com profunda experiência em sistemas distribuídos e inteligência artificial. Lidera a arquitetura técnica da EXO, garantindo escala, performance e confiabilidade em cada produto.",
    avatar: "ET",
    color: "#10b981",
    linkedin: "",
    website: "",
  },
  {
    name: "André Abootre",
    role: "Head of Operations",
    bio: "Especialista em operações e crescimento, com histórico em estruturar times de alta performance. Responsável por orquestrar a operação da EXO e transformar visão em execução consistente.",
    avatar: "AA",
    color: "#f97316",
    linkedin: "",
    website: "",
  },
  {
    name: "Fefa Moreira",
    role: "Head of Design",
    bio: "Designer obcecada por experiências que combinam beleza e função. Define a linguagem visual e a identidade da EXO, garantindo que cada interação seja intuitiva e memorável.",
    avatar: "FM",
    color: "#a855f7",
    linkedin: "",
    website: "",
  },
];

const values = [
  {
    title: "Humanos primeiro",
    desc: "A tecnologia existe para expandir o potencial humano, não para substituí-lo.",
  },
  {
    title: "Execução > ideias",
    desc: "Ideias são baratas. O que importa é a capacidade de transformar visão em realidade.",
  },
  {
    title: "Transparência radical",
    desc: "Sem letras miúdas, sem promessas vazias. Construímos confiança com clareza.",
  },
];

export default function EquipePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[13px] tracking-[0.3em] uppercase text-[#5B9BF3] font-medium"
          >
            Equipe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.95]"
          >
            As pessoas por trás
            <br />
            <span className="text-[#5B9BF3]">da revolução.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Uma equipe obcecada por construir o futuro das operações empresariais com inteligência artificial.
          </motion.p>
        </div>
      </section>

      {/* Team Cards */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-muted/50 border border-border rounded-2xl p-8 hover:bg-muted hover:border-border transition-all duration-300"
              >
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-xl font-bold"
                  style={{ background: `${person.color}15`, color: person.color }}
                >
                  {person.avatar}
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-foreground">{person.name}</h3>
                <p className="text-sm font-medium mt-1 mb-4" style={{ color: person.color }}>
                  {person.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {person.bio}
                </p>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      <Link2 size={18} />
                    </a>
                  )}
                  {person.website && (
                    <a
                      href={person.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#5B9BF3] font-medium mb-4">
              Nossos valores
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              No que acreditamos.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
            Quer fazer parte?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Estamos sempre buscando pessoas excepcionais para expandir o futuro conosco.
          </p>
          <Link
            href="/demo"
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-medium rounded-full px-8 py-4 text-sm transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5"
          >
            Entre em contato
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
