"use client";

import { motion } from "framer-motion";
import { Lightbulb, Rocket, Layers, Cpu, Puzzle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Lightbulb,
    name: "Consultoria de IA",
    desc: "Analisamos sua operação e identificamos onde a IA pode gerar mais impacto. Do diagnóstico ao roadmap de implementação.",
  },
  {
    icon: Puzzle,
    name: "Soluções Sob Medida",
    desc: "Desenvolvemos agentes e automações customizados para resolver problemas específicos do seu negócio.",
  },
  {
    icon: Layers,
    name: "Integração de Sistemas",
    desc: "Conectamos IA aos seus sistemas existentes — CRM, ERP, WhatsApp, e-mail — sem interromper sua operação.",
  },
  {
    icon: Cpu,
    name: "Treinamento de Modelos",
    desc: "Treinamos modelos de IA com seus dados para resultados mais precisos e alinhados ao seu contexto.",
  },
];

const process = [
  { step: "01", title: "Discovery", desc: "Entendemos seu negócio, dores e oportunidades em uma sessão de diagnóstico." },
  { step: "02", title: "Design", desc: "Desenhamos a solução ideal — arquitetura, fluxos e integrações necessárias." },
  { step: "03", title: "Build", desc: "Desenvolvemos, testamos e refinamos até a solução estar pronta para produção." },
  { step: "04", title: "Launch", desc: "Implantamos com acompanhamento e iteramos com base nos resultados reais." },
];

export default function InnovationStudioPage() {
  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-10 bg-[#f59e0b]" />
            <p className="text-[13px] tracking-[0.3em] uppercase text-[#f59e0b] font-medium">
              Innovation Studio
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[0.95] max-w-3xl"
          >
            Transformamos ideias
            <br />
            <span className="text-[#f59e0b]">em soluções de IA.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-lg text-white/50 max-w-xl leading-relaxed"
          >
            Nosso laboratório de inovação cria soluções personalizadas de inteligência artificial
            para empresas que querem liderar, não apenas acompanhar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex items-center gap-5"
          >
            <Link
              href="/demo"
              className="group flex items-center gap-2.5 bg-white text-black font-medium text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5"
            >
              Agendar Consultoria
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#process"
              className="text-[14px] text-white/25 hover:text-white/60 transition-colors duration-300"
            >
              Como funciona
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#f59e0b] font-medium mb-4">O que fazemos</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Soluções que resolvem
              <br />
              <span className="text-white/40">problemas reais.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center mb-5">
                  <s.icon className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.name}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#f59e0b] font-medium mb-4">Processo</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Do problema à solução
              <br />
              <span className="text-white/40">em 4 etapas.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 h-full">
                  <span className="text-3xl font-bold text-[#f59e0b]/20 mb-4 block">{p.step}</span>
                  <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-8 h-8 text-[#f59e0b] mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4">
              Tem um desafio? Nós temos a solução.
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
              Conte-nos sobre seu projeto e criaremos algo único para sua empresa.
            </p>
            <Link
              href="/demo"
              className="group inline-flex items-center gap-3 bg-white text-black font-medium rounded-full px-8 py-4 text-sm transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5"
            >
              Falar com o Studio
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
