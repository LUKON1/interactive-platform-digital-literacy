import React from "react";
import { motion } from "motion/react";
import { Lock, Star, Check } from "lucide-react";
import * as Icons from "lucide-react";

export const SkillNode = ({ topic, status, onClick, position, progress }) => {
	// status: 'locked' | 'active' | 'completed'
	const isLocked = status === "locked";
	const isActive = status === "active";
	const isCompleted = status === "completed";

	const IconComponent = Icons[topic.icon] || Star;

	// Determine styles based on status
	let bgClass = "bg-[var(--color-bg-surface-2)]";
	let borderClass = "border-[var(--color-bg-surface-3)]";
	let iconColor = "text-[var(--color-text-muted)]";
	let shadowClass = "";

	if (isActive) {
		bgClass = "bg-[var(--color-primary)]";
		borderClass = "border-[var(--color-bg-base)]";
		iconColor = "text-[var(--color-on-primary)]";
		shadowClass = "shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)] animate-pulse-slow";
	} else if (isCompleted) {
		bgClass = "bg-[var(--color-success)]";
		borderClass = "border-[var(--color-bg-base)]";
		iconColor = "textwhite";
	}

	return (
		<div className={`relative flex flex-col items-center z-10 ${position}`}>
			<motion.button
				whileHover={!isLocked ? { scale: 1.1 } : {}}
				whileTap={!isLocked ? { scale: 0.95 } : {}}
				onClick={onClick}
				disabled={isLocked}
				className={`
            w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300
            ${bgClass} ${borderClass} ${shadowClass}
            ${isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
        `}>
				{isLocked ? (
					<Lock size={32} className={iconColor} />
				) : isCompleted ? (
					<Check size={40} className={iconColor} strokeWidth={3} />
				) : (
					<IconComponent size={40} className={iconColor} />
				)}

				{/* Floating Label */}
				<div
					className={`
            absolute -bottom-10 whitespace-nowrap font-bold text-sm px-3 py-1 rounded-full border 
            ${
							isActive
								? "bg-[var(--color-bg-surface-2)] border-[var(--color-primary)] text-[var(--color-primary)]"
								: isLocked
									? "bg-[var(--color-bg-surface-1)] border-[var(--color-bg-surface-3)] text-[var(--color-text-muted)]"
									: "bg-[var(--color-bg-surface-2)] border-[var(--color-success)] text-[var(--color-success)]"
						}
        `}>
					{topic.title}
					{/* Actually, let's just use the props correctly. I need to update the component signature first or just use props.progress if available. */}
				</div>
			</motion.button>
		</div>
	);
};
