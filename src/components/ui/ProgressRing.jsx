import React from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";

export const ProgressRing = ({
	progress = 0,
	size = 60,
	strokeWidth = 6,
	color = "text-[var(--color-primary)]",
}) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<div
			className="relative flex items-center justify-center"
			style={{ width: size, height: size }}>
			{/* Background Circle */}
			<svg className="absolute w-full h-full -rotate-90">
				<circle
					className="text-[var(--color-bg-surface-3)]"
					strokeWidth={strokeWidth}
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx={size / 2}
					cy={size / 2}
				/>
				{/* Progress Circle */}
				<motion.circle
					className={clsx("transition-colors duration-500", color)}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx={size / 2}
					cy={size / 2}
					initial={{ strokeDashoffset: circumference }}
					animate={{ strokeDashoffset: offset }}
					transition={{ duration: 1, ease: "easeOut" }}
				/>
			</svg>
			{/* Percentage Text */}
			<span className="absolute text-sm font-bold text-[var(--color-text-secondary)]">
				{Math.round(progress)}%
			</span>
		</div>
	);
};
