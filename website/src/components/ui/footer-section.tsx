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
			{ title: 'Rob\u00f3tica', href: '/robotica', icon: Cog },
		],
	},
	{
		label: 'Empresa',
		links: [
			{ title: 'Pre\u00e7os', href: '/precos' },
			{ title: 'Agendar Demo', href: '/demo' },
			{ title: 'Entrar', href: '/login' },
			{ title: 'Criar Conta', href: '/signup' },
		],
	},
	{
		label: 'Contato',
		links: [
			{ title: 'contato@exo.ai', href: 'mailto:contato@exo.ai', icon: Mail },
			{ title: 'S\u00e3o Paulo, Brasil', href: '#', icon: MapPin },
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
		<footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-[#1e1e1e] bg-[radial-gradient(35%_128px_at_50%_0%,rgba(91,155,243,0.06),transparent)] px-6 py-12 lg:py-16">
			<div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur bg-[#5B9BF3]/20" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<Link href="/" className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-lg bg-[#5B9BF3]/20 flex items-center justify-center">
							<span className="text-[#5B9BF3] font-bold text-sm font-mono">EX</span>
						</div>
						<span className="text-white font-semibold text-lg tracking-tight">EXO</span>
					</Link>
					<p className="text-[#888] text-sm leading-relaxed max-w-xs">
						Expandindo humanos atrav\u00e9s de agentes de IA, influencers virtuais e rob\u00f3tica.
					</p>
					<p className="text-[#555] text-xs">
						\u00a9 {new Date().getFullYear()} EXO. Todos os direitos reservados.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs text-white font-semibold uppercase tracking-wider">{section.label}</h3>
								<ul className="mt-4 space-y-2.5 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<Link
												href={link.href}
												className="text-[#888] hover:text-white inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1.5 size-3.5" />}
												{link.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
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
