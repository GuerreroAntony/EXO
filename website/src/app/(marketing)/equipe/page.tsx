"use client";

import { motion } from "framer-motion";
import { Link2, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

const team = [
  {
    name: "Jimmy Peixoto",
    role: "Founder & CEO",
    bio: "Visionário e serial entrepreneur. Harvard, MIT, BYU. Histórico comprovado em escala e inovação. Lidera operação, infraestrutura e direção geral da EXO.",
    avatar: "JP",
    color: "#5B9BF3",
    pillars: "Liderança Geral, Operação, Infraestrutura",
    linkedin: "https://linkedin.com/in/jimmypeixoto",
    website: "https://jimmypeixoto.com.br",
  },
  {
    name: "André Aboutre",
    role: "Influência & Entretenimento",
    bio: "30+ anos no show business. Network estratégico com artistas, celebridades e mercado publicitário. Conecta a EXO ao ecossistema cultural e de influência.",
    avatar: "AA",
    color: "#a855f7",
    pillars: "Influencers Virtuais, Comunicação",
    linkedin: "",
    website: "",
  },
  {
    name: "Fefa Fernandes",
    role: "Creators & Posicionamento",
    bio: "Referência em transformar pessoas e empresários em geradores de conteúdo. Venture Capital e empreendedora serial. Estrutura a camada de criadores e posicionamento de marca.",
    avatar: "FF",
    color: "#ec4899",
    pillars: "Influencers Virtuais, Comunicação, Estratégia",
    linkedin: "",
    website: "",
  },
  {
    name: "Emilinho Surita",
    role: "Negócios & Mídia",
    bio: "Comunicador e empresário. Conexão com grandes marcas, mídia e ambiente político. Articula a presença da EXO no ecossistema midiático e institucional.",
    avatar: "ES",
    color: "#10b981",
    pillars: "Política & Governos, Comunicação",
    linkedin: "",
    website: "",
  },
  {
    name: "André Silva",
    role: "Expansão de Marcas",
    bio: "16+ anos em expansão de marcas e franquias. Especialista em crescimento e estrutura de negócios. Lidera a expansão multissetorial e o go-to-market da EXO.",
    avatar: "AS",
    color: "#f97316",
    pillars: "Design & Marketing Intelligence, Estratégia",
    linkedin: "",
    website: "",
  },
  {
    name: "Tiago Henrique",
    role: "Legal & Governança",
    bio: "Advogado especialista em proteção de dados e IA. Vice-Presidente de Direito Digital da OAB Cotia. Constrói a base jurídica e de governança da EXO.",
    avatar: "TH",
    color: "#0ea5e9",
    pillars: "Legal, Infraestrutura, Governança",
    linkedin: "",
    website: "",
  },
  {
    name: "Eduardo Toniello Meirelles",
    role: "Relações com Investidores",
    bio: "Experiência em bancos, corretoras e mercados internacionais. RI e conexão com fundos e capital. Lidera a captação e o relacionamento com investidores estratégicos.",
    avatar: "ET",
    color: "#eab308",
    pillars: "Relações com Investidores, Capital",
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
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {person.bio}
                </p>

                {/* Pilares */}
                <div className="mb-6 pt-4 border-t border-border/50">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 font-medium mb-1.5">
                    Pilares
                  </p>
                  <p className="text-xs font-medium" style={{ color: person.color }}>
                    {person.pillars}
                  </p>
                </div>

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
