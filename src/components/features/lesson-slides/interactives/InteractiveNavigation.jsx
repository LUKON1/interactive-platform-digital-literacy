import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { clsx } from "clsx";

export const InteractiveNavigation = ({
	onPrevious,
	canGoPrevious,
	onNext,
	isCompleted,
	lockedMessage = "Завершите задание",
	nextLabel = "Далее",
}) => {
	return (
		<div className="w-full flex justify-between items-center pt-6 sm:pt-8 gap-3 sm:gap-4 mt-auto border-t border-bg-surface-3/50 backdrop-blur-sm">
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
				<div />
			)}

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
						{nextLabel} <ArrowRight size={18} className="ml-2" />
					</>
				) : (
					<>
						<Lock size={18} className="mr-2 opacity-50" />
						<span className="opacity-75">{lockedMessage}</span>
					</>
				)}
			</motion.button>
		</div>
	);
};
