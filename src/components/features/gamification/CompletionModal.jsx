import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, ShieldAlert, Award } from "lucide-react";
import { useProgressStore } from "../../../store/useProgressStore";
import confetti from "canvas-confetti";

export const CompletionModal = () => {
	const { isMaxLevel, hasSeenCompletionModal, markCompletionModalSeen } = useProgressStore();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isMaxLevel && !hasSeenCompletionModal) {
			// Delay slightly to let other animations finish
			const timer = setTimeout(() => {
				setIsOpen(true);
				triggerConfetti();
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [isMaxLevel, hasSeenCompletionModal]);

	const handleClose = () => {
		setIsOpen(false);
		markCompletionModalSeen();
	};

	const triggerConfetti = () => {
		const duration = 3000;
		const end = Date.now() + duration;

		(function frame() {
			confetti({
				particleCount: 5,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: ["#3b82f6", "#10b981", "#f59e0b"],
			});
			confetti({
				particleCount: 5,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: ["#3b82f6", "#10b981", "#f59e0b"],
			});

			if (Date.now() < end) {
				requestAnimationFrame(frame);
			}
		})();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-100 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						className="relative bg-bg-surface-1 border border-bg-surface-3 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl overflow-hidden">
						{/* Background decorative glow */}
						<div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
						<div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

						{/* Close Button */}
						<button
							onClick={handleClose}
							className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-full transition-colors">
							<X size={20} />
						</button>

						<div className="flex flex-col items-center text-center space-y-6 relative z-10">
							{/* Icon */}
							<div className="w-20 h-20 rounded-2xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 mb-2">
								<Trophy size={40} className="fill-white/20" />
							</div>

							<div>
								<h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
									Поздравляем! 🎉
								</h2>
								<p className="text-text-secondary text-lg">
									Ты прошел все доступные уроки и стал <br />
									<span className="text-primary font-bold">Кибер-Экспертом</span>!
								</p>
							</div>

							<div className="bg-bg-surface-2 border border-bg-surface-3 rounded-xl p-4 text-left w-full space-y-3">
								<div className="flex items-start gap-3">
									<ShieldAlert className="text-warning shrink-0 mt-1" size={20} />
									<div>
										<h4 className="font-bold text-text-primary text-sm">Важное напоминание</h4>
										<p className="text-sm text-text-secondary mt-1">
											Знания — это сила, но хакеры не стоят на месте.
										</p>
									</div>
								</div>
								<ul className="text-sm text-text-secondary space-y-2 list-disc list-inside pl-2">
									<li>Всегда проверяй ссылки перед кликом</li>
									<li>Следи за своей безопасностью и данными</li>
									<li>Не верь всему, что видишь в интернете</li>
								</ul>
							</div>

							<button
								onClick={handleClose}
								className="w-full py-3 px-6 bg-primary hover:bg-primary-hover text-on-primary font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/25 active:scale-95">
								Продолжить
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
