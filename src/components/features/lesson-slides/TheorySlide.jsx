import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const TheorySlide = ({ slide, onNext, onPrevious, canGoPrevious }) => {
	// Utility to remove common indentation from template literals
	const cleanContent = slide.content
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line !== "")
		.join("\n\n");

	return (
		<div className="min-h-full flex flex-col p-4 pb-6 sm:p-6 sm:pb-8 md:p-12 md:pb-12 max-w-4xl mx-auto">
			<motion.h2
				initial={{ x: -20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 sm:mb-6 md:mb-8">
				{slide.title}
			</motion.h2>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="surface-card p-4 sm:p-6 md:p-8 text-base sm:text-lg text-text-secondary leading-relaxed sm:leading-loose text-left flex-1">
				<ReactMarkdown
					components={{
						p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
						strong: ({ node, ...props }) => (
							<strong className="text-text-primary font-bold" {...props} />
						),
						ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,
						ol: ({ node, ...props }) => (
							<ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />
						),
						li: ({ node, ...props }) => <li className="pl-1" {...props} />,
						h1: ({ node, ...props }) => (
							<h3 className="text-xl font-bold text-text-primary mt-4 mb-2" {...props} />
						),
						h2: ({ node, ...props }) => (
							<h4 className="text-lg font-bold text-text-primary mt-4 mb-2" {...props} />
						),
						code: ({ inline, node, ...props }) => {
							if (inline) {
								return (
									<code
										className="bg-primary/20 text-primary px-2 py-0.5 rounded text-sm font-mono"
										{...props}
									/>
								);
							}
							return (
								<code
									className="bg-bg-base px-2 py-1 rounded text-sm font-mono text-primary"
									{...props}
								/>
							);
						},
						blockquote: ({ node, children }) => (
							<div className="p-4 my-4 border-l-4 rounded-r bg-blue-500/10 border-blue-500 flex items-start gap-3">
								<Info className="shrink-0 mt-0.5 text-blue-400" size={22} />
								<div className="text-blue-200 text-sm leading-relaxed">{children}</div>
							</div>
						),
						hr: () => (
							<div className="my-6">
								<div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
							</div>
						),
					}}>
					{cleanContent}
				</ReactMarkdown>
			</motion.div>

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
					Далее <ArrowRight size={16} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
				</motion.button>
			</div>
		</div>
	);
};
