import ReactMarkdown from "react-markdown";

export const OuttroSlide = ({ slide, lessonId, topicId, onComplete }) => {
	const navigate = useNavigate();

	React.useEffect(() => {
		onComplete();
	}, []);

	const cleanContent = slide.content
		? slide.content
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l)
				.join("\n\n")
		: "";

	return (
		<div className="h-full flex flex-col items-center justify-center p-8 text-center">
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", damping: 12 }}
				className="w-32 h-32 rounded-full bg-[var(--color-success)] text-[var(--color-bg-base)] flex items-center justify-center mb-8">
				<CheckCircle size={64} />
			</motion.div>

			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
				{slide.title}
			</motion.h1>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="text-xl text-[var(--color-text-secondary)] max-w-lg mb-12">
				<ReactMarkdown
					components={{
						strong: ({ node, ...props }) => (
							<strong className="text-[var(--color-text-primary)] font-bold" {...props} />
						),
					}}>
					{cleanContent}
				</ReactMarkdown>
			</motion.div>

			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => navigate(`/topic/${topicId}`)}
				className="btn-primary flex items-center px-8 py-3 bg-[var(--color-bg-surface-2)] !text-[var(--color-text-primary)] !bg-transparent border border-[var(--color-bg-surface-3)] hover:!bg-[var(--color-bg-surface-2)]">
				<Home size={20} className="mr-2" /> Вернуться назад
			</motion.button>
		</div>
	);
};
