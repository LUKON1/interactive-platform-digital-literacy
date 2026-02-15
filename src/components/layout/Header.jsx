import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Trophy, Menu, X } from "lucide-react";
import { useProgressStore } from "../../store/useProgressStore";

export const Header = () => {
	const location = useLocation();
	const { xp, level, levelProgress, isMaxLevel, setProfileOpen } = useProgressStore();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Don't show header inside a lesson
	if (location.pathname.includes("/lesson/")) return null;

	const navLinks = [
		{ path: "/", label: "Постепенное обучение" },
		{ path: "/library", label: "Все темы" },
		{ path: "/about", label: "О проекте" },
	];

	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="sticky top-0 z-40 w-full backdrop-blur-lg bg-bg-base/80 border-b border-bg-surface-3 motion-safe">
			<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-3 group z-50 relative">
					<div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center text-on-primary shadow-lg group-hover:scale-105 transition-transform">
						<ShieldCheck size={24} strokeWidth={2.5} />
					</div>
					<span className="text-xl font-bold text-text-primary tracking-tight">Cyber Academy</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => (
						<Link
							key={link.path}
							to={link.path}
							className={`text-md font-medium transition-colors ${
								location.pathname === link.path
									? "text-primary"
									: "text-text-primary hover:text-primary"
							}`}>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Right Side: Stats & Mobile Toggle */}
				<div className="flex items-center gap-4 z-50 relative">
					<button
						onClick={() => setProfileOpen(true)}
						className="relative group cursor-pointer focus:outline-none">
						<div className="flex items-center gap-3 px-4 py-2 rounded-full bg-bg-surface-2 border border-bg-surface-3 relative overflow-hidden transition-transform active:scale-95 hover:border-primary/30">
							{/* Progress Bar Background */}
							<motion.div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full" />
							<motion.div
								className="absolute bottom-0 left-0 h-1 bg-primary"
								initial={{ width: 0 }}
								animate={{ width: `${levelProgress || 0}%` }}
								transition={{ duration: 1, ease: "easeOut" }}
							/>

							<div className="flex items-center gap-2 z-10">
								<Trophy size={18} className="text-warning fill-warning/20" />
								<span className="text-sm font-bold text-text-primary">Lvl {level}</span>
								{isMaxLevel ? (
									<span className="text-xs font-bold text-primary border-l border-bg-surface-3 pl-2 ml-1">
										MAX
									</span>
								) : (
									<span className="text-sm text-text-secondary border-l border-bg-surface-3 pl-2 ml-1 font-mono">
										{xp} XP
									</span>
								)}
							</div>
						</div>

						{/* Tooltip for progress */}
						<div className="absolute top-full right-0 mt-2 px-3 py-1 bg-bg-surface-3 text-xs text-text-secondary rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-bg-surface-3">
							Нажмите для прогресса
						</div>
					</button>

					{/* Mobile Menu Toggle */}
					<button
						className="md:hidden p-2 rounded-lg hover:bg-bg-surface-2 text-text-primary transition-colors"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
						<motion.div
							initial={false}
							animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
							transition={{ type: "spring", stiffness: 260, damping: 20 }}>
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</motion.div>
					</button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="md:hidden border-t border-bg-surface-3 bg-bg-base/95 backdrop-blur-xl overflow-hidden motion-safe">
						<nav className="flex flex-col p-6 gap-4">
							{navLinks.map((link, i) => (
								<motion.div
									key={link.path}
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: i * 0.1 }}
									onClick={() => setIsMobileMenuOpen(false)}>
									<Link
										to={link.path}
										className={`text-lg font-medium block py-2 ${
											location.pathname === link.path
												? "text-primary"
												: "text-text-primary hover:text-primary"
										}`}>
										{link.label}
									</Link>
								</motion.div>
							))}
							{/* Mobile Profile Link */}
							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: navLinks.length * 0.1 }}
								onClick={() => {
									setIsMobileMenuOpen(false);
									setProfileOpen(true);
								}}>
								<button className="text-lg font-medium block py-2 text-text-primary hover:text-primary w-full text-left">
									Прогресс и Настройки
								</button>
							</motion.div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
};
