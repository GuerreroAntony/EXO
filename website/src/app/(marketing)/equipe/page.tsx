"use client";

import { motion } from "framer-motion";

import { TeamCarousel, type TeamMember } from "@/components/ui/team-carousel";

const team: TeamMember[] = [
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

      {/* Team Carousel */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6"
        >
          <TeamCarousel members={team} />
        </motion.div>
      </section>

    </main>
  );
}
