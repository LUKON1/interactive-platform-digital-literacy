import React from "react";
import { motion } from "motion/react";

export const Loader = ({ size = "lg", className = "" }) => {
	// Size mapping for flexibility
	const sizeClasses = {
		sm: "w-6 h-6 border-2",
		md: "w-10 h-10 border-3",
		lg: "w-16 h-16 border-4",
		xl: "w-24 h-24 border-[6px]",
	};

	return (
		<div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
			<div className="relative flex items-center justify-center">
				{/* Backing Ring */}
				<div
					className={`${sizeClasses[size] || sizeClasses.lg} rounded-full border-bg-surface-3`}
				/>

				{/* Spinning Ring */}
				<motion.div
					className={`absolute top-0 left-0 ${sizeClasses[size] || sizeClasses.lg} rounded-full border-t-primary border-r-primary border-b-transparent border-l-transparent`}
					animate={{ rotate: 360 }}
					transition={{
						duration: 1,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
			</div>

			<motion.span
				className="text-text-secondary font-medium tracking-wider text-sm"
				animate={{ opacity: [0.5, 1, 0.5] }}
				transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
				Загрузка...
			</motion.span>
		</div>
	);
};
