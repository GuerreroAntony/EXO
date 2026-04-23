"use client";

import { ArrowUpRight, Menu, Search, Users, Sparkles, Lightbulb, Cog } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    title: "Digital Workers",
    desc: "Funcionários digitais autônomos que executam, decidem e aprendem.",
    icon: Users,
    color: "#a78bfa",
    bg: "bg-violet-50",
    href: "/digital-workers",
    cta: "Conhecer",
  },
  {
    title: "Influencers Virtuais",
    desc: "Personalidades digitais que engajam e criam conteúdo 24/7.",
    icon: Sparkles,
    color: "#22d3ee",
    bg: "bg-cyan-50",
    href: "/inteligencia-virtual",
    cta: "Conhecer",
  },
  {
    title: "Innovation Studio",
    desc: "Soluções personalizadas de IA sob medida para seu negócio.",
    icon: Lightbulb,
    color: "#f59e0b",
    bg: "bg-amber-50",
    href: "/innovation-studio",
    cta: "Explorar",
  },
  {
    title: "Robótica",
    desc: "Automação física inteligente para logística e manufatura.",
    icon: Cog,
    cta: "Em breve",
    color: "#34d399",
    bg: "bg-emerald-50",
    href: "/robotica",
  },
];

const navigation = [
  { name: "Call Center", href: "/callcenter" },
  { name: "Influencers", href: "/inteligencia-virtual" },
  { name: "Digital Workers", href: "/digital-workers" },
  { name: "Robótica", href: "/robotica" },
  { name: "Studio", href: "/innovation-studio" },
  { name: "Equipe", href: "/equipe" },
];

export function CommerceHero() {
  return (
    <div className="w-full relative container px-2 mx-auto max-w-7xl min-h-screen">

        <div className="mt-6 bg-accent/50 rounded-2xl relative">
          <header className="flex items-center">
            <div className="w-full md:w-2/3 lg:w-1/2 bg-background/95 backdrop-blur-sm p-4 rounded-br-2xl flex items-center gap-2">
              <Link href="/" className="text-xl font-bold tracking-[-0.05em] text-foreground">
                EXO
              </Link>

              <nav className="hidden lg:flex items-center justify-between w-full">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant="link"
                    className="cursor-pointer relative group hover:text-primary transition-colors text-xs tracking-wide"
                    asChild
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ))}
              </nav>

              <Sheet>
                <SheetTrigger asChild className="lg:hidden ml-auto">
                  <Button variant="ghost" size="icon" className="hover:text-primary transition-colors">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] p-0 bg-background/95 backdrop-blur-md border-r border-border/50"
                >
                  <SheetHeader className="p-6 text-left border-b border-border/50">
                    <SheetTitle>
                      <Link href="/" className="text-xl font-bold tracking-[-0.05em]">
                        EXO
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-6 space-y-1">
                    {navigation.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="justify-start px-2 h-12 text-base font-medium hover:bg-accent/50 hover:text-primary transition-colors"
                        asChild
                      >
                        <Link href={item.href}>{item.name}</Link>
                      </Button>
                    ))}
                  </nav>
                  <Separator className="mx-6" />
                  <div className="p-6 flex flex-col gap-3">
                    <Button variant="outline" className="justify-start gap-2 h-12" asChild>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button className="w-full h-12" asChild>
                      <Link href="/demo">
                        Agendar Demo
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden md:flex w-1/2 justify-end items-center pr-4 gap-4 ml-auto">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button
                variant="secondary"
                className="cursor-pointer bg-primary-foreground p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                asChild
              >
                <Link href="/demo">
                  <span className="pl-4 py-2 text-sm font-medium">Agendar Demo</span>
                  <div className="rounded-full flex items-center justify-center m-auto bg-background w-10 h-10 ml-2 group-hover:scale-110 transition-transform duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
              </Button>
            </div>
          </header>

          <motion.section
            className="w-full px-4 py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <span className="text-foreground">
                  EXO
                </span>
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                Levamos inteligência artificial para operações de vendas, atendimento,
                marketing e finanças em qualquer lugar do mundo.
              </motion.p>
            </div>
          </motion.section>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-12 mb-20">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                className="group relative bg-muted/50 rounded-3xl p-6 sm:p-8 w-full overflow-hidden transition-all duration-500 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                style={{ borderTop: `3px solid ${category.color}` }}
              >
                <Link href={category.href} className="block">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `${category.color}12` }}
                  >
                    <Icon size={28} style={{ color: category.color }} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold mb-2 transition-colors duration-300"
                    style={{ color: category.color }}
                  >
                    {category.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {category.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all duration-300"
                    style={{ color: category.color }}
                  >
                    {category.cta}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
    </div>
  );
}
