import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Play, Lock, CheckCircle } from "lucide-react";
import { TOPICS } from "../data/topics";
import { LESSONS } from "../data/lessons";
import { useProgressStore } from "../store/useProgressStore";

export const TopicPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const themeTopic = TOPICS.find((t) => t.id === id);
	const lessons = LESSONS[id] || [];
	const completedLessons = useProgressStore((state) => state.completedLessons);

	if (!themeTopic) return <div>Topic not found</div>;

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
			<button
				onClick={() => navigate("/")}
				className="mb-8 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
				<ArrowLeft size={20} className="mr-2" /> Назад в Хаб
			</button>

			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				<div className="flex items-center gap-4 mb-6">
					<div className="p-4 rounded-3xl bg-[var(--color-bg-surface-2)] text-[var(--color-primary)] inline-block">
						{/* Dynamic Icon render could be improved here, currently just text/placeholder if strictly needed */}
						<span className="font-bold text-2xl">#</span>
					</div>
					<div>
						<h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
							{themeTopic.title}
						</h1>
						<p className="text-[var(--color-text-secondary)] mt-1">{themeTopic.description}</p>
					</div>
				</div>

				<div className="grid gap-4 mt-10">
					{lessons.map((lesson, index) => {
						const isCompleted = completedLessons.includes(lesson.id);
						const isLocked =
							index > 0 &&
							!completedLessons.includes(lessons[index - 1].id) &&
							!lessons[index - 1].id.includes("intro"); // Simple lock logic
						// For demo purposes, let's unlock everything or just first.
						// Better logic: unlocked if previous completed OR it's the first one.
						const actuallyLocked = index > 0 && !completedLessons.includes(lessons[index - 1].id);

						return (
							<motion.div
								key={lesson.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								onClick={() => !actuallyLocked && navigate(`/topic/${id}/lesson/${lesson.id}`)}
								className={`
                  p-6 rounded-[24px] border flex items-center justify-between group transition-all
                  ${
										actuallyLocked
											? "border-[var(--color-bg-surface-3)] bg-[var(--color-bg-surface-1)] opacity-60 cursor-not-allowed"
											: "border-white/5 bg-[var(--color-bg-surface-2)] hover:bg-[var(--color-bg-surface-3)] cursor-pointer hover:scale-[1.01]"
									}
                `}>
								<div className="flex items-center gap-6">
									<div
										className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                    ${
											isCompleted
												? "bg-[var(--color-success)] text-[var(--color-bg-base)]"
												: actuallyLocked
													? "bg-[var(--color-bg-surface-3)] text-[var(--color-text-muted)]"
													: "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
										}
                  `}>
										{isCompleted ? <CheckCircle size={24} /> : index + 1}
									</div>
									<div>
										<h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
											{lesson.title}
										</h3>
										<p className="text-[var(--color-text-secondary)] text-sm mt-1">
											{lesson.duration} • {lesson.description}
										</p>
									</div>
								</div>

								<div className="pr-4">
									{actuallyLocked ? (
										<Lock size={24} className="text-[var(--color-text-muted)]" />
									) : (
										<div className="w-10 h-10 rounded-full bg-[var(--color-bg-surface-3)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-on-primary)] transition-colors">
											<Play size={20} className="ml-1" />
										</div>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>
			</motion.div>
		</div>
	);
};
