import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export const OuttroSlide = ({ slide, lessonId, topicId, onComplete }) => {
	const navigate = useNavigate();

	React.useEffect(() => {
		onComplete();
	}, []);

	const cleanContent = slide.content || "";

	return (
		<div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center py-8 sm:py-12">
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", damping: 12 }}
				className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-success text-bg-base flex items-center justify-center mb-4 sm:mb-6 md:mb-8 shrink-0 motion-safe">
				<CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
			</motion.div>

			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 sm:mb-4 px-2 motion-safe">
				{slide.title}
			</motion.h1>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mb-6 sm:mb-8 md:mb-12 w-full px-2 motion-safe">
				<ReactMarkdown
					components={{
						h2: ({ ...props }) => (
							<h2 className="text-2xl font-bold text-text-primary mb-6 text-center" {...props} />
						),
						blockquote: ({ ...props }) => (
							<div className="surface-card p-6 mb-4 rounded-xl border-l-4 border-primary text-left">
								<div className="prose-blockquote" {...props} />
							</div>
						),
						p: ({ ...props }) => <p className="text-text-secondary leading-relaxed" {...props} />,
						strong: ({ ...props }) => <strong className="text-text-primary font-bold" {...props} />,
						code: ({ ...props }) => (
							<code
								className="px-2 py-1 bg-bg-surface-3 rounded text-primary font-mono text-sm"
								{...props}
							/>
						),
						hr: () => (
							<hr className="my-8 border-0 h-px bg-linear-to-r from-transparent via-bg-surface-3 to-transparent opacity-50" />
						),
					}}>
					{cleanContent}
				</ReactMarkdown>
			</motion.div>

			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => navigate(`/topic/${topicId}`)}
				className="btn-primary flex items-center text-base sm:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 mt-6 sm:mt-8 md:mt-12 text-text-primary! bg-transparent! border border-bg-surface-3 hover:bg-bg-surface-2! mb-4 sm:mb-0">
				<Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Вернуться назад
			</motion.button>
		</div>
	);
};
