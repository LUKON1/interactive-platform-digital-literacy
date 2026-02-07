import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProgressStore } from "../../../store/useProgressStore";
import { CheckCircle, Trophy } from "lucide-react";
import { triggerStandard, triggerCelebration } from "../../../utils/confetti";

export const XpNotification = () => {
	const { recentXpGain, clearRecentXpGain, level } = useProgressStore();
	const prevLevelRef = useRef(level);

	useEffect(() => {
		if (recentXpGain > 0) {
			triggerStandard();
			const timer = setTimeout(() => {
				clearRecentXpGain();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [recentXpGain, clearRecentXpGain]);

	useEffect(() => {
		if (level > prevLevelRef.current) {
			triggerCelebration();
			prevLevelRef.current = level;
		}
	}, [level]);

	return (
		<AnimatePresence>
			{recentXpGain > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -20, scale: 0.8 }}
					className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-bg-surface-2 border border-primary/20 p-4 rounded-xl shadow-2xl backdrop-blur-md">
					<div className="bg-primary/10 p-2 rounded-full text-primary">
						<Trophy size={24} />
					</div>
					<div>
						<div className="text-lg font-bold text-primary">+{recentXpGain} XP</div>
						<div className="text-xs text-text-secondary">Keep it up!</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
