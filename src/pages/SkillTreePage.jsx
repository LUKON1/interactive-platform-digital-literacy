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
	const { xp, getTopicProgress, isTopicStarted } = useProgressStore();

	const tiers = useMemo(() => {
		return {
			easy: TOPICS.filter((t) => t.difficulty === "easy"),
			medium: TOPICS.filter((t) => t.difficulty === "medium"),
			hard: TOPICS.filter((t) => t.difficulty === "hard"),
		};
	}, []);

	const tierOrder = ["easy", "medium", "hard"];

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.2 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	// Find the next specific lesson to guide the user
	const nextUnlockId = useMemo(() => {
		for (const tierKey of tierOrder) {
			const tierTopics = tiers[tierKey];
			if (tierTopics.length === 0) continue;

			// Check if tier is unlocked
			let isTierUnlocked = tierKey === "easy";
			if (tierKey !== "easy") {
				const prevTierKey = tierOrder[tierOrder.indexOf(tierKey) - 1];
				const prevTierTopics = tiers[prevTierKey];
				if (prevTierTopics.some((t) => isTopicStarted(t.id))) {
					isTierUnlocked = true;
				}
			}

			if (!isTierUnlocked) return null;

			// Find first topic in this tier that is NOT completed
			const nextTopic = tierTopics.find((t) => getTopicProgress(t.id) < 100);
			if (nextTopic) return nextTopic.id;
		}
		return null;
	}, [tiers, tierOrder, isTopicStarted, getTopicProgress]);

	return (
		<div className="min-h-screen pb-20 overflow-x-hidden">
			{/* Hero Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="pt-12 pb-8 text-center px-6 motion-safe">
				<div className="inline-block px-4 py-1.5 rounded-full bg-bg-surface-2 text-primary text-sm font-medium mb-4 border border-bg-surface-3">
					Digital Literacy Platform v1.0
				</div>
				<h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
					Постепенное обучение
				</h1>
				<p className="text-lg text-text-secondary max-w-2xl mx-auto">
					Выполни хотя бы одну миссию уровня, чтобы открыть следующий.
				</p>
			</motion.div>

			{/* Tiered Tree Viz */}
			<div className="max-w-4xl mx-auto px-6 py-8 relative">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-16">
					{tierOrder.map((tierKey, index) => {
						const tierTopics = tiers[tierKey];
						if (tierTopics.length === 0) return null;

						let isTierUnlocked = index === 0;
						if (index > 0) {
							const prevTierKey = tierOrder[index - 1];
							const prevTierTopics = tiers[prevTierKey];
							const completedInPrev = prevTierTopics.some((t) => isTopicStarted(t.id));
							if (completedInPrev) isTierUnlocked = true;
						}

						// Difficulty Color Logic
						let badgeStyle = "text-text-muted border-bg-surface-3";
						if (isTierUnlocked) {
							if (tierKey === "easy")
								badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
							if (tierKey === "medium")
								badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
							if (tierKey === "hard")
								badgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/20";
						}

						return (
							<motion.div key={tierKey} variants={itemVariants} className="relative">
								{/* Tier Label */}
								<div className="flex justify-center mb-6">
									<span
										className={`
                                   uppercase tracking-widest text-xs font-bold px-3 py-1 rounded-full border bg-bg-base
                                   ${badgeStyle}
                               `}>
										{tierKey} Level
									</span>
								</div>

								{/* Topics Row */}
								<div className="flex flex-wrap justify-center gap-8 md:gap-16">
									{tierTopics.map((topic) => {
										const progress = getTopicProgress(topic.id);
										const isStarted = isTopicStarted(topic.id);
										const isCompleted = progress === 100;
										const isNext = topic.id === nextUnlockId;

										let status = "locked";
										if (isTierUnlocked) status = "active";
										if (isCompleted) status = "completed";

										return (
											<SkillNode
												key={topic.id}
												topic={topic}
												status={status}
												progress={`${progress}%`}
												onClick={() => navigate(`/topic/${topic.id}`)}
												position=""
												isNext={isNext}
											/>
										);
									})}
								</div>

								{/* Connector Arrow */}
								{index < tierOrder.length - 1 && (
									<div className="flex justify-center mt-16 text-bg-surface-3">
										<ChevronDown
											size={32}
											className={
												isTierUnlocked ? "animate-bounce text-primary opacity-50" : "opacity-20"
											}
										/>
									</div>
								)}
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</div>
	);
};
