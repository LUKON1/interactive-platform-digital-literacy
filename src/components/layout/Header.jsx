import React from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Trophy } from "lucide-react";
import { useProgressStore } from "../../store/useProgressStore";

export const Header = () => {
	const location = useLocation();
	const { xp, level } = useProgressStore();

	// Don't show header inside a lesson
	if (location.pathname.includes("/lesson/")) return null;

	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[var(--color-bg-base)]/80 border-b border-[var(--color-bg-surface-3)]">
			<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3 group">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-[var(--color-on-primary)] shadow-lg group-hover:scale-105 transition-transform">
						<ShieldCheck size={24} strokeWidth={2.5} />
					</div>
					<span className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
						Cyber Academy
					</span>
				</Link>

				<nav className="hidden md:flex items-center gap-8">
					<Link
						to="/"
						className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
						Постепенное обучение
					</Link>
					<Link
						to="/library"
						className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
						Все темы
					</Link>
					<Link
						to="/about"
						className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
						О проекте
					</Link>
				</nav>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-surface-2)] border border-[var(--color-bg-surface-3)]">
						<Trophy size={16} className="text-[var(--color-warning)]" />
						<span className="text-sm font-bold text-[var(--color-text-primary)]">Lvl {level}</span>
						<span className="text-xs text-[var(--color-text-secondary)] border-l border-[var(--color-bg-surface-3)] pl-2 ml-1">
							{xp} XP
						</span>
					</div>
				</div>
			</div>
		</motion.header>
	);
};
