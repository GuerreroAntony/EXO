'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Bot, Phone, Users, Cog, Mail, MapPin, Globe, Link2 } from 'lucide-react';
import Link from 'next/link';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Produtos',
		links: [
			{ title: 'Call Center IA', href: '/callcenter', icon: Phone },
			{ title: 'Influencers Virtuais', href: '/inteligencia-virtual', icon: Users },
			{ title: 'Digital Workers', href: '/digital-workers', icon: Bot },
			{ title: 'Robótica', href: '/robotica', icon: Cog },
		],
	},
	{
		label: 'Empresa',
		links: [
			{ title: 'Preços', href: '/precos' },
			{ title: 'Agendar Demo', href: '/demo' },
			{ title: 'Entrar', href: '/login' },
			{ title: 'Criar Conta', href: '/signup' },
		],
	},
	{
		label: 'Contato',
		links: [
			{ title: 'contato@exo.ai', href: 'mailto:contato@exo.ai', icon: Mail },
			{ title: 'São Paulo, Brasil', href: '#', icon: MapPin },
		],
	},
	{
		label: 'Social',
		links: [
			{ title: 'Instagram', href: '#', icon: Globe },
			{ title: 'LinkedIn', href: '#', icon: Link2 },
		],
	},
];

export function Footer() {
	return (
		<footer
			className="relative w-full"
			style={{
				background: "rgba(255, 255, 255, 0.07)",
				backdropFilter: "blur(60px) saturate(1.8)",
				WebkitBackdropFilter: "blur(60px) saturate(1.8)",
				borderTop: "1px solid rgba(255, 255, 255, 0.14)",
				boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12)",
			}}
		>
			<div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
				{/* Main grid — links */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16">
					{/* Brand column */}
					<AnimatedContainer className="col-span-2 md:col-span-1 space-y-4">
						<Link href="/" className="text-2xl font-black tracking-[-0.05em] text-white">
							EXO
						</Link>
						<p className="text-white/35 text-sm leading-relaxed max-w-[200px]">
							Expandindo humanos através de agentes de IA.
						</p>
					</AnimatedContainer>

					{/* Link columns */}
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<h3 className="text-xs text-white/25 uppercase tracking-[0.2em] font-medium mb-5">{section.label}</h3>
							<ul className="space-y-3 text-sm">
								{section.links.map((link) => (
									<li key={link.title}>
										<Link
											href={link.href}
											className="text-white/40 hover:text-white inline-flex items-center transition-colors duration-300"
										>
											{link.icon && <link.icon className="me-1.5 size-3.5" />}
											{link.title}
										</Link>
									</li>
								))}
							</ul>
						</AnimatedContainer>
					))}
				</div>

				{/* Bottom bar */}
				<div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-white/20 text-xs">
						© {new Date().getFullYear()} EXO. Todos os direitos reservados.
					</p>
					<div className="flex items-center gap-6">
						<Link href="#" className="text-white/20 hover:text-white/50 text-xs transition-colors">Privacidade</Link>
						<Link href="#" className="text-white/20 hover:text-white/50 text-xs transition-colors">Termos</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
