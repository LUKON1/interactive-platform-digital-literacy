import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { LessonNavigation } from "./LessonNavigation";

export const IntroSlide = ({ slide, onNext, onPrevious, onClose, canGoPrevious }) => {
	const cleanContent = slide.content
		? slide.content
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l)
				.join("\n\n")
		: "";

	return (
		<div className="min-h-full flex flex-col items-center justify-center p-4 pb-6 sm:p-6 sm:pb-8 md:p-8 md:pb-10 text-center max-w-3xl mx-auto relative z-10">
			{/* Background Glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

			<div className="flex-1 flex flex-col items-center justify-center w-full">
				<motion.div
					initial={{ scale: 0.8, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="mb-8 sm:mb-10 w-full motion-safe">
					<motion.div
						animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
						transition={{
							duration: 4,
							ease: "easeInOut",
							repeat: Infinity,
							repeatType: "reverse",
						}}
						className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl bg-linear-to-br from-bg-surface-2 to-bg-surface-1 shadow-xl shadow-primary/10 border border-bg-surface-3 flex items-center justify-center mx-auto text-primary mb-6 sm:mb-8 motion-safe">
						<span className="text-5xl sm:text-6xl md:text-7xl filter drop-shadow-lg">👋</span>
					</motion.div>

					<h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-primary mb-6 sm:mb-8 leading-tight tracking-tight drop-shadow-sm">
						{slide.title}
					</h1>

					<div className="text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
						<ReactMarkdown
							components={{
								strong: ({ node, ...props }) => (
									<strong className=" font-bold text-primary" {...props} />
								),
								p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
							}}>
							{cleanContent}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>

			{/* Navigation Buttons */}
			<LessonNavigation
				onPrevious={onClose}
				onNext={onNext}
				canGoPrevious={true}
				nextLabel="Поехали!"
				nextIcon={ArrowRight}
				isCompleted={true}
			/>
		</div>
	);
};
