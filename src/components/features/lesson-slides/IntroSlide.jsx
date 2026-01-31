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
									<strong className="text-text-primary font-bold text-primary" {...props} />
								),
								p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
							}}>
							{cleanContent}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center pt-8 sm:pt-10 gap-4 sm:gap-6 border-t border-bg-surface-3/50 mt-4">
				<motion.button
					whileHover={{ scale: 1.02, x: -3 }}
					whileTap={{ scale: 0.98 }}
					onClick={canGoPrevious ? onPrevious : onClose}
					className="btn-ghost flex items-center text-sm sm:text-base font-medium text-text-muted hover:text-text-primary px-4 py-3 transition-colors motion-safe">
					<ArrowLeft size={18} className="mr-2" />
					{canGoPrevious ? "Назад" : "Выход"}
				</motion.button>

				<motion.button
					whileHover={{
						scale: 1.05,
						boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
					}}
					whileTap={{ scale: 0.95 }}
					onClick={onNext}
					className="group relative btn-primary flex items-center text-base sm:text-lg md:text-xl font-bold px-8 py-4 sm:px-10 sm:py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all overflow-hidden motion-safe">
					<span className="relative z-10 flex items-center">
						Поехали!{" "}
						<ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
					</span>
					<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
				</motion.button>
			</div>
		</div>
	);
};
