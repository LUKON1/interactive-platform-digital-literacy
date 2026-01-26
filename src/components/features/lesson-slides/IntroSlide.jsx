import ReactMarkdown from "react-markdown";

export const IntroSlide = ({ slide, onNext }) => {
	const cleanContent = slide.content
		? slide.content
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l)
				.join("\n\n")
		: "";

	return (
		<div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="mb-8">
				<div className="w-24 h-24 rounded-full bg-[var(--color-bg-surface-2)] flex items-center justify-center mx-auto text-[var(--color-primary)] mb-6">
					<span className="text-4xl">👋</span>
				</div>
				<h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
					{slide.title}
				</h1>
				<div className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
					<ReactMarkdown
						components={{
							strong: ({ node, ...props }) => (
								<strong className="text-[var(--color-text-primary)] font-bold" {...props} />
							),
						}}>
						{cleanContent}
					</ReactMarkdown>
				</div>
			</motion.div>

			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={onNext}
				className="btn-primary flex items-center text-lg px-8 py-4 mt-8">
				Поехали! <ArrowRight className="ml-2" />
			</motion.button>
		</div>
	);
};
