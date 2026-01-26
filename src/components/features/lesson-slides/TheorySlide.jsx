import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const TheorySlide = ({ slide, onNext }) => {
	// Utility to remove common indentation from template literals
	const cleanContent = slide.content
		.split("\n")
		.map((line) => line.trim()) // Trim simple indentation.
		// Note: This flattens nested lists (e.g. "  - item" becomes "- item").
		// For simple content this is perfect and fixes the "Code Block" issue.
		.filter((line) => line !== "") // Remove empty lines to avoid huge gaps
		.join("\n\n"); // Re-join with double newlines to ensure paragraphs/lists separate correctly

	return (
		<div className="h-full flex flex-col p-6 md:p-12 max-w-4xl mx-auto">
			<motion.h2
				initial={{ x: -20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">
				{slide.title}
			</motion.h2>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="surface-card p-8 text-lg text-[var(--color-text-secondary)] leading-loose">
				<ReactMarkdown
					components={{
						p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
						strong: ({ node, ...props }) => (
							<strong className="text-[var(--color-text-primary)] font-bold" {...props} />
						),
						ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,
						ol: ({ node, ...props }) => (
							<ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />
						),
						li: ({ node, ...props }) => <li className="pl-1" {...props} />,
						h1: ({ node, ...props }) => (
							<h3
								className="text-xl font-bold text-[var(--color-text-primary)] mt-4 mb-2"
								{...props}
							/>
						),
						h2: ({ node, ...props }) => (
							<h4
								className="text-lg font-bold text-[var(--color-text-primary)] mt-4 mb-2"
								{...props}
							/>
						),
						code: ({ node, ...props }) => (
							<code
								className="bg-[var(--color-bg-base)] px-2 py-1 rounded text-sm font-mono text-[var(--color-primary)]"
								{...props}
							/>
						),
					}}>
					{cleanContent}
				</ReactMarkdown>
			</motion.div>

			<div className="mt-auto flex justify-end pt-8">
				<button onClick={onNext} className="btn-primary flex items-center">
					Далее <ArrowRight size={20} className="ml-2" />
				</button>
			</div>
		</div>
	);
};
