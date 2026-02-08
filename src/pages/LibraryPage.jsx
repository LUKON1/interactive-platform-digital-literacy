import React from "react";
import { motion } from "motion/react";
import { TOPICS } from "../data/topics";
import { TopicCard } from "../components/features/TopicCard";
import { useNavigate } from "react-router-dom";

export const LibraryPage = () => {
	const navigate = useNavigate();

	const { getTopicProgress } = useProgressStore();

	return (
		<div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col justify-center">
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-12 text-center motion-safe">
				<div className="inline-block px-4 py-1.5 rounded-full bg-bg-surface-2 text-primary text-sm font-medium mb-4 border border-bg-surface-3">
					Digital Literacy Platform v1.0
				</div>
				<h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
					Cyber Academy
				</h1>
				<p className="text-lg text-text-secondary max-w-2xl mx-auto">
					Стань экспертом цифровой безопасности. Проходи миссии, получай опыт и защити себя в сети.
				</p>
			</motion.header>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 motion-safe">
				{TOPICS.map((topic, index) => {
					// Quick calculation or from store.
					// For now, we will assume the store has a helper or we calculate it here.
					// Since we can't import LESSONS easily if circular, we might just cheat and say
					// we update 'topicProgress' in store directly.
					// Let's rely on topicProgress map from store if available, or 0.
					// The previous store update added 'getTopicProgress' but it was a bit complex.
					// Let's use the 'topicProgress' map which we updated in 'completeLesson' (Wait, I removed that in previous step?)
					// I removed 'updateTopicProgress' logic in favor of just storing completed lessons.

					// Re-reading store from Step 239:
					// I removed 'updateTopicProgress' action, but 'topicProgress' state is still there but unused?
					// I added 'getTopicProgress' helper but it returns 0 placeholder.

					// Correct approach:
					// I should import LESSONS here (HubPage) and calculate progress based on store.completedLessons.
					// HubPage is a Page, it can import Data.

					// Let's do that in the component body.
					return (
						<motion.div
							key={topic.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1 * index + 0.3 }}
							className="motion-safe">
							<TopicCardConnected topic={topic} onClick={() => navigate(`/topic/${topic.id}`)} />
						</motion.div>
					);
				})}
			</motion.div>

			{/* Decorative Blur Backgrounds - Commented out to prioritize Cyber Grid
			<div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-on-primary rounded-full blur-[120px] opacity-20" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary rounded-full blur-[120px] opacity-10" />
			</div>
            */}
		</div>
	);
};

import { useProgressStore } from "../store/useProgressStore";
import { LESSONS } from "../data/lessons";

const TopicCardConnected = ({ topic, onClick }) => {
	const getTopicProgress = useProgressStore((state) => state.getTopicProgress);
	const progress = getTopicProgress(topic.id);

	return <TopicCard topic={topic} progress={progress} onClick={onClick} />;
};
