import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LESSONS } from "../data/lessons";

// Helper to calculate level and progress
const calculateLevelState = (currentXp) => {
	// Calculate dynamic max XP based on total lessons
	const TOTAL_LESSONS = Object.values(LESSONS).flat().length;
	const MAX_XP = TOTAL_LESSONS * 50;
	// Calculate dynamic max level
	const MAX_LEVEL = Math.floor(MAX_XP / 100) + 1;

	let newXp = currentXp;

	// Cap XP at MAX_XP
	if (newXp > MAX_XP) newXp = MAX_XP;

	let newLevel = Math.floor(newXp / 100) + 1;

	// Cap Level at MAX_LEVEL
	if (newLevel > MAX_LEVEL) newLevel = MAX_LEVEL;

	// Calculate progress within current level (0-100)
	const xpForCurrentLevel = (newLevel - 1) * 100;
	let levelProgress = ((newXp - xpForCurrentLevel) / 100) * 100;

	if (newXp >= MAX_XP) {
		levelProgress = 100;
		newLevel = MAX_LEVEL;
	}

	return {
		xp: newXp,
		level: newLevel,
		levelProgress,
		isMaxLevel: newXp >= MAX_XP,
	};
};

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
			levelProgress: 0,

			// Max Level Flag
			isMaxLevel: false,

			// Modal State
			hasSeenCompletionModal: false,

			// Transient state (excluded from persist)
			recentXpGain: 0,
			lastXpUpdate: 0,

			// Actions
			markCompletionModalSeen: () => set({ hasSeenCompletionModal: true }),

			addXp: (amount) =>
				set((state) => {
					const newState = calculateLevelState(state.xp + amount);

					return {
						...newState,
						recentXpGain: amount, // Trigger for animations/notifications
						lastXpUpdate: Date.now(), // Timestamp to force updates if needed
					};
				}),

			completeLesson: (lessonId) =>
				set((state) => {
					console.log("Attempting to complete lesson:", lessonId);
					console.log("Current completed lessons:", state.completedLessons);

					if (state.completedLessons.includes(lessonId)) {
						console.log("Lesson already completed. Skipping XP update.");
						return state;
					}

					const newCompleted = [...state.completedLessons, lessonId];
					const amount = 50; // XP per lesson
					const newState = calculateLevelState(state.xp + amount);

					console.log("New XP State:", newState);

					return {
						completedLessons: newCompleted,
						...newState,
						recentXpGain: amount,
						lastXpUpdate: Date.now(),
					};
				}),

			clearRecentXpGain: () => set({ recentXpGain: 0 }),

			// Selectors / Helpers
			getTopicProgress: (topicId) => {
				const state = get();
				const topicLessons = LESSONS[topicId] || [];
				if (topicLessons.length === 0) return 0;

				const completedCount = topicLessons.filter((lesson) =>
					state.completedLessons.includes(lesson.id),
				).length;

				return Math.round((completedCount / topicLessons.length) * 100);
			},

			isTopicStarted: (topicId) => {
				const state = get();
				const topicLessons = LESSONS[topicId] || [];
				return topicLessons.some((lesson) => state.completedLessons.includes(lesson.id));
			},

			resetProgress: () =>
				set({
					topicProgress: {},
					completedLessons: [],
					xp: 0,
					level: 1,
					levelProgress: 0,
					isMaxLevel: false,
					hasSeenCompletionModal: false,
					recentXpGain: 0,
				}),
		}),
		{
			name: "digital-literacy-storage",
			partialize: (state) => ({
				// Exclude transient state from persistence
				topicProgress: state.topicProgress,
				completedLessons: state.completedLessons,
				xp: state.xp,
				level: state.level,
				levelProgress: state.levelProgress,
				isMaxLevel: state.isMaxLevel,
				hasSeenCompletionModal: state.hasSeenCompletionModal,
			}),
		},
	),
);
