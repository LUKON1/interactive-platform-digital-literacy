import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { InteractiveNavigation } from "./InteractiveNavigation";

// Clickable artifact zones on the image
const ARTIFACTS = [
	{
		id: "eyes",
		x: 45, // percentage from left
		y: 28, // percentage from top
		radius: 8,
		label: "Неестественные глаза",
		description: "Отражения в глазах не совпадают с освещением. Зрачки разного размера.",
		hint: "Обрати внимание на область глаз",
	},
	{
		id: "hairline",
		x: 50,
		y: 15,
		radius: 10,
		label: "Размытая линия волос",
		description: "Граница между волосами и кожей нечёткая, видны артефакты наложения.",
		hint: "Посмотри на границу роста волос",
	},
	{
		id: "teeth",
		x: 48,
		y: 60,
		radius: 7,
		label: "Странные зубы",
		description: "Зубы выглядят размыто, симметрия нарушена. Типичный признак дипфейка.",
		hint: "Проверь область рта и зубов",
	},
	{
		id: "neck",
		x: 50,
		y: 85,
		radius: 9,
		label: "Резкая граница на шее",
		description: "Видна чёткая граница там, где маска встречается с телом. Цвет кожи отличается.",
		hint: "Посмотри на переход от лица к шее",
	},
];

export const ImageComparison = ({ onComplete, onPrevious, canGoPrevious, isCompleted, data }) => {
	const imageUrl = data?.image || "/assets/deepfake-comparison.png";
	const requiredFinds = data?.requiredFinds || 3; // How many artifacts user must find

	const [foundArtifacts, setFoundArtifacts] = useState(
		new Set(isCompleted ? ARTIFACTS.map((a) => a.id) : []),
	);
	const [selectedArtifact, setSelectedArtifact] = useState(null);
	const [showHints, setShowHints] = useState(false);
	const [clickedWrong, setClickedWrong] = useState(false);

	const handleImageClick = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		// Check if clicked near an artifact
		const clickedArtifact = ARTIFACTS.find((artifact) => {
			const distance = Math.sqrt(Math.pow(artifact.x - x, 2) + Math.pow(artifact.y - y, 2));
			return distance < artifact.radius;
		});

		if (clickedArtifact && !foundArtifacts.has(clickedArtifact.id)) {
			// Found a new artifact
			setFoundArtifacts((prev) => new Set([...prev, clickedArtifact.id]));
			setSelectedArtifact(clickedArtifact);
		} else if (!clickedArtifact) {
			// Clicked wrong area
			setClickedWrong(true);
			setTimeout(() => setClickedWrong(false), 500);
		}
	};

	const progress = foundArtifacts.size;
	const isComplete = progress >= requiredFinds;

	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col h-full">
			{/* Instructions */}
			<div className="bg-bg-surface-2 border border-bg-surface-3 rounded-2xl p-4 mb-6">
				<div className="flex items-center gap-3 mb-2">
					<Search size={24} className="text-primary" />
					<h3 className="text-lg font-bold text-text-primary">Найди артефакты дипфейка</h3>
				</div>
				<p className="text-text-secondary text-sm">
					Кликай на подозрительные области изображения. Нужно найти минимум {requiredFinds} из{" "}
					{ARTIFACTS.length} артефактов.
				</p>
			</div>

			{/* Image container */}
			<div className="flex-1 flex items-center justify-center mb-6 relative">
				<div className="relative max-w-md w-full">
					{/* Image with clickable overlay */}
					<div
						onClick={handleImageClick}
						className={`
							relative cursor-crosshair rounded-2xl overflow-hidden
							shadow-2xl border-4 transition-all
							${clickedWrong ? "border-error shake" : "border-bg-surface-3"}
						`}>
						{/* Deepfake image */}
						<img
							src={imageUrl}
							alt="Deepfake analysis"
							className="w-full h-full object-cover aspect-3/4"
						/>

						{/* Found artifact markers */}
						{ARTIFACTS.map((artifact) => {
							const isFound = foundArtifacts.has(artifact.id);
							if (!isFound && !showHints) return null;

							return (
								<motion.div
									key={artifact.id}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="absolute"
									style={{
										left: `${artifact.x}%`,
										top: `${artifact.y}%`,
										transform: "translate(-50%, -50%)",
									}}>
									{isFound ? (
										<div className="w-12 h-12 rounded-full bg-success/80 flex items-center justify-center border-4 border-white shadow-lg animate-pulse">
											<CheckCircle size={24} className="text-white" />
										</div>
									) : (
										<div className="w-8 h-8 rounded-full border-2 border-dashed border-primary/50 animate-pulse" />
									)}
								</motion.div>
							);
						})}
					</div>

					{/* Hint button */}
					<button
						onClick={() => setShowHints(!showHints)}
						className="absolute top-4 right-4 bg-bg-surface-2/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-text-primary border border-bg-surface-3 hover:bg-bg-surface-3 transition-colors">
						{showHints ? "Скрыть подсказки" : "Показать подсказки"}
					</button>
				</div>
			</div>

			{/* Artifact description */}
			<div className="min-h-32 mb-6">
				<AnimatePresence mode="wait">
					{selectedArtifact ? (
						<motion.div
							key={selectedArtifact.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="bg-success/10 border border-success/30 rounded-2xl p-6">
							<div className="flex items-start gap-4">
								<div className="p-3 rounded-xl bg-success/20">
									<CheckCircle size={28} className="text-success" />
								</div>
								<div>
									<h4 className="text-lg font-bold text-success mb-2">{selectedArtifact.label}</h4>
									<p className="text-text-secondary">{selectedArtifact.description}</p>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="placeholder"
							className="h-32 flex items-center justify-center border-2 border-dashed border-bg-surface-3 rounded-2xl">
							<p className="text-text-muted">Кликни на изображение, чтобы найти артефакты</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Progress */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-text-secondary">Найдено артефактов</span>
					<span className="text-sm font-bold text-primary">
						{progress} / {ARTIFACTS.length}
					</span>
				</div>
				<div className="w-full h-2 bg-bg-surface-2 rounded-full overflow-hidden">
					<motion.div
						animate={{ width: `${(progress / ARTIFACTS.length) * 100}%` }}
						className="h-full bg-linear-to-r from-success to-primary rounded-full"
					/>
				</div>
			</div>

			{/* Navigation */}
			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isCompleted || isComplete}
				lockedMessage={`Найди минимум ${requiredFinds} артефакта`}
			/>
		</div>
	);
};
