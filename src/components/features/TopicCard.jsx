import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, MessageCircleWarning, Footprints, ArrowRight } from "lucide-react";
import { ProgressRing } from "../ui/ProgressRing";

const ICON_MAP = {
	ShieldCheck,
	MessageCircleWarning,
	Footprints,
};

export const TopicCard = ({ topic, progress = 0, onClick }) => {
	const Icon = ICON_MAP[topic.icon] || ShieldCheck;

	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className="surface-card p-6 flex flex-col gap-4 cursor-pointer relative overflow-hidden group border border-white/5"
			onClick={onClick}>
			{/* Difficulty Badge */}
			{topic.difficulty && (
				<div
					className={`
                    absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border
                    ${topic.difficulty === "easy" ? "bg-success/10 text-success border-success/20" : ""}
                    ${topic.difficulty === "medium" ? "bg-warning/10 text-warning border-warning/20" : ""}
                    ${topic.difficulty === "hard" ? "bg-error/10 text-error border-error/20" : ""}
                `}>
					{topic.difficulty}
				</div>
			)}

			{/* Decorative Glow */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 blur-[50px] rounded-full translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity" />

			<div className="flex justify-between items-start z-10">
				<div className="p-3 rounded-2xl bg-bg-surface-2 text-primary">
					<Icon size={28} />
				</div>
				<ProgressRing progress={progress} size={52} strokeWidth={5} />
			</div>

			<div className="z-10 mt-2">
				<h3 className="text-xl font-semibold text-text-primary mb-1">{topic.title}</h3>
				<p className="text-text-secondary text-sm leading-relaxed">{topic.description}</p>
			</div>

			<div className="mt-auto pt-4 flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
				Начать миссию <ArrowRight size={16} className="ml-2" />
			</div>
		</motion.div>
	);
};
