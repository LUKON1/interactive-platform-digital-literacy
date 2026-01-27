import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, ShieldAlert, ShieldCheck, ArrowLeft, ArrowRight, Lock } from "lucide-react";

export const PasswordBuilder = ({ onComplete, onPrevious, canGoPrevious, isCompleted, onNext }) => {
	// Pre-fill if completed to show success state
	const [password, setPassword] = useState(isCompleted ? "Correct-Horse-Battery-Staple!" : "");

	// Calculate strength (Mock logic)
	const calculateStrength = (pwd) => {
		let score = 0;
		if (pwd.length > 0) score += 5;
		if (pwd.length >= 8) score += 10;
		if (pwd.length >= 12) score += 20;
		if (pwd.length >= 20) score += 40; // Passphrase bonus

		if (/[A-Z]/.test(pwd)) score += 10;
		if (/[0-9]/.test(pwd)) score += 10;
		if (/[!@#$%^&*]/.test(pwd)) score += 10;

		// Passphrase detection (multiple words separated by non-letters)
		if (/([a-zA-Z]+[^a-zA-Z]+){3,}/.test(pwd) && pwd.length > 15) {
			score += 30;
		}

		return Math.min(100, score);
	};

	const strength = calculateStrength(password);
	const isComplete = strength === 100;

	// Simple crack time estimation (Mock for educational purposes)
	const getCrackTime = (score) => {
		if (score < 40) return "Мгновенно ⚠️";
		if (score < 60) return "5 минут 🕒";
		if (score < 80) return "3 дня 🗓️";
		if (score < 90) return "400 лет 🐢";
		return "5 миллионов лет 🛡️";
	};

	const [checkResult, setCheckResult] = useState(
		isCompleted ? { time: "5 миллионов лет 🛡️" } : null,
	); // null | { time: string }

	const handleCheck = () => {
		const time = getCrackTime(strength);
		setCheckResult({ time });
	};

	// If 'onComplete' is called, it means user is done reading the result
	const handleNext = () => {
		onComplete();
	};

	let StrengthIcon = Shield;
	let color = "text-text-muted";
	if (strength > 30) {
		StrengthIcon = ShieldAlert;
		color = "text-warning";
	}
	if (strength > 80) {
		StrengthIcon = ShieldCheck;
		color = "text-success";
	}

	return (
		<div className="w-full max-w-lg mx-auto">
			<div className="surface-card p-8 text-center mb-8">
				<motion.div
					className={`w-24 h-24 mx-auto mb-6 rounded-full bg-bg-surface-3 flex items-center justify-center ${color} transition-colors duration-500`}
					animate={{ scale: isComplete ? [1, 1.2, 1] : 1 }}>
					<StrengthIcon size={48} />
				</motion.div>

				<h3 className="text-2xl font-bold mb-2">Сила пароля: {strength}%</h3>
				<div className="h-4 w-full bg-bg-surface-3 rounded-full overflow-hidden mb-6">
					<motion.div
						className="h-full bg-linear-to-r from-error via-warning to-success"
						animate={{ width: `${strength}%` }}
					/>
				</div>

				<input
					type="text"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setCheckResult(null);
					}}
					placeholder="Создай надежный пароль или мнемофразу..."
					className="w-full bg-bg-base border border-bg-surface-3 rounded-xl px-4 py-3 text-xl text-center text-text-primary focus:outline-none focus:border-primary transition-all"
				/>

				<div className="mt-4 text-sm text-text-secondary text-left space-y-2">
					{password.length > 20 || /([a-zA-Z]+[^a-zA-Z]+){3,}/.test(password) ? (
						<p className="text-success font-bold">⚡ Отличный пароль! Такой не взломать</p>
					) : (
						<p className={password.length >= 12 ? "text-success" : ""}>
							• Длина 12+ символов (или 4+ слова)
						</p>
					)}
					<p className={/[A-Z]/.test(password) ? "text-success" : ""}>• Заглавная буква</p>
					<p className={/[0-9]/.test(password) ? "text-success" : ""}>• Цифра</p>
					<p className={/[!@#$%^&*]/.test(password) ? "text-success" : ""}>• Спецсимвол (!@#$%)</p>
				</div>

				{checkResult && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="mt-6 p-4 bg-bg-surface-2 rounded-xl border border-primary/20">
						<div className="text-sm text-text-secondary mb-1">Время на взлом (Брутфорс):</div>
						<div className="text-2xl font-bold text-primary">{checkResult.time}</div>
					</motion.div>
				)}
			</div>

			{!checkResult && (
				<button
					onClick={handleCheck}
					disabled={!isComplete}
					className={`btn-primary w-full py-4 text-lg font-bold transition-all ${
						!isComplete ? "opacity-50 cursor-not-allowed grayscale" : "animate-pulse"
					}`}>
					Проверить защиту
				</button>
			)}

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center gap-4 mt-8">
				{canGoPrevious ? (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onPrevious}
						className="btn-secondary flex items-center text-sm sm:text-base px-6 py-3">
						<ArrowLeft size={20} className="mr-2" />
						Назад
					</motion.button>
				) : (
					<div />
				)}

				<motion.button
					whileHover={isComplete && checkResult ? { scale: 1.05 } : {}}
					whileTap={isComplete && checkResult ? { scale: 0.95 } : {}}
					onClick={isComplete && checkResult ? onComplete : undefined}
					disabled={!isComplete || !checkResult}
					className={`flex items-center justify-center text-sm sm:text-base px-8 py-3 rounded-full transition-all ${
						isComplete && checkResult
							? "btn-primary shadow-lg shadow-primary/20"
							: "bg-bg-surface-2/50 text-text-muted cursor-not-allowed border-2 border-bg-surface-3"
					}`}>
					{isComplete && checkResult ? (
						<>
							Далее <ArrowRight size={20} className="ml-2" />
						</>
					) : (
						<>
							<Lock size={16} className="mr-2" />
							Проверьте пароль
						</>
					)}
				</motion.button>
			</div>
		</div>
	);
};
