import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LESSONS } from "../data/lessons";

// Calculate dynamic max XP based on total lessons
const TOTAL_LESSONS = Object.values(LESSONS).flat().length;
const MAX_XP = TOTAL_LESSONS * 50;
const MAX_LEVEL = Math.floor(MAX_XP / 100) + 1;

export const useProgressStore = create(
	persist(
		(set, get) => ({
			// Progress percentage per topic: { 'topic-id': 50 }
			topicProgress: {},

			// Completed lesson IDs: ['lesson-1', 'lesson-2']
			completedLessons: [],

			// XP Points
			xp: 0,

			// Current User Level
			level: 1,

			// Max Level Flag
			isMaxLevel: false,

			// Actions
			addXp: (amount) =>
				set((state) => {
					let newXp = state.xp + amount;
					if (newXp > MAX_XP) newXp = MAX_XP;

					// Linear 100xp per level
					let newLevel = Math.floor(newXp / 100) + 1;
					if (newLevel > MAX_LEVEL) newLevel = MAX_LEVEL;

					// Calculate progress within current level (0-100)
					const xpForCurrentLevel = (newLevel - 1) * 100;
					let levelProgress = ((newXp - xpForCurrentLevel) / 100) * 100;

					if (newXp >= MAX_XP) {
						levelProgress = 100;
					}

					return {
						xp: newXp,
						level: newLevel,
						levelProgress,
						isMaxLevel: newXp >= MAX_XP,
						recentXpGain: amount, // Trigger for animations/notifications
						lastXpUpdate: Date.now(), // Timestamp to force updates if needed
					};
				}),

			completeLesson: (topicId, lessonId) =>
				set((state) => {
					if (state.completedLessons.includes(lessonId)) return state;

					const newCompleted = [...state.completedLessons, lessonId];

					// Add 50 XP per lesson
					const amount = 50;
					let newXp = state.xp + amount;
					if (newXp > MAX_XP) newXp = MAX_XP;

					let newLevel = Math.floor(newXp / 100) + 1;
					if (newLevel > MAX_LEVEL) newLevel = MAX_LEVEL;

					const xpForCurrentLevel = (newLevel - 1) * 100;
					let levelProgress = ((newXp - xpForCurrentLevel) / 100) * 100;

					if (newXp >= MAX_XP) {
						levelProgress = 100;
					}

					return {
						completedLessons: newCompleted,
						xp: newXp,
						level: newLevel,
						levelProgress,
						isMaxLevel: newXp >= MAX_XP,
						recentXpGain: amount,
						lastXpUpdate: Date.now(),
					};
				}),

			clearRecentXpGain: () => set({ recentXpGain: 0 }),

			// Helper to just return progress percent (can be used in selectors)
			getTopicProgress: (topicId, totalLessons) => {
				const state = get();
				if (!totalLessons || totalLessons === 0) return 0;
				const completedInTopic = state.completedLessons.filter(
					(l) =>
						l.startsWith(topicId) ||
						(state.topicLessons && state.topicLessons[topicId]?.includes(l)),
				).length;
				// Since our IDs are not strictly prefixed (e.g. 'lesson-1'), we might need a better check.
				// BUT, looking at lessons.js: 'digital-fortress' -> 'df-lesson-1'.
				// This is a problem! 'lesson-1' exists in multiple topics?
				// Let's check lessons.js. If IDs are unique or scoped.
				return 0; // Placeholder until ID check
			},

			resetProgress: () => set({ topicProgress: {}, completedLessons: [], xp: 0, level: 1 }),
		}),
		{
			name: "digital-literacy-storage", // name of the item in the storage (must be unique)
		},
	),
);
