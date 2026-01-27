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
	let bgClass = "bg-bg-surface-2";
	let borderClass = "border-bg-surface-3";
	let iconColor = "text-text-muted";
	let shadowClass = "";

	if (isActive) {
		bgClass = "bg-primary";
		borderClass = "border-bg-base";
		iconColor = "text-on-primary";
		shadowClass = "shadow-[0_0_20px_rgba(208,188,255,0.5)] animate-pulse-slow";
	} else if (isCompleted) {
		bgClass = "bg-success";
		borderClass = "border-success";
		iconColor = "text-bg-base";
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
			</motion.button>

			{/* Static Label - positioned below circle */}
			<div
				className={`
            absolute top-full mt-2
            text-center text-xs md:text-sm font-bold 
            px-2 md:px-3 py-1 rounded-full border 
            max-w-30 md:max-w-none wrap-break-word md:whitespace-nowrap leading-tight z-20
            ${
							isActive
								? "bg-bg-surface-2 border-primary text-primary"
								: isLocked
									? "bg-bg-surface-1 border-bg-surface-3 text-text-muted"
									: "bg-bg-surface-2 border-success text-success"
						}
        `}>
				{topic.title}
			</div>
		</div>
	);
};
