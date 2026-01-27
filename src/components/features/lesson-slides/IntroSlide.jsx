import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const IntroSlide = ({ slide, onNext, onPrevious, onClose, canGoPrevious }) => {
	const cleanContent = slide.content
		? slide.content
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l)
				.join("\n\n")
		: "";

	return (
		<div className="min-h-full flex flex-col items-center justify-center p-4 pb-6 sm:p-6 sm:pb-8 md:p-8 md:pb-10 text-center max-w-2xl mx-auto">
			<div className="flex-1 flex flex-col items-center justify-center">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="mb-6 sm:mb-8">
					<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto text-primary mb-4 sm:mb-6">
						<span className="text-3xl sm:text-4xl">👋</span>
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight">
						{slide.title}
					</h1>
					<div className="text-lg sm:text-xl text-text-secondary leading-relaxed">
						<ReactMarkdown
							components={{
								strong: ({ node, ...props }) => (
									<strong className="text-text-primary font-bold" {...props} />
								),
							}}>
							{cleanContent}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center pt-6 sm:pt-8 gap-3 sm:gap-4">
				{/* Exit button - always visible on intro slide */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={canGoPrevious ? onPrevious : onClose}
					className="btn-secondary flex items-center text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4">
					<ArrowLeft size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5" />
					Выход
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onNext}
					className="btn-primary flex items-center text-sm sm:text-base md:text-lg px-6 py-3 sm:px-10 sm:py-3 md:px-12 md:py-4 shadow-lg shadow-primary/20">
					Поехали! <ArrowRight size={16} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
				</motion.button>
			</div>
		</div>
	);
};
