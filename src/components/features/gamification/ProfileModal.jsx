import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Trash2, AlertTriangle, CheckCircle, Shield, Award } from "lucide-react";
import { useProgressStore } from "../../../store/useProgressStore";

export const ProfileModal = () => {
	const { xp, level, levelProgress, resetProgress, isMaxLevel, isProfileOpen, setProfileOpen } =
		useProgressStore();
	const [confirmReset, setConfirmReset] = useState(false);

	const onClose = () => setProfileOpen(false);

	const handleReset = () => {
		resetProgress();
		setConfirmReset(false);
		onClose();
		window.location.reload(); // Hard reload to ensure clean state
	};

	return (
		<AnimatePresence>
			{isProfileOpen && (
				<div className="fixed inset-0 z-100 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						className="relative bg-bg-surface-1 border border-bg-surface-3 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-bg-surface-3 bg-bg-surface-2/50">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
									<User size={20} />
								</div>
								<div>
									<h2 className="text-xl font-bold text-text-primary">Прогресс</h2>
									<p className="text-xs text-text-muted">Настройки</p>
								</div>
							</div>
							<button
								onClick={onClose}
								className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-full transition-colors">
								<X size={20} />
							</button>
						</div>

						{/* Content */}
						<div className="p-6 space-y-8 overflow-y-auto">
							{/* Stats Card */}
							<div className="space-y-4">
								<h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
									Твой Прогресс
								</h3>
								<div className="bg-bg-base border border-bg-surface-3 rounded-xl p-5 relative overflow-hidden">
									<div className="flex items-center justify-between mb-4 relative z-10">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-warning/10 rounded-lg text-warning">
												<Award size={24} />
											</div>
											<div>
												<div className="text-2xl font-bold text-text-primary">
													{level} <span className="text-sm text-text-muted font-normal">ур.</span>
												</div>
												<div className="text-xs text-text-secondary">Текущий уровень</div>
											</div>
										</div>
										<div className="text-right">
											<div className="text-xl font-mono text-primary">{xp}</div>
											<div className="text-xs text-text-secondary">Total XP</div>
										</div>
									</div>

									{/* Level Progress */}
									<div className="space-y-1 relative z-10">
										<div className="h-2 w-full bg-bg-surface-3 rounded-full overflow-hidden">
											<motion.div
												className="h-full bg-primary"
												initial={{ width: 0 }}
												animate={{ width: `${levelProgress}%` }}
												transition={{ duration: 1 }}
											/>
										</div>
										<div className="flex justify-between text-xs text-text-muted">
											<span>{Math.round(levelProgress)}% до след. уровня</span>
											{isMaxLevel && <span className="text-warning font-bold">MAX</span>}
										</div>
									</div>

									{/* Background Decor */}
									<div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
										<Shield size={120} />
									</div>
								</div>
							</div>

							{/* Danger Zone */}
							<div className="space-y-4 pt-4 border-t border-bg-surface-3">
								{confirmReset ? (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										className="bg-error/10 border border-error/20 rounded-xl p-4 space-y-3">
										<p className="text-sm text-text-primary font-medium">
											Вы уверены? Весь прогресс будет потерян безвозвратно.
										</p>
										<div className="flex gap-2">
											<button
												onClick={handleReset}
												className="flex-1 py-2 bg-error hover:bg-error/90 text-white rounded-lg text-sm font-bold transition-colors">
												Да, удалить
											</button>
											<button
												onClick={() => setConfirmReset(false)}
												className="flex-1 py-2 bg-bg-surface-1 hover:bg-bg-surface-2 text-text-primary border border-bg-surface-3 rounded-lg text-sm font-bold transition-colors">
												Отмена
											</button>
										</div>
									</motion.div>
								) : (
									<button
										onClick={() => setConfirmReset(true)}
										className="w-full py-3 px-4 flex items-center justify-between bg-error/5 hover:bg-error/10 border border-error/10 hover:border-error/30 rounded-xl group transition-all">
										<span className="text-sm font-medium text-text-primary group-hover:text-error transition-colors">
											Сбросить весь прогресс
										</span>
										<Trash2
											size={18}
											className="text-text-muted group-hover:text-error transition-colors"
										/>
									</button>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
