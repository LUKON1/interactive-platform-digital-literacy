import { create } from "zustand";
import { persist } from "zustand/middleware";

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

			// Actions
			addXp: (amount) =>
				set((state) => {
					const newXp = state.xp + amount;
					// Simple level up logic: linear 100xp per level for now
					const newLevel = Math.floor(newXp / 100) + 1;
					return { xp: newXp, level: newLevel };
				}),

			completeLesson: (topicId, lessonId) =>
				set((state) => {
					if (state.completedLessons.includes(lessonId)) return state;

					const newCompleted = [...state.completedLessons, lessonId];

					// Add 50 XP per lesson
					const newXp = state.xp + 50;
					const newLevel = Math.floor(newXp / 100) + 1;

					return {
						completedLessons: newCompleted,
						xp: newXp,
						level: newLevel,
					};
				}),

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
