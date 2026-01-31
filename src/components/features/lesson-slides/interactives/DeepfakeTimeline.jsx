import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Sparkles, Shield, Scale, Zap } from "lucide-react";
import { InteractiveNavigation } from "./InteractiveNavigation";

// Timeline events data
const TIMELINE_EVENTS = [
	{
		id: 1,
		year: 2017,
		title: "Рождение термина",
		description:
			"На Reddit появляется термин 'deepfake' - искусственные видео знаменитостей созданные с помощью нейросетей.",
		icon: Sparkles,
		color: "from-purple-500 to-pink-500",
	},
	{
		id: 2,
		year: 2018,
		title: "Первый скандал",
		description:
			"Вирусное видео: 'Барак Обама' якобы оскорбляет президента. На самом деле - демонстрация технологии от BuzzFeed и режиссёра Джордана Пила.",
		icon: Zap,
		color: "from-orange-500 to-red-500",
	},
	{
		id: 3,
		year: 2019,
		title: "Криминальное применение",
		description:
			"CEO британской энергокомпании переводит $243,000 мошенникам, поверив в голосовой дипфейк 'босса'. Первый крупный CEO-fraud.",
		icon: Shield,
		color: "from-red-500 to-pink-500",
	},
	{
		id: 4,
		year: 2021,
		title: "Законы и защита",
		description:
			"ЕС и США начинают принимать законы против malicious deepfakes. Платформы (Twitter, TikTok) вводят маркировку синтетического контента.",
		icon: Scale,
		color: "from-blue-500 to-cyan-500",
	},
	{
		id: 5,
		year: 2023,
		title: "Эра Real-time",
		description:
			"Появляются технологии замены лица в режиме реального времени на видеозвонках. Мошенничество выходит на новый уровень.",
		icon: Zap,
		color: "from-yellow-500 to-orange-500",
	},
	{
		id: 6,
		year: 2026,
		title: "AI-детекторы",
		description:
			"Крупные компании внедряют AI-системы детекции дипфейков. Началась 'гонка вооружений' между создателями и детекторами.",
		icon: Shield,
		color: "from-green-500 to-emerald-500",
	},
];

export const DeepfakeTimeline = ({ onComplete, onPrevious, canGoPrevious, isCompleted }) => {
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [viewedEvents, setViewedEvents] = useState(
		new Set(isCompleted ? TIMELINE_EVENTS.map((e) => e.id) : []),
	);

	const handleEventClick = (event) => {
		setSelectedEvent(event);
		setViewedEvents((prev) => new Set([...prev, event.id]));
	};

	const allViewed = viewedEvents.size === TIMELINE_EVENTS.length;

	return (
		<div className="w-full max-w-5xl mx-auto flex flex-col h-full">
			{/* Timeline */}
			<div className="relative flex-1 overflow-x-auto pb-8 mb-8">
				{/* Timeline line */}
				<div className="absolute top-24 left-0 right-0 h-1 bg-bg-surface-3 hidden md:block" />

				{/* Timeline events */}
				<div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 relative px-4">
					{TIMELINE_EVENTS.map((event, index) => {
						const Icon = event.icon;
						const isViewed = viewedEvents.has(event.id);
						const isSelected = selectedEvent?.id === event.id;

						return (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="flex flex-col items-center relative z-10 w-full md:w-auto">
								{/* Event marker */}
								<button
									onClick={() => handleEventClick(event)}
									className={`
										w-20 h-20 rounded-full flex items-center justify-center
										transition-all duration-300 mb-3
										${
											isSelected
												? `bg-linear-to-br ${event.color} scale-110 shadow-xl`
												: isViewed
													? `bg-linear-to-br ${event.color} opacity-80`
													: "bg-bg-surface-2 hover:bg-bg-surface-3"
										}
										border-4 border-bg-base
									`}>
									<Icon
										size={32}
										className={isViewed || isSelected ? "text-white" : "text-text-muted"}
									/>
								</button>

								{/* Year label */}
								<div
									className={`
									text-lg font-bold mb-2
									${isViewed ? "text-primary" : "text-text-muted"}
								`}>
									{event.year}
								</div>

								{/* Title (mobile only) */}
								<div className="md:hidden text-center text-sm text-text-secondary max-w-40">
									{event.title}
								</div>

								{/* Viewed indicator */}
								{isViewed && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
										<Calendar size={14} className="text-bg-base" />
									</motion.div>
								)}
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Event details card */}
			<div className="min-h-48 mb-8">
				<AnimatePresence mode="wait">
					{selectedEvent ? (
						<motion.div
							key={selectedEvent.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="bg-bg-surface-2 border border-bg-surface-3 rounded-3xl p-6 shadow-xl">
							<div className="flex items-start gap-4">
								<div
									className={`
									p-4 rounded-2xl bg-linear-to-br ${selectedEvent.color}
									shrink-0
								`}>
									<selectedEvent.icon size={32} className="text-white" />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<span className="text-3xl font-bold text-primary">{selectedEvent.year}</span>
										<h3 className="text-xl font-bold text-text-primary">{selectedEvent.title}</h3>
									</div>
									<p className="text-text-secondary leading-relaxed text-base">
										{selectedEvent.description}
									</p>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="placeholder"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="h-48 flex items-center justify-center border-2 border-dashed border-bg-surface-3 rounded-3xl">
							<p className="text-text-muted text-lg">Кликни на событие, чтобы узнать подробности</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Progress indicator */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-text-secondary">Изучено событий</span>
					<span className="text-sm font-bold text-primary">
						{viewedEvents.size} / {TIMELINE_EVENTS.length}
					</span>
				</div>
				<div className="w-full h-2 bg-bg-surface-2 rounded-full overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${(viewedEvents.size / TIMELINE_EVENTS.length) * 100}%` }}
						transition={{ duration: 0.5 }}
						className="h-full bg-linear-to-r from-primary to-secondary rounded-full"
					/>
				</div>
			</div>

			{/* Navigation */}
			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isCompleted || allViewed}
				lockedMessage="Изучите все события"
			/>
		</div>
	);
};
