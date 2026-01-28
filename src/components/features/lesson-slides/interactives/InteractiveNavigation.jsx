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
		<div className="w-full flex justify-between items-center gap-4 mt-8">
			{canGoPrevious ? (
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onPrevious}
					className="btn-secondary flex items-center text-sm sm:text-base px-6 py-3 rounded-xl transition-colors hover:bg-bg-surface-2 text-text-secondary hover:text-text-primary">
					<ArrowLeft size={20} className="mr-2" />
					Назад
				</motion.button>
			) : (
				<div /> // Spacer to keep "Next" button on the right
			)}

			<motion.button
				whileHover={isCompleted ? { scale: 1.05 } : {}}
				whileTap={isCompleted ? { scale: 0.95 } : {}}
				onClick={isCompleted ? onNext : undefined}
				disabled={!isCompleted}
				className={clsx(
					"flex items-center justify-center text-sm sm:text-base px-8 py-3 rounded-full transition-all border-2",
					isCompleted
						? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 hover:brightness-110 cursor-pointer"
						: "bg-bg-surface-2/50 text-text-muted border-bg-surface-3 cursor-not-allowed",
				)}>
				{isCompleted ? (
					<>
						{nextLabel} <ArrowRight size={20} className="ml-2" />
					</>
				) : (
					<>
						<Lock size={16} className="mr-2" />
						{lockedMessage}
					</>
				)}
			</motion.button>
		</div>
	);
};
