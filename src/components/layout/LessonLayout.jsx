import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LessonLayout = ({ children, title, progress, onClose }) => {
	return (
		<div className="fixed inset-0 bg-bg-base flex flex-col z-50">
			{/* Header */}
			<header className="h-16 px-6 flex items-center justify-between border-b border-bg-surface-3 bg-bg-surface-1">
				<div className="flex items-center gap-4">
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-bg-surface-2 text-text-secondary transition-colors">
						<X size={24} />
					</button>
					<h2 className="text-lg font-medium text-text-primary hidden sm:block">{title}</h2>
				</div>
				{/* Progress Bar */}
				<div className="flex-1 max-w-md mx-6 h-2 bg-bg-surface-3 rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-primary motion-safe"
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
					/>
				</div>
				<div className="w-8" /> {/* Spacer for balance */}
			</header>

			{/* Main Content Area */}
			<main className="flex-1 overflow-y-auto overflow-x-hidden relative">{children}</main>
		</div>
	);
};
