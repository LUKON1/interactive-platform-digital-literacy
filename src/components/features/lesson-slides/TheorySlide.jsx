import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Info, ChevronRight, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const TheorySlide = ({ slide, onNext, onPrevious, canGoPrevious }) => {
	// Utility to remove common indentation from template literals
	const cleanContent = slide.content
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line !== "")
		.join("\n\n");

	return (
		<div className="min-h-full flex flex-col p-4 pb-6 sm:p-6 sm:pb-8 md:p-8 md:pb-10 max-w-5xl mx-auto w-full">
			{/* Header */}
			<motion.div
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 motion-safe">
				<div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
					<BookOpen size={24} className="sm:w-8 sm:h-8" />
				</div>
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-tight">
					{slide.title}
				</h2>
			</motion.div>

			{/* Content Card */}
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="flex-1 surface-card p-5 sm:p-8 md:p-10 text-base sm:text-lg text-text-secondary leading-relaxed sm:leading-loose text-left shadow-lg border border-bg-surface-3 relative overflow-hidden motion-safe">
				{/* Decorative decorative gradient */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

				<ReactMarkdown
					components={{
						p: ({ node, ...props }) => (
							<p className="mb-5 last:mb-0 text-text-primary/90" {...props} />
						),
						strong: ({ node, ...props }) => (
							<strong className="text-text-primary font-bold text-lg" {...props} />
						),
						ul: ({ node, ...props }) => <ul className="space-y-3 mb-6" {...props} />,
						ol: ({ node, ...props }) => (
							<ol
								className="space-y-3 mb-6 list-decimal pl-5 marker:text-primary marker:font-bold"
								{...props}
							/>
						),
						li: ({ node, children, ...props }) => (
							<li className="flex items-start gap-2" {...props}>
								<ChevronRight className="shrink-0 w-5 h-5 text-primary mt-1" />
								<span>{children}</span>
							</li>
						),
						h1: ({ node, ...props }) => (
							<h3
								className="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4 border-b border-bg-surface-3 pb-2"
								{...props}
							/>
						),
						h2: ({ node, ...props }) => (
							<h4
								className="text-lg sm:text-xl font-bold text-text-primary mt-6 mb-3 flex items-center gap-2"
								{...props}
							/>
						),
						code: ({ inline, node, ...props }) => {
							if (inline) {
								return (
									<code
										className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm sm:text-base font-mono font-medium border border-primary/20"
										{...props}
									/>
								);
							}
							return (
								<code
									className="block bg-bg-base/50 p-4 rounded-lg text-sm font-mono text-text-secondary border border-bg-surface-3 my-4 overflow-x-auto"
									{...props}
								/>
							);
						},
						blockquote: ({ node, children }) => (
							<div className="p-4 sm:p-5 my-6 border-l-4 rounded-r-xl bg-info/5 border-info flex items-start gap-4">
								<Info className="shrink-0 mt-0.5 text-info" size={24} />
								<div className="text-text-primary text-base italic">{children}</div>
							</div>
						),
						hr: () => (
							<div className="my-8">
								<div className="h-px bg-linear-to-r from-transparent via-bg-surface-3 to-transparent" />
							</div>
						),
					}}>
					{cleanContent}
				</ReactMarkdown>
			</motion.div>

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center pt-6 sm:pt-8 gap-3 sm:gap-4 mt-auto">
				{canGoPrevious ? (
					<motion.button
						whileHover={{ scale: 1.02, x: -3 }}
						whileTap={{ scale: 0.98 }}
						onClick={onPrevious}
						className="btn-ghost flex items-center text-sm sm:text-base font-medium text-text-muted hover:text-text-primary px-4 py-3 transition-colors motion-safe">
						<ArrowLeft size={18} className="mr-2" />
						Назад
					</motion.button>
				) : (
					<div />
				)}

				<motion.button
					whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
					whileTap={{ scale: 0.95 }}
					onClick={onNext}
					className="btn-primary flex items-center text-sm sm:text-base md:text-lg font-bold px-6 py-3 sm:px-10 sm:py-4 rounded-xl shadow-lg shadow-primary/20 motion-safe">
					Далее <ArrowRight size={18} className="ml-2" />
				</motion.button>
			</div>
		</div>
	);
};
