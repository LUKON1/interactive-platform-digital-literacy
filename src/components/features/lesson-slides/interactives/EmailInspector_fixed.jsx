import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, AlertTriangle, CheckCircle, X, Eye } from "lucide-react";

export const EmailInspector = ({ onComplete, data }) => {
	const { from, subject, date, body, redFlags } = data;

	const [foundFlags, setFoundFlags] = useState([]);
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
<div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6">
			{/* Email Display */}
			<div className="flex-1 surface-card p-4 sm:p-6 overflow-hidden">
				<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-bg-surface-3">
					<Mail className="text-primary" size={20} />
					<h3 className="text-base sm:text-lg md:text-xl font-bold text-text-primary">Входящее письмо</h3>
				</div>

				{/* Email Header */}
				<div className="mb-3 sm:mb-4 space-y-2">
					{/* From */}
					<div
						className={`p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer ${
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
						<div className="text-xs text-text-muted mb-0.5">От кого:</div>
						<div className="text-xs sm:text-sm font-medium text-text-primary break-all">{from}</div>
					</div>

					{/* Subject */}
					<div className="p-2 sm:p-3 rounded-lg border border-bg-surface-3 bg-bg-surface-2">
						<div className="text-xs text-text-muted mb-0.5">Тема:</div>
						<div className="text-xs sm:text-sm font-medium text-text-primary">{subject}</div>
					</div>

					{/* Date */}
					<div className="p-2 sm:p-3 rounded-lg border border-bg-surface-3 bg-bg-surface-2">
						<div className="text-xs text-text-muted mb-0.5">Дата:</div>
						<div className="text-xs sm:text-sm text-text-secondary">{date}</div>
					</div>
				</div>

				{/* Email Body */}
				<div
					className="p-3 sm:p-4 rounded-lg border border-bg-surface-3 bg-bg-base whitespace-pre-line text-xs sm:text-sm text-text-primary leading-relaxed cursor-pointer max-h-[30vh] sm:max-h-[35vh] overflow-y-auto"
					onClick={handleBodyClick}
					dangerouslySetInnerHTML={{ __html: highlightBody() }}
				/>

				{/* Instructions */}
				<div className="mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg bg-info/10 border border-info">
					<div className="flex items-start gap-2">
						<Eye size={16} className="text-info shrink-0 mt-0.5 sm:w-5 sm:h-5" />
						<div className="text-xs sm:text-sm text-info">
							<p className="font-semibold">Кликай на подозрительные элементы</p>
							<p className="text-xs mt-0.5">Найди все {redFlags.length} красных флага</p>
						</div>
					</div>
				</div>
			</div>

			{/* Sidebar: Red Flags */}
			<div className="w-full lg:w-80 space-y-3 sm:space-y-4">
				{/* Progress */}
				<div className="surface-card p-3 sm:p-4">
					<div className="flex items-center justify-between mb-2 sm:mb-3">
						<h4 className="text-sm sm:text-base font-bold text-text-primary">Найдено угроз</h4>
						<span className="text-xs sm:text-sm font-mono text-text-secondary">
							{foundFlags.length}/{redFlags.length}
						</span>
					</div>
					<div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-linear-to-r from-error via-warning to-success"
							initial={{ width: 0 }}
							animate={{ width: `${(foundFlags.length / redFlags.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Red Flags List */}
				<div className="surface-card p-3 sm:p-4">
					<h4 className="text-sm sm:text-base font-bold text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
						<AlertTriangle size={16} className="text-warning sm:w-4.5 sm:h-4.5" />
						Красные флаги
					</h4>

					<div className="space-y-2 sm:space-y-3">
						{redFlags.map((flag) => {
							const isFound = foundFlags.includes(flag.id);
							return (
<motion.div
									key={flag.id}
									initial={{ opacity: 0.5 }}
									animate={{ opacity: isFound ? 1 : 0.5 }}
									className={`p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
isFound
? "border-success bg-success/10 text-success"
: "border-bg-surface-3 bg-bg-surface-2 text-text-muted"
}`}
									onClick={() => isFound && setSelectedFlag(flag)}>
									<div className="flex items-start gap-2">
										{isFound ? (
<CheckCircle size={14} className="shrink-0 mt-0.5 sm:w-4 sm:h-4" />
										) : (
<div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-current shrink-0 mt-0.5" />
										)}
										<div className="flex-1 min-w-0">
											<div className="font-semibold text-xs sm:text-sm">{flag.title}</div>
											{isFound && <div className="text-xs mt-0.5 opacity-80">Нажми для деталей</div>}
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Complete Button */}
				{isComplete && (
					<motion.button
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						onClick={onComplete}
						className="btn-primary w-full py-3 sm:py-4 bg-success hover:bg-success/90 text-sm sm:text-base">
						<CheckCircle size={18} className="mr-2 sm:w-5 sm:h-5" />
						Все угрозы найдены!
					</motion.button>
				)}
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
							className="surface-card max-w-lg w-full p-4 sm:p-6"
							onClick={(e) => e.stopPropagation()}>
							<div className="flex items-start justify-between mb-3 sm:mb-4">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className={`p-1.5 sm:p-2 rounded-lg ${getSeverityColor(selectedFlag.severity)}`}>
										<AlertTriangle size={20} className="sm:w-6 sm:h-6" />
									</div>
									<div>
										<h3 className="text-lg sm:text-xl font-bold text-text-primary">{selectedFlag.title}</h3>
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
									<X size={18} className="text-text-muted sm:w-5 sm:h-5" />
								</button>
							</div>

							<p className="text-sm sm:text-base text-text-primary leading-relaxed">{selectedFlag.description}</p>

							<button onClick={() => setSelectedFlag(null)} className="btn-primary w-full mt-4 sm:mt-6 text-sm sm:text-base">
								Понятно
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Custom styles for highlights */}
			<style jsx>{`
				:global(.urgency-highlight) {
					background-color: rgba(var(--color-warning-rgb, 255, 193, 7), 0.3);
					padding: 2px 4px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				:global(.urgency-highlight:hover) {
					background-color: rgba(var(--color-warning-rgb, 255, 193, 7), 0.5);
				}
				:global(.link-highlight) {
					background-color: rgba(var(--color-error-rgb, 244, 67, 54), 0.3);
					padding: 2px 4px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.2s;
					text-decoration: underline;
				}
				:global(.link-highlight:hover) {
					background-color: rgba(var(--color-error-rgb, 244, 67, 54), 0.5);
				}
				:global(.grammar-highlight) {
					background-color: rgba(var(--color-info-rgb, 33, 150, 243), 0.3);
					padding: 2px 4px;
					border-radius: 4px;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				:global(.grammar-highlight:hover) {
					background-color: rgba(var(--color-info-rgb, 33, 150, 243), 0.5);
				}
			`}</style>
		</div>
	);
};
