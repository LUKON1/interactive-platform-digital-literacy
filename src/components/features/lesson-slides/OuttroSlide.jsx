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
		<div className="h-full flex flex-col items-center justify-center p-8 text-center">
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", damping: 12 }}
				className="w-32 h-32 rounded-full bg-success text-bg-base flex items-center justify-center mb-8 shrink-0">
				<CheckCircle size={64} />
			</motion.div>

			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="text-4xl font-bold text-text-primary mb-4">
				{slide.title}
			</motion.h1>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="text-xl text-text-secondary max-w-3xl mb-12 w-full">
				<ReactMarkdown
					components={{
						h2: ({ node, ...props }) => (
							<h2 className="text-2xl font-bold text-text-primary mb-6 text-center" {...props} />
						),
						blockquote: ({ node, ...props }) => (
							<div className="surface-card p-6 mb-4 rounded-xl border-l-4 border-primary text-left">
								<div className="prose-blockquote" {...props} />
							</div>
						),
						p: ({ node, ...props }) => (
							<p className="text-text-secondary leading-relaxed" {...props} />
						),
						strong: ({ node, ...props }) => (
							<strong className="text-text-primary font-bold" {...props} />
						),
						code: ({ node, ...props }) => (
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
				className="btn-primary flex items-center text-lg px-12 py-4 mt-12 text-text-primary! bg-transparent! border border-bg-surface-3 hover:bg-bg-surface-2!">
				<Home size={20} className="mr-2" /> Вернуться назад
			</motion.button>
		</div>
	);
};
