import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	Database,
	User,
	Search,
	MapPin,
	CreditCard,
	Smartphone,
	CheckCircle,
	XCircle,
	ArrowRight,
} from "lucide-react";
import { clsx } from "clsx";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const DataBroker = ({ data, onComplete, onPrevious, canGoPrevious, isCompleted }) => {
	const { streamItems, correctProfileId, profiles } = data;
	const [visibleItems, setVisibleItems] = useState([]);
	const [streamIndex, setStreamIndex] = useState(0);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [isSuccess, setIsSuccess] = useState(isCompleted || false);
	const [isFinished, setIsFinished] = useState(isCompleted || false);

	const scrollRef = useRef(null);

	// Auto-scroll effect
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [visibleItems]);

	// Data Stream Logic
	useEffect(() => {
		if (isFinished) return;

		const interval = setInterval(() => {
			if (streamIndex < streamItems.length) {
				setVisibleItems((prev) => [...prev, streamItems[streamIndex]]);
				setStreamIndex((prev) => prev + 1);
			} else {
				clearInterval(interval);
			}
		}, 1500); // New item every 1.5 seconds

		return () => clearInterval(interval);
	}, [streamIndex, isFinished, streamItems]);

	const handleProfileSelect = (profileId) => {
		if (isFinished) return;

		setSelectedProfile(profileId);
		if (profileId === correctProfileId) {
			setIsSuccess(true);
			setIsFinished(true);
		} else {
			// Shake effect or error feedback could be added here
			// For now, allow re-selection
			setTimeout(() => setSelectedProfile(null), 1000);
		}
	};

	const getIcon = (type) => {
		switch (type) {
			case "search":
				return <Search size={16} />;
			case "location":
				return <MapPin size={16} />;
			case "purchase":
				return <CreditCard size={16} />;
			case "device":
				return <Smartphone size={16} />;
			default:
				return <Database size={16} />;
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto flex flex-col h-full gap-8">
			{/* Header */}
			<div className="text-center">
				<div className="inline-flex items-center justify-center p-3 bg-tertiary/10 text-tertiary rounded-full mb-4">
					<Database size={32} />
				</div>
				<h3 className="text-2xl font-bold mb-2">Симулятор Брокера Данных</h3>
				<p className="text-text-secondary max-w-2xl mx-auto">
					Алгоритмы анализируют каждый ваш клик. Посмотрите на поток данных и определите, кто этот
					пользователь, чтобы продать ему рекламу.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-100">
				{/* Left: Data Stream (Terminal Style) */}
				<div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 flex flex-col shadow-2xl relative overflow-hidden">
					<div className="flex items-center gap-2 mb-4 text-gray-400 text-xs uppercase tracking-widest font-mono border-b border-gray-800 pb-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
						<span className="ml-auto">Live Stream: USER_ID_9924</span>
					</div>

					<div
						ref={scrollRef}
						className="flex-1 max-h-100 overflow-y-auto space-y-3 font-mono text-sm custom-scrollbar">
						<AnimatePresence>
							{visibleItems.map((item, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									className="flex items-center gap-3 text-cyan-400 p-2 bg-gray-800/50 rounded hover:bg-gray-800 transition-colors">
									<span className="text-gray-500 shrink-0">{item.time}</span>
									<span className="text-tertiary">{getIcon(item.type)}</span>
									<span className="text-gray-300">{item.content}</span>
								</motion.div>
							))}
						</AnimatePresence>
						{streamIndex >= streamItems.length && (
							<div className="text-center text-gray-500 py-4 italic">-- Конец потока данных --</div>
						)}
					</div>
				</div>

				{/* Right: Profile Selector */}
				<div className="flex flex-col justify-center gap-4">
					<h4 className="text-lg font-bold text-center mb-2">Кто этот пользователь?</h4>
					<p className="text-sm text-center text-text-muted mb-6">
						Выберите категорию для таргетинга рекламы
					</p>

					<div className="space-y-4">
						{profiles.map((profile) => {
							const isSelected = selectedProfile === profile.id;
							const isCorrect = profile.id === correctProfileId;
							const showResult = isFinished && isSelected;

							return (
								<button
									key={profile.id}
									disabled={isFinished && !isSelected}
									onClick={() => handleProfileSelect(profile.id)}
									className={clsx(
										"w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group",
										isSelected
											? isCorrect
												? "border-success bg-success/10"
												: "border-error bg-error/10"
											: "border-bg-surface-3 bg-bg-surface-2 hover:border-primary hover:bg-bg-surface-1",
									)}>
									<div className="flex items-center justify-between relative z-10">
										<div className="flex items-center gap-4">
											<div
												className={clsx(
													"w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors",
													isSelected
														? isCorrect
															? "bg-success text-white"
															: "bg-error text-white"
														: "bg-bg-surface-3 text-text-secondary group-hover:bg-primary group-hover:text-white",
												)}>
												{profile.icon}
											</div>
											<div>
												<h5 className="font-bold text-lg">{profile.label}</h5>
												<p className="text-xs text-text-secondary">{profile.description}</p>
											</div>
										</div>
										<div className="text-2xl">
											{showResult ? (
												isCorrect ? (
													<CheckCircle className="text-success" />
												) : (
													<XCircle className="text-error" />
												)
											) : (
												<ArrowRight
													className={clsx(
														"transition-transform group-hover:translate-x-1",
														isSelected ? "opacity-0" : "text-text-muted",
													)}
												/>
											)}
										</div>
									</div>

									{/* Progress bar background for selection? Maybe later. */}
								</button>
							);
						})}
					</div>

					<AnimatePresence>
						{isFinished && isSuccess && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-6 p-4 bg-success/20 border border-success rounded-xl text-center">
								<p className="text-success font-bold text-lg mb-1">Точное попадание!</p>
								<p className="text-sm text-text-secondary">
									Вы успешно составили цифровой портрет. Теперь мы знаем, какую рекламу ему
									показать.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Navigation */}
			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isSuccess}
				lockedMessage="Определите профиль пользователя"
			/>
		</div>
	);
};
