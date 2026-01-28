import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CheckCircle, AlertTriangle, MapPin, Briefcase, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const SocialDetective = ({ data, onComplete, onPrevious, canGoPrevious, isCompleted }) => {
	const { image, clues } = data;
	const [foundClues, setFoundClues] = useState(isCompleted ? clues.map((c) => c.id) : []);
	const [activeClue, setActiveClue] = useState(null);

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
						/>

						{/* Hotspots */}
						{clues.map((clue) => {
							const isFound = foundClues.includes(clue.id);
							return (
								<motion.button
									key={clue.id}
									style={{ top: `${clue.y}%`, left: `${clue.x}%` }}
									className={clsx(
										"absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none",
										isFound
											? "bg-success/20 border-success text-success"
											: "bg-white/10 border-white/50 text-white hover:bg-white/30 hover:scale-110",
									)}
									onClick={() => handleClueClick(clue)}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}>
									{isFound ? (
										<CheckCircle size={20} />
									) : (
										<Search size={20} className="opacity-80 drop-shadow-md" />
									)}
								</motion.button>
							);
						})}
					</div>
					<p className="mt-2 text-center text-text-muted text-sm flex items-center justify-center gap-2">
						<Search size={14} /> Найди {clues.length} детали, которые выдают личную информацию
					</p>
				</div>

				{/* Sidebar / Clue List */}
				<div className="bg-bg-surface-2 rounded-2xl p-6 border border-bg-surface-3 flex flex-col">
					<h3 className="text-xl font-bold mb-6 text-text-primary flex items-center justify-between">
						<span>Улики</span>
						<span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
							{foundClues.length} / {clues.length}
						</span>
					</h3>

					<div className="space-y-4 flex-1 overflow-y-auto pr-2">
						{clues.map((clue) => {
							const isFound = foundClues.includes(clue.id);
							return (
								<motion.div
									key={clue.id}
									initial={false}
									animate={{
										opacity: isFound ? 1 : 0.5,
										x: isFound ? 0 : 0,
									}}
									className={clsx(
										"p-4 rounded-xl border transition-colors",
										isFound
											? "bg-bg-surface-1 border-primary/30"
											: "bg-bg-surface-1/50 border-bg-surface-3 border-dashed",
									)}>
									<div className="flex items-start gap-3">
										<div
											className={clsx(
												"mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0",
												isFound ? "bg-success/20 text-success" : "bg-bg-surface-3 text-text-muted",
											)}>
											{isFound ? <CheckCircle size={14} /> : <span className="text-xs">?</span>}
										</div>
										<div>
											<h4
												className={clsx(
													"font-bold text-sm mb-1",
													isFound ? "text-text-primary" : "text-text-muted",
												)}>
												{isFound ? clue.label : "???"}
											</h4>
											{isFound && <p className="text-xs text-text-secondary">{clue.description}</p>}
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
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50 max-w-lg w-full mx-4"
						onClick={() => setActiveClue(null)}>
						<div className="p-2 rounded-full bg-error/20 text-error">
							<AlertTriangle size={24} />
						</div>
						<div className="flex-1">
							<h4 className="font-bold text-sm text-error uppercase tracking-widest mb-1">
								Утечка данных!
							</h4>
							<p className="text-sm">{activeClue.feedback}</p>
						</div>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setActiveClue(null);
							}}
							className="p-2 hover:bg-white/10 rounded-full transition-colors">
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
