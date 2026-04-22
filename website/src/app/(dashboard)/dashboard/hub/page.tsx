"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Sparkles, Users, ArrowRight } from "lucide-react";

const products = [
  {
    name: "Call Center",
    desc: "Agentes de voz com IA que atendem, agendam e cobram 24/7.",
    icon: Phone,
    color: "#5B9BF3",
    href: "/dashboard",
    active: true,
  },
  {
    name: "Influencers Virtuais",
    desc: "Personalidades digitais que engajam e criam conteudo em todas as plataformas.",
    icon: Sparkles,
    color: "#22d3ee",
    href: "/dashboard",
    active: true,
  },
  {
    name: "Digital Workers",
    desc: "Funcionarios digitais autonomos para vendas, financeiro, RH e analytics.",
    icon: Users,
    color: "#a78bfa",
    href: "/workers",
    active: false,
  },
];

export default function HubPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Seus Produtos
        </h1>
        <p className="mt-3 text-[#666] text-base">
          Escolha qual plataforma deseja acessar.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {products.map((product, i) => {
          const Icon = product.icon;
          const Card = (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group relative rounded-2xl bg-[#151515] border border-[#333] p-8 transition-all duration-200 ${
                product.active
                  ? "hover:bg-[#1a1a1a] hover:border-[#2a2a2a] cursor-pointer"
                  : "opacity-60"
              }`}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${product.color}12` }}
              >
                <Icon size={20} style={{ color: product.color }} />
              </div>

              {/* Name + Badge */}
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-medium text-white tracking-tight">
                  {product.name}
                </h2>
                {!product.active && (
                  <span className="text-[10px] uppercase tracking-widest text-[#555] bg-[#1e1e1e] px-2 py-0.5 rounded-full font-medium">
                    Em breve
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#888] leading-relaxed mb-6">
                {product.desc}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: product.active ? product.color : "#555" }}>
                {product.active ? "Acessar" : "Em breve"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </motion.div>
          );

          return product.active ? (
            <Link key={product.name} href={product.href}>
              {Card}
            </Link>
          ) : (
            <div key={product.name}>{Card}</div>
          );
        })}
      </div>
    </div>
  );
}
