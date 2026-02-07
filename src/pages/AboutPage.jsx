import React from "react";
import ReactMarkdown from "react-markdown";
import { CyberGridBackground } from "../components/ui/CyberGridBackground";
import { motion } from "motion/react";
import readmeContent from "../../README.md?raw";
import { BookOpen, Star, GitFork } from "lucide-react";

export const AboutPage = () => {
	return (
		<div className="min-h-screen relative pt-24 pb-12 font-sans">
			<CyberGridBackground />

			<div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
					{/* GitHub-like Header */}
					<div className="bg-[#161b22] border-b border-[#30363d] p-4 flex items-center justify-between sticky top-0 z-20">
						<div className="flex items-center gap-2 text-[#c9d1d9] font-medium">
							<BookOpen size={16} className="text-[#8b949e]" />
							<span>README.md</span>
						</div>
					</div>

					{/* Markdown Content */}
					<div className="p-8 md:p-12 text-[#c9d1d9] leading-relaxed">
						<ReactMarkdown
							components={{
								h1: ({ ...props }) => (
									<h1
										className="text-3xl font-semibold text-white border-b border-[#21262d] pb-2 mb-6 mt-8 first:mt-0"
										{...props}
									/>
								),
								h2: ({ ...props }) => (
									<h2
										className="text-2xl font-semibold text-white border-b border-[#21262d] pb-2 mb-4 mt-8"
										{...props}
									/>
								),
								h3: ({ ...props }) => (
									<h3 className="text-xl font-semibold text-white mb-3 mt-6" {...props} />
								),
								p: ({ ...props }) => <p className="mb-4 leading-7" {...props} />,
								ul: ({ ...props }) => (
									<ul className="list-disc list-outside ml-6 mb-4 space-y-1" {...props} />
								),
								ol: ({ ...props }) => (
									<ol className="list-decimal list-outside ml-6 mb-4 space-y-1" {...props} />
								),
								li: ({ ...props }) => <li className="" {...props} />,
								a: ({ ...props }) => (
									<a className="text-[#58a6ff] hover:underline decoration-1" {...props} />
								),
								blockquote: ({ ...props }) => (
									<blockquote
										className="border-l-4 border-[#30363d] pl-4 text-[#8b949e] italic mb-4"
										{...props}
									/>
								),
								code: ({ inline, className, children, ...props }) => {
									return !inline ? (
										<div className="bg-[#161b22] rounded-md overflow-hidden border border-[#30363d] mb-4">
											<pre className="p-4 overflow-x-auto text-sm leading-6">
												<code className={className} {...props}>
													{children}
												</code>
											</pre>
										</div>
									) : (
										<code
											className="bg-[#6e768166] px-1.5 py-0.5 rounded-md text-sm font-mono"
											{...props}>
											{children}
										</code>
									);
								},
								img: ({ ...props }) => (
									<img
										className="rounded-lg border border-transparent max-w-full h-auto mb-4"
										{...props}
									/>
								),
								table: ({ ...props }) => (
									<div className="overflow-x-auto mb-4 border border-[#30363d] rounded-md">
										<table className="w-full text-left border-collapse" {...props} />
									</div>
								),
								thead: ({ ...props }) => (
									<thead className="bg-[#161b22] border-b border-[#30363d]" {...props} />
								),
								tbody: ({ ...props }) => <tbody className="divide-y divide-[#30363d]" {...props} />,
								tr: ({ ...props }) => <tr className="hover:bg-[#161b22]/50" {...props} />,
								th: ({ ...props }) => (
									<th
										className="p-3 font-semibold text-white border-r border-[#30363d] last:border-r-0"
										{...props}
									/>
								),
								td: ({ ...props }) => (
									<td className="p-3 border-r border-[#30363d] last:border-r-0" {...props} />
								),
							}}>
							{readmeContent}
						</ReactMarkdown>
					</div>
				</motion.div>
			</div>
		</div>
	);
};
