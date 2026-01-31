import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Home, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export const OuttroSlide = ({ slide, lessonId, topicId, onComplete }) => {
	const navigate = useNavigate();

	React.useEffect(() => {
		onComplete();
	}, []);

	const cleanContent = slide.content || "";

	return (
		<div className="min-h-full flex flex-col items-center justify-center p-4 pb-6 sm:p-6 sm:pb-8 md:p-8 md:pb-10 text-center max-w-4xl mx-auto w-full relative z-10">
			{/* Confetti Background Effect (Simulated with gradients) */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl radial-progress opacity-20 pointer-events-none -z-10" />

			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", damping: 12, stiffness: 200 }}
				className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-success text-bg-base flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-success/30 motion-safe relative">
				<div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse" />
				<CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 drop-shadow-md" />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="space-y-2 mb-8 sm:mb-10 text-center w-full motion-safe">
				<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-bold uppercase tracking-wider mb-2">
					<Award size={16} /> Урок пройден
				</div>
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary leading-tight">
					{slide.title}
				</h1>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="surface-card p-6 sm:p-8 md:p-10 text-base sm:text-lg text-text-secondary leading-relaxed w-full shadow-xl border border-bg-surface-3 relative overflow-hidden motion-safe">
				<ReactMarkdown
					components={{
						h2: ({ ...props }) => (
							<h3
								className="text-xl sm:text-2xl font-bold text-text-primary mb-6 text-center border-b border-bg-surface-3 pb-4"
								{...props}
							/>
						),
						blockquote: ({ ...props }) => (
							<div className="grid gap-4 text-left">
								{/* We'll style blockquotes as a list of key takeaways */}
								{props.children}
							</div>
						),
						p: ({ ...props }) => {
							// Check if paragraph is inside blockquote (simplified check via context or content)
							// For now, standard p styling
							return <p className="mb-4 last:mb-0 text-text-primary/90" {...props} />;
						},
						// Assuming the content uses blockquotes > for list items as per existing data structure
						// But standard markdown might be better. We will adapt content in lessons.js to use clearer lists or keep > indent
					}}>
					{cleanContent}
				</ReactMarkdown>
			</motion.div>

			<motion.button
				whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
				whileTap={{ scale: 0.95 }}
				onClick={() => navigate(`/topic/${topicId}`)}
				className="btn-primary flex items-center text-base sm:text-lg font-bold px-8 py-4 sm:px-10 sm:py-5 mt-8 sm:mt-10 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 motion-safe">
				<Home className="w-5 h-5 mr-2" /> Вернуться к списку
			</motion.button>
		</div>
	);
};
