import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

export const ImageQuiz = ({ onComplete, data }) => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [showFeedback, setShowFeedback] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);

	const handleOptionSelect = (option) => {
		setSelectedOption(option);
		setIsCorrect(option.correct);
		setShowFeedback(true);
	};

	const handleNext = () => {
		if (isCorrect) {
			onComplete();
		} else {
			// Reset для повторной попытки
			setSelectedOption(null);
			setShowFeedback(false);
			setIsCorrect(false);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			{/* Title and Description */}
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-text-primary mb-3">{data.title}</h2>
				<p className="text-lg text-text-secondary">{data.description}</p>
			</div>

			{/* Image Display */}
			{data.image && (
				<div className="surface-card p-4 mb-8">
					<img
						src={data.image}
						alt="WiFi Networks Screenshot"
						className="w-full rounded-lg border border-bg-surface-3"
					/>
				</div>
			)}

			{/* Options List */}
			<div className="space-y-4 mb-8">
				{data.options.map((option) => (
					<button
						key={option.id}
						onClick={() => !showFeedback && handleOptionSelect(option)}
						disabled={showFeedback}
						className={`
							w-full p-5 rounded-xl text-left transition-all border-2 relative overflow-hidden
							${
								selectedOption?.id === option.id
									? isCorrect
										? "border-success bg-success/10"
										: "border-error bg-error/10"
									: "border-bg-surface-3 bg-bg-surface-2 hover:bg-bg-surface-3"
							}
							${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}
						`}>
						<div className="flex items-start gap-4">
							{/* Radio indicator */}
							<div
								className={`
									w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1
									${
										selectedOption?.id === option.id
											? isCorrect
												? "border-success bg-success"
												: "border-error bg-error"
											: "border-bg-surface-3"
									}
								`}>
								{selectedOption?.id === option.id && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="w-3 h-3 rounded-full bg-white"
									/>
								)}
							</div>

							{/* Option text */}
							<div className="flex-1">
								<p className="text-base font-medium text-text-primary leading-relaxed">
									{option.label}
								</p>
							</div>

							{/* Icon for correct/incorrect */}
							{showFeedback && selectedOption?.id === option.id && (
								<motion.div
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									className="shrink-0">
									{isCorrect ? (
										<CheckCircle className="text-success" size={28} />
									) : (
										<XCircle className="text-error" size={28} />
									)}
								</motion.div>
							)}
						</div>
					</button>
				))}
			</div>

			{/* Feedback Panel */}
			<AnimatePresence>
				{showFeedback && selectedOption && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className={`
							p-6 rounded-xl border-l-4 mb-8
							${isCorrect ? "bg-success/10 border-success" : "bg-error/10 border-error"}
						`}>
						<div className="flex items-start gap-4">
							{isCorrect ? (
								<CheckCircle className="text-success shrink-0 mt-1" size={24} />
							) : (
								<XCircle className="text-error shrink-0 mt-1" size={24} />
							)}
							<div className="flex-1">
								<h3
									className={`font-bold text-lg mb-2 ${isCorrect ? "text-success" : "text-error"}`}>
									{isCorrect ? "Правильно!" : "Неправильно"}
								</h3>
								<p className="text-text-secondary leading-relaxed">{selectedOption.feedback}</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Action Button */}
			{showFeedback && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex justify-center">
					<button
						onClick={handleNext}
						className={`
							px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-2 transition-all
							${
								isCorrect
									? "btn-primary shadow-lg shadow-primary/20"
									: "bg-bg-surface-3 text-text-primary hover:bg-bg-surface-2"
							}
						`}>
						{isCorrect ? "Продолжить" : "Попробовать снова"}
						<ArrowRight size={20} />
					</button>
				</motion.div>
			)}
		</div>
	);
};
