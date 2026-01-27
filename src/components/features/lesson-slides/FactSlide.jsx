import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
		<div className="min-h-full flex flex-col items-center justify-center p-4 pb-6 sm:p-6 sm:pb-8 text-center max-w-3xl mx-auto">
			<div className="flex-1 flex flex-col items-center justify-center w-full">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="surface-card p-6 sm:p-8 md:p-10 border-2 border-primary/20 relative overflow-hidden w-full max-w-2xl">
					{/* Background Sparkles */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

					<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-bg-surface-3 flex items-center justify-center mx-auto text-primary mb-4 sm:mb-6">
						<Lightbulb size={24} className="sm:w-8 sm:h-8" />
					</div>

					<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4 uppercase tracking-wider">
						Интересный факт
					</h2>

					<h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-4 sm:mb-6">
						{slide.title}
					</h3>

					<div className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed">
						<ReactMarkdown
							components={{
								strong: ({ node, ...props }) => (
									<strong
										className="text-text-primary font-bold text-lg sm:text-xl md:text-2xl"
										{...props}
									/>
								), // Bigger bold for facts
								p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
							}}>
							{cleanContent}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center pt-6 sm:pt-8 gap-3 sm:gap-4">
				{canGoPrevious ? (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onPrevious}
						className="btn-secondary flex items-center text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4">
						<ArrowLeft size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5" />
						Назад
					</motion.button>
				) : (
					<div />
				)}

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onNext}
					className="btn-primary flex items-center text-sm sm:text-base md:text-lg px-6 py-3 sm:px-10 sm:py-3 md:px-12 md:py-4 shadow-lg shadow-primary/20">
					Продолжить <ArrowRight size={16} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
				</motion.button>
			</div>
		</div>
	);
};
