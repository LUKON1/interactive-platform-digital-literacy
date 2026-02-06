import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CheckCircle, AlertTriangle, MapPin, Briefcase, Calendar, Eye } from "lucide-react";
import { clsx } from "clsx";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const SocialDetective = ({ data, onComplete, onPrevious, canGoPrevious, isCompleted }) => {
	// Social Detective Interactive - Refactored to match ImageComparison style
	const { image, clues } = data;
	const [foundClues, setFoundClues] = useState(isCompleted ? clues.map((c) => c.id) : []);
	const [activeClue, setActiveClue] = useState(null);
	const [showHints, setShowHints] = useState(false);

	const handleClueClick = (clue) => {
		if (!foundClues.includes(clue.id)) {
			setFoundClues((prev) => [...prev, clue.id]);
		}
		setActiveClue(clue);
	};

	const allFound = foundClues.length === clues.length;
	const isFinished = isCompleted || allFound;

	return (
		<div className="w-full max-w-6xl mx-auto flex flex-col h-full">
			<div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
				{/* Image Area */}
				<div className="lg:col-span-2 relative">
					<div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-bg-surface-3 group">
						<img
							src={image}
							alt="Social Media Post"
							className="w-full h-auto object-cover select-none pointer-events-none"
							onClick={(e) => e.preventDefault()}
						/>

						{/* Hotspots */}
						{clues.map((clue) => {
							const isFound = foundClues.includes(clue.id);
							return (
								<motion.button
									key={clue.id}
									style={{
										top: `${clue.y}%`,
										left: `${clue.x}%`,
										width: "48px",
										height: "48px",
									}}
									className={clsx(
										"absolute -ml-6 -mt-6 rounded-full flex items-center justify-center transition-all focus:outline-none",
										isFound
											? "bg-success/20 border-2 border-success text-success z-20"
											: "z-10 cursor-pointer group hover:bg-primary/20 hover:border-2 hover:border-primary/50",
									)}
									onClick={() => handleClueClick(clue)}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}>
									{isFound ? (
										<CheckCircle size={24} className="drop-shadow-md" />
									) : (
										<>
											{/* Invisible click zone / Hover indicator */}
											<Search
												size={20}
												className="opacity-0 group-hover:opacity-100 text-primary transition-opacity duration-300 drop-shadow-md"
											/>
											{/* Hint Ring */}
											{showHints && !isFound && (
												<motion.div
													initial={{ scale: 0.8, opacity: 0 }}
													animate={{ scale: 1.2, opacity: 1 }}
													transition={{
														repeat: Infinity,
														repeatType: "reverse",
														duration: 1.5,
													}}
													className="absolute inset-0 border-2 border-dashed border-primary rounded-full"
												/>
											)}
										</>
									)}
								</motion.button>
							);
						})}
					</div>

					{/* Hint Toggle & Status */}
					<div className="mt-4 flex items-center justify-between">
						<p className="text-text-muted text-sm flex items-center gap-2">
							<Search size={16} />
							<span>
								Найди {clues.length} детали, которые выдают личную информацию ({foundClues.length}/
								{clues.length})
							</span>
						</p>
						<button
							onClick={() => setShowHints(!showHints)}
							className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface-2 border border-bg-surface-3 hover:bg-bg-surface-3 transition-colors text-sm font-medium text-text-primary">
							<Eye size={16} />
							{showHints ? "Скрыть подсказки" : "Показать подсказки"}
						</button>
					</div>
				</div>

				{/* Sidebar / Clue List */}
				<div className="bg-bg-surface-2 rounded-2xl p-6 border border-bg-surface-3 flex flex-col h-full max-h-150">
					<h3 className="text-xl font-bold mb-6 text-text-primary flex items-center justify-between shrink-0">
						<span>Улики</span>
						<span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
							{foundClues.length} / {clues.length}
						</span>
					</h3>

					<div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
						{clues.map((clue) => {
							const isFound = foundClues.includes(clue.id);
							return (
								<motion.div
									key={clue.id}
									initial={false}
									animate={{
										opacity: isFound ? 1 : 0.5,
										x: isFound ? 0 : 0,
										backgroundColor:
											activeClue?.id === clue.id
												? "rgba(var(--color-primary-rgb), 0.1)"
												: isFound
													? "rgba(var(--color-surface-1-rgb), 1)"
													: "rgba(var(--color-surface-1-rgb), 0.5)",
									}}
									className={clsx(
										"p-4 rounded-xl border transition-all cursor-default",
										activeClue?.id === clue.id
											? "border-primary shadow-sm"
											: isFound
												? "border-primary/30"
												: "border-bg-surface-3 border-dashed",
									)}>
									<div className="flex items-start gap-3">
										<div
											className={clsx(
												"mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
												isFound ? "bg-success/20 text-success" : "bg-bg-surface-3 text-text-muted",
											)}>
											{isFound ? (
												<CheckCircle size={14} />
											) : (
												<span className="text-xs font-mono">?</span>
											)}
										</div>
										<div>
											<h4
												className={clsx(
													"font-bold text-sm mb-1",
													isFound ? "text-text-primary" : "text-text-muted",
												)}>
												{isFound ? clue.label : "Скрытая улика"}
											</h4>
											{isFound && (
												<p className="text-xs text-text-secondary leading-relaxed">
													{clue.description}
												</p>
											)}
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Feedback Modal / Overlay */}
			<AnimatePresence>
				{activeClue && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-bg-surface-2 border border-primary/20 text-text-primary px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 max-w-xl w-full mx-4"
						onClick={() => setActiveClue(null)}>
						<div className="p-3 rounded-xl bg-error/10 text-error shrink-0">
							<AlertTriangle size={24} />
						</div>
						<div className="flex-1">
							<h4 className="font-bold text-sm text-error uppercase tracking-widest mb-1">
								Утечка данных!
							</h4>
							<p className="text-sm font-medium">{activeClue.feedback}</p>
						</div>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setActiveClue(null);
							}}
							className="p-2 hover:bg-bg-surface-3 rounded-full transition-colors text-text-secondary">
							<CheckCircle size={20} />
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Navigation */}
			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isFinished}
				lockedMessage="Найдите все улики"
			/>
		</div>
	);
};
