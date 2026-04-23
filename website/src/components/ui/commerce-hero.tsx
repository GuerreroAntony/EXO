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
    icon: Users,
    color: "#a78bfa",
    bg: "bg-violet-50",
    href: "/digital-workers",
  },
  {
    title: "Influencers Virtuais",
    icon: Sparkles,
    color: "#22d3ee",
    bg: "bg-cyan-50",
    href: "/inteligencia-virtual",
  },
  {
    title: "Innovation Studio",
    icon: Lightbulb,
    color: "#f59e0b",
    bg: "bg-amber-50",
    href: "/innovation-studio",
  },
  {
    title: "Robótica",
    icon: Cog,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                className="group relative bg-muted/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 min-h-[250px] sm:min-h-[300px] w-full overflow-hidden transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <Link href={category.href} className="absolute inset-0 z-20">
                  <h2 className="text-center text-2xl sm:text-3xl font-bold relative z-10 my-2 sm:my-4 transition-colors duration-300"
                    style={{ color: category.color }}
                  >
                    {category.title}
                  </h2>
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500"
                      style={{ background: `${category.color}15` }}
                    >
                      <Icon size={48} style={{ color: category.color }} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-background/95 backdrop-blur-sm rounded-tl-xl flex items-center justify-center z-10 border-l border-t border-border/50">
                    <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg"
                      style={{ ['--tw-shadow-color' as string]: `${category.color}30` }}
                    >
                      <ArrowUpRight className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
    </div>
  );
}
