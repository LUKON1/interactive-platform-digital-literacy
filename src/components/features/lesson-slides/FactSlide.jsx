import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const FactSlide = ({ slide, onNext }) => {
	// Utility to remove common indentation/newlines to fix markdown rendering
	const cleanContent = slide.content
		? slide.content
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l)
				.join("\n\n")
		: "";

	return (
		<div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
			<div className="flex-1 flex flex-col items-center justify-center w-full">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="surface-card p-10 border-2 border-[var(--color-primary)]/20 relative overflow-hidden w-full max-w-2xl">
					{/* Background Sparkles */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

					<div className="w-16 h-16 rounded-full bg-[var(--color-bg-surface-3)] flex items-center justify-center mx-auto text-[var(--color-primary)] mb-6">
						<Lightbulb size={32} />
					</div>

					<h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4 uppercase tracking-wider">
						Интересный факт
					</h2>

					<h3 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
						{slide.title}
					</h3>

					<div className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
						<ReactMarkdown
							components={{
								strong: ({ node, ...props }) => (
									<strong
										className="text-[var(--color-text-primary)] font-bold text-2xl"
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

			<div className="w-full flex justify-center mt-8">
				<motion.button
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 }} // Force user to read a bit
					onClick={onNext}
					className="btn-primary flex items-center text-lg px-12 py-4 shadow-lg shadow-primary/20">
					Продолжить <ArrowRight size={20} className="ml-2" />
				</motion.button>
			</div>
		</div>
	);
};
