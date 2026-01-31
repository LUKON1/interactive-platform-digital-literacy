import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Lightbulb, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { LessonNavigation } from "./LessonNavigation";

export const FactSlide = ({ slide, onNext, onPrevious, canGoPrevious }) => {
	// Utility to remove common indent ation/newlines to fix markdown rendering
	const cleanContent = slide.content
		? slide.content
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l)
				.join("\n\n")
		: "";

	return (
		<div className="min-h-full flex flex-col items-center justify-center p-4 pb-6 sm:p-6 sm:pb-8 text-center max-w-4xl mx-auto w-full">
			<div className="flex-1 flex flex-col items-center justify-center w-full">
				<motion.div
					initial={{ scale: 0.9, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					transition={{ type: "spring", stiffness: 260, damping: 20 }}
					className="surface-card p-6 sm:p-10 md:p-12 border-2 border-warning/20 bg-warning/5 relative overflow-hidden w-full max-w-3xl motion-safe">
					{/* Background Sparkles */}
					<div className="absolute top-0 right-0 w-80 h-80 bg-warning/20 opacity-30 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
					<div className="absolute bottom-0 left-0 w-60 h-60 bg-warning/10 opacity-30 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

					<motion.div
						animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
						transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
						className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-warning to-orange-500 flex items-center justify-center mx-auto text-white mb-6 sm:mb-8 shadow-lg shadow-warning/30 motion-safe">
						<Lightbulb size={32} className="sm:w-10 sm:h-10 fill-current" />
					</motion.div>

					<h2 className="text-sm sm:text-base font-bold text-warning uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
						<Zap size={14} /> Интересный факт
					</h2>

					<h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary mb-6 sm:mb-8 leading-tight">
						{slide.title}
					</h3>

					<div className="text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
						<ReactMarkdown
							components={{
								strong: ({ node, ...props }) => (
									<strong
										className="text-text-primary font-black bg-warning/10 px-1 rounded"
										{...props}
									/>
								),
								p: ({ node, ...props }) => <p className="mb-6 last:mb-0" {...props} />,
							}}>
							{cleanContent}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>

			{/* Navigation Buttons */}
			<LessonNavigation
				onPrevious={onPrevious}
				onNext={onNext}
				canGoPrevious={canGoPrevious}
				nextLabel="Продолжить"
				isCompleted={true}
			/>
		</div>
	);
};
