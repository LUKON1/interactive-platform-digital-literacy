import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Trophy, Lock, Check, ChevronDown } from "lucide-react";
import { useProgressStore } from "../store/useProgressStore";
import { TOPICS } from "../data/topics";
import { LESSONS } from "../data/lessons";
import { SkillNode } from "../components/features/SkillNode";

export const SkillTreePage = () => {
	const navigate = useNavigate();
	const { xp, level, completedLessons } = useProgressStore();

	const tiers = useMemo(() => {
		return {
			easy: TOPICS.filter((t) => t.difficulty === "easy"),
			medium: TOPICS.filter((t) => t.difficulty === "medium"),
			hard: TOPICS.filter((t) => t.difficulty === "hard"),
		};
	}, []);

	const tierOrder = ["easy", "medium", "hard"];

	// Helper to check if a topic has any completed lessons
	const isTopicStarted = (topicId) => {
		const topicLessonData = LESSONS[topicId] || [];
		return topicLessonData.some((lesson) => completedLessons.includes(lesson.id));
	};

	// Helper to check completed count
	const getTopicProgressCount = (topicId) => {
		const topicLessonData = LESSONS[topicId] || [];
		return topicLessonData.filter((lesson) => completedLessons.includes(lesson.id)).length;
	};

	return (
		<div className="min-h-screen pb-20 bg-[var(--color-bg-base)] overflow-x-hidden">
			{/* Hero Section */}
			<div className="pt-12 pb-8 text-center px-6">
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-surface-2)] border border-[var(--color-bg-surface-3)] mb-4">
					<Trophy size={16} className="text-[var(--color-warning)]" />
					<span className="text-sm font-bold">Level {level}</span>
					<span className="text-xs text-[var(--color-text-secondary)] border-l pl-2 ml-2 border-[var(--color-bg-surface-3)]">
						{xp} XP
					</span>
				</div>
				<h1 className="text-4xl md:text-5xl font-bold mb-4">Постепенное обучение</h1>
				<p className="text-[var(--color-text-secondary)]">
					Выполни хотя бы одну миссию уровня, чтобы открыть следующий.
				</p>
			</div>

			{/* Tiered Tree Viz */}
			<div className="max-w-4xl mx-auto px-6 py-8 relative">
				<div className="absolute left-1/2 top-10 bottom-10 w-1 bg-[var(--color-bg-surface-3)] -translate-x-1/2 -z-10 rounded-full opacity-30" />

				<div className="flex flex-col gap-16">
					{tierOrder.map((tierKey, index) => {
						const tierTopics = tiers[tierKey];
						if (tierTopics.length === 0) return null;

						// Unlock Logic:
						// Tier 0 is unlocked.
						// Tier N unlocked if Tier N-1 has >= 1 lesson completed (isTopicStarted is true for ANY prev topic).
						let isTierUnlocked = index === 0;
						if (index > 0) {
							const prevTierKey = tierOrder[index - 1];
							const prevTierTopics = tiers[prevTierKey];
							const completedInPrev = prevTierTopics.some((t) => isTopicStarted(t.id));
							if (completedInPrev) isTierUnlocked = true;
						}

						return (
							<div key={tierKey} className="relative">
								{/* Tier Label */}
								<div className="flex justify-center mb-6">
									<span
										className={`
                                   uppercase tracking-widest text-xs font-bold px-3 py-1 rounded-full border bg-[var(--color-bg-base)]
                                   ${isTierUnlocked ? "text-[var(--color-primary)] border-[var(--color-primary)]" : "text-[var(--color-text-muted)] border-[var(--color-bg-surface-3)]"}
                               `}>
										{tierKey} Level
									</span>
								</div>

								{/* Topics Row */}
								<div className="flex flex-wrap justify-center gap-8 md:gap-16">
									{tierTopics.map((topic) => {
										const topicLessonData = LESSONS[topic.id] || [];
										const completedCount = getTopicProgressCount(topic.id);
										// Use dynamic count if available, otherwise fallback to static metadata
										const total =
											topicLessonData.length > 0 ? topicLessonData.length : topic.totalLessons || 1;
										const isCompleted = completedCount >= total && total > 0;

										let status = "locked";
										if (isTierUnlocked) status = "active";
										if (isCompleted) status = "completed";

										return (
											<SkillNode
												key={topic.id}
												topic={topic}
												status={status}
												progress={`${completedCount}/${total}`}
												onClick={() => navigate(`/topic/${topic.id}`)}
												position=""
											/>
										);
									})}
								</div>

								{/* Connector Arrow */}
								{index < tierOrder.length - 1 && (
									<div className="flex justify-center mt-16 text-[var(--color-bg-surface-3)]">
										<ChevronDown
											size={32}
											className={
												isTierUnlocked
													? "animate-bounce text-[var(--color-primary)] opacity-50"
													: "opacity-20"
											}
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
