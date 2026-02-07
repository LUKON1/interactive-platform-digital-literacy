import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, AlertTriangle, CheckCircle, X, Eye } from "lucide-react";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const EmailInspector = ({ onComplete, onPrevious, canGoPrevious, isCompleted, data }) => {
	const { from, subject, date, body, redFlags } = data;

	const [foundFlags, setFoundFlags] = useState(isCompleted ? redFlags.map((f) => f.id) : []);
	const [selectedFlag, setSelectedFlag] = useState(null);
	const [hoveredFlag, setHoveredFlag] = useState(null);

	const handleFlagClick = (flagId) => {
		if (!foundFlags.includes(flagId)) {
			setFoundFlags([...foundFlags, flagId]);
		}
		const flag = redFlags.find((f) => f.id === flagId);
		setSelectedFlag(flag);
	};

	const isComplete = foundFlags.length === redFlags.length;

	// Severity colors
	const getSeverityColor = (severity) => {
		switch (severity) {
			case "critical":
				return "text-error border-error bg-error/10";
			case "high":
				return "text-warning border-warning bg-warning/10";
			case "medium":
				return "text-info border-info bg-info/10";
			default:
				return "text-text-secondary border-bg-surface-3 bg-bg-surface-2";
		}
	};

	// Highlight text based on redFlags
	const highlightBody = () => {
		let highlightedBody = body;
		const flagsToHighlight = redFlags.filter((f) => f.location === "content");

		// IMPORTANT: Process grammar phrase FIRST before urgency words
		// This prevents "немедленно" from being highlighted as urgency
		if (redFlags.find((f) => f.id === "grammar")) {
			highlightedBody = highlightedBody.replace(
				/(перейдите по ссылке немедленно)/gi,
				'<mark class="grammar-highlight" data-flag="grammar">$1</mark>',
			);
		}

		// Then process other patterns
		flagsToHighlight.forEach((flag) => {
			if (flag.id === "urgency") {
				highlightedBody = highlightedBody.replace(
					/(24 часа|24 часов|срочно)/gi,
					'<mark class="urgency-highlight" data-flag="urgency">$1</mark>',
				);
			}
			if (flag.id === "link") {
				highlightedBody = highlightedBody.replace(
					/(https?:\/\/[^\s]+)/g,
					'<mark class="link-highlight" data-flag="link">$1</mark>',
				);
			}
		});

		return highlightedBody;
	};

	const handleBodyClick = (e) => {
		const mark = e.target.closest("mark");
		if (mark) {
			const flagId = mark.getAttribute("data-flag");
			if (flagId) {
				handleFlagClick(flagId);
			}
		} else if (e.target.classList.contains("urgency-highlight")) {
			handleFlagClick("urgency");
		} else if (e.target.classList.contains("link-highlight")) {
			handleFlagClick("link");
		} else if (e.target.classList.contains("grammar-highlight")) {
			handleFlagClick("grammar");
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto flex flex-col h-full lg:flex-row gap-6 pt-28 lg:pt-0">
			{/* Email Display */}
			<div className="flex-1 surface-card p-6">
				<div className="flex items-center gap-3 mb-6 pb-4 border-b border-bg-surface-3">
					<Mail className="text-primary" size={24} />
					<h3 className="text-xl font-bold text-text-primary">Входящее письмо</h3>
				</div>

				{/* Email Header */}
				<div className="mb-6 space-y-3">
					{/* From */}
					<div
						className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
							hoveredFlag === "sender"
								? "border-error bg-error/10"
								: foundFlags.includes("sender")
									? "border-success bg-success/10"
									: "border-bg-surface-3 bg-bg-surface-2"
						}`}
						onClick={() => handleFlagClick("sender")}
						onMouseEnter={() =>
							setHoveredFlag(redFlags.find((f) => f.id === "sender") ? "sender" : null)
						}
						onMouseLeave={() => setHoveredFlag(null)}>
						<div className="text-xs text-text-muted mb-1">От кого:</div>
						<div className="text-sm font-medium text-text-primary">{from}</div>
					</div>

					{/* Subject */}
					<div className="p-3 rounded-lg border border-bg-surface-3 bg-bg-surface-2">
						<div className="text-xs text-text-muted mb-1">Тема:</div>
						<div className="text-sm font-medium text-text-primary">{subject}</div>
					</div>

					{/* Date */}
					<div className="p-3 rounded-lg border border-bg-surface-3 bg-bg-surface-2">
						<div className="text-xs text-text-muted mb-1">Дата:</div>
						<div className="text-sm text-text-secondary">{date}</div>
					</div>
				</div>

				{/* Email Body */}
				<div
					className="p-4 rounded-lg border border-bg-surface-3 bg-bg-base whitespace-pre-line text-sm text-text-primary leading-relaxed cursor-pointer"
					onClick={handleBodyClick}
					dangerouslySetInnerHTML={{ __html: highlightBody() }}
				/>

				{/* Instructions */}
				<div className="mt-6 p-4 rounded-lg bg-info/10 border border-info">
					<div className="flex items-start gap-3">
						<Eye size={20} className="text-info shrink-0 mt-0.5" />
						<div className="text-sm text-info">
							<p className="font-semibold mb-1">Кликай на подозрительные элементы</p>
							<p className="text-xs">Найди все {redFlags.length} красных флага, чтобы продолжить</p>
						</div>
					</div>
				</div>
			</div>

			{/* Sidebar: Red Flags */}
			<div className="w-full lg:w-80 space-y-4">
				{/* Progress */}
				<div className="surface-card p-4">
					<div className="flex items-center justify-between mb-3">
						<h4 className="font-bold text-text-primary">Найдено угроз</h4>
						<span className="text-sm font-mono text-text-secondary">
							{foundFlags.length}/{redFlags.length}
						</span>
					</div>
					<div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
						<motion.div
							className="motion-safe h-full bg-linear-to-r from-error via-warning to-success"
							initial={{ width: 0 }}
							animate={{ width: `${(foundFlags.length / redFlags.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Red Flags List */}
				<div className="surface-card p-4">
					<h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
						<AlertTriangle size={18} className="text-warning" />
						Красные флаги
					</h4>

					<div className="space-y-3">
						{redFlags.map((flag) => {
							const isFound = foundFlags.includes(flag.id);
							return (
								<motion.div
									key={flag.id}
									initial={{ opacity: 0.5 }}
									animate={{ opacity: isFound ? 1 : 0.5 }}
									className={`motion-safe p-3 rounded-lg border-2 cursor-pointer transition-all ${
										isFound
											? "border-success bg-success/10 text-success"
											: "border-bg-surface-3 bg-bg-surface-2 text-text-muted"
									}`}
									onClick={() => isFound && setSelectedFlag(flag)}>
									<div className="flex items-start gap-2">
										{isFound ? (
											<CheckCircle size={16} className="shrink-0 mt-0.5" />
										) : (
											<div className="w-4 h-4 rounded-full border-2 border-current shrink-0 mt-0.5" />
										)}
										<div className="flex-1 min-w-0">
											<div className="font-semibold text-sm">{flag.title}</div>
											{isFound && <div className="text-xs mt-1 opacity-80">Нажми для деталей</div>}
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Navigation Buttons */}
				<InteractiveNavigation
					onPrevious={onPrevious}
					canGoPrevious={canGoPrevious}
					onNext={onComplete}
					isCompleted={isComplete}
					lockedMessage="Найдите все угрозы"
				/>
			</div>

			{/* Modal: Flag Details */}
			<AnimatePresence>
				{selectedFlag && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
						onClick={() => setSelectedFlag(null)}>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className="surface-card max-w-lg w-full p-6"
							onClick={(e) => e.stopPropagation()}>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className={`p-2 rounded-lg ${getSeverityColor(selectedFlag.severity)}`}>
										<AlertTriangle size={24} />
									</div>
									<div>
										<h3 className="text-xl font-bold text-text-primary">{selectedFlag.title}</h3>
										<p className="text-xs text-text-muted uppercase tracking-wide">
											{selectedFlag.severity === "critical"
												? "Критическая угроза"
												: selectedFlag.severity === "high"
													? "Высокая угроза"
													: "Средняя угроза"}
										</p>
									</div>
								</div>
								<button
									onClick={() => setSelectedFlag(null)}
									className="p-2 hover:bg-bg-surface-2 rounded-lg transition-colors">
									<X size={20} className="text-text-muted" />
								</button>
							</div>

							<p className="text-text-primary leading-relaxed">{selectedFlag.description}</p>

							<button onClick={() => setSelectedFlag(null)} className="btn-primary w-full mt-6">
								Понятно
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Custom styles for highlights */}
			{/* Custom styles for highlights */}
			<style>{`
				.urgency-highlight {
					background-color: transparent;
					color: inherit;
					padding: 2px 4px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				.urgency-highlight:hover {
					background-color: rgba(var(--color-warning-rgb, 255, 193, 7), 0.1);
				}
				.link-highlight {
					background-color: transparent;
					color: inherit;
					padding: 2px 4px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.2s;
					text-decoration: underline;
				}
				.link-highlight:hover {
					background-color: rgba(var(--color-error-rgb, 244, 67, 54), 0.1);
				}
				.grammar-highlight {
					background-color: transparent;
					color: inherit;
					padding: 2px 4px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				.grammar-highlight:hover {
					background-color: rgba(var(--color-info-rgb, 33, 150, 243), 0.1);
				}
			`}</style>
		</div>
	);
};
