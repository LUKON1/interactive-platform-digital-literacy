import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { InteractiveNavigation } from "./InteractiveNavigation";

// Clickable artifact zones on the image
const ARTIFACTS = [
	{
		id: "eyes",
		x: 50, // percentage from left
		y: 30, // percentage from top
		radius: 12,
		label: "Неестественные глаза",
		description: "Отражения в глазах не совпадают с освещением. Зрачки разного размера.",
		hint: "Обрати внимание на область глаз",
	},
	{
		id: "hairline",
		x: 45,
		y: 8,
		radius: 15,
		label: "Размытая линия волос",
		description: "Граница между волосами и кожей нечёткая, видны артефакты наложения.",
		hint: "Посмотри на границу роста волос",
	},
	{
		id: "teeth",
		x: 50,
		y: 53,
		radius: 10,
		label: "Странные зубы",
		description: "Зубы выглядят размыто, симметрия нарушена. Типичный признак дипфейка.",
		hint: "Проверь область рта и зубов",
	},
	{
		id: "neck",
		x: 25,
		y: 70,
		radius: 14,
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

	const handleArtifactClick = (artifact) => {
		if (!foundArtifacts.has(artifact.id)) {
			// Found a new artifact
			setFoundArtifacts((prev) => new Set([...prev, artifact.id]));
			setSelectedArtifact(artifact);
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
					<div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-bg-surface-3">
						{/* Deepfake image */}
						<img
							src={imageUrl}
							alt="Deepfake analysis"
							onClick={(e) => e.preventDefault()}
							onDragStart={(e) => e.preventDefault()}
							className="w-full h-full object-cover aspect-3/4"
						/>

						{/* Interactive artifact zones */}
						{ARTIFACTS.map((artifact) => {
							const isFound = foundArtifacts.has(artifact.id);

							return (
								<motion.button
									key={artifact.id}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									onClick={() => handleArtifactClick(artifact)}
									disabled={isFound}
									className={`absolute group ${isFound ? "pointer-events-auto cursor-default" : "opacity-0 cursor-pointer"}`}
									style={{
										left: `${artifact.x}%`,
										top: `${artifact.y}%`,
										transform: "translate(-50%, -50%)",
										width: `${artifact.radius * 2}%`,
										aspectRatio: "1/1",
									}}>
									{/* Found state - green circle with checkmark */}
									{isFound ? (
										<div className="w-full h-full rounded-full bg-success/30 border-2 border-success flex items-center justify-center shadow-lg">
											<CheckCircle className="text-success w-1/2 h-1/2" />
										</div>
									) : (
										<>
											{/* Default and hover state - circle with magnifying glass */}
											<div className="w-full h-full rounded-full bg-primary/10 border-2 border-primary/30 border-dashed flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
												<Search className="text-primary/70 w-1/3 h-1/3" />
											</div>

											{/* Hint state - pulsing dashed circle */}
											{showHints && (
												<motion.div
													initial={{ scale: 0.8, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													className="absolute inset-0 w-full h-full rounded-full border-2 border-dashed border-primary/60 animate-pulse pointer-events-none"
												/>
											)}
										</>
									)}
								</motion.button>
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
