import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock, Home } from "lucide-react";
import { clsx } from "clsx";

export const LessonNavigation = ({
	onPrevious,
	canGoPrevious,
	onNext,
	isCompleted = true, // Default to true for static slides
	lockedMessage = "Завершите задание",
	nextLabel = "Далее",
	nextIcon: NextIcon = ArrowRight,
	showHome = false, // Special case for Outtro
	onHome,
}) => {
	return (
		<div className="w-full flex justify-between items-center pt-8 sm:pt-10 gap-4 sm:gap-6 mt-auto max-w-4xl mx-auto">
			{/* Previous Button (or Spacer) */}
			{canGoPrevious ? (
				<motion.button
					whileHover={{ scale: 1.02, x: -3 }}
					whileTap={{ scale: 0.98 }}
					onClick={onPrevious}
					className="btn-ghost flex items-center text-sm sm:text-base font-medium text-text-muted hover:text-text-primary px-4 py-3 transition-colors motion-safe">
					<ArrowLeft size={18} className="mr-2" />
					Назад
				</motion.button>
			) : (
				<div className="w-24" /> // Spacer to keep Next button aligned if Back is missing but layout demands it? Or just div?
				// Actually flex justify-between handles right alignment if this is empty/div.
				// But if we want Next to be always on right, a spacer helps if we didn't use justify-between.
				// With justify-between, an empty div is fine.
			)}

			<div />

			{/* Next / Home Button */}
			{showHome ? (
				<motion.button
					whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
					whileTap={{ scale: 0.95 }}
					onClick={onHome}
					className="btn-primary flex items-center text-base sm:text-lg font-bold px-8 py-4 sm:px-10 sm:py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 motion-safe">
					<Home className="w-5 h-5 mr-2" /> Вернуться к списку
				</motion.button>
			) : (
				<motion.button
					whileHover={
						isCompleted ? { scale: 1.05, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" } : {}
					}
					whileTap={isCompleted ? { scale: 0.95 } : {}}
					onClick={isCompleted ? onNext : undefined}
					disabled={!isCompleted}
					className={clsx(
						"flex items-center text-sm sm:text-base md:text-lg font-bold px-6 py-3 sm:px-10 sm:py-4 rounded-xl shadow-lg transition-all motion-safe",
						isCompleted
							? "btn-primary shadow-primary/20 cursor-pointer"
							: "bg-bg-surface-3 text-text-muted cursor-not-allowed shadow-none",
					)}>
					{isCompleted ? (
						<>
							{nextLabel} <NextIcon size={18} className="ml-2" />
						</>
					) : (
						<>
							<Lock size={18} className="mr-2 opacity-50" />
							<span className="opacity-75">{lockedMessage}</span>
						</>
					)}
				</motion.button>
			)}
		</div>
	);
};
