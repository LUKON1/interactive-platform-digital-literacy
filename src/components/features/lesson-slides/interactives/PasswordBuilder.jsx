import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export const PasswordBuilder = ({ onComplete }) => {
	const [password, setPassword] = useState("");

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

	let StrengthIcon = Shield;
	let color = "text-[var(--color-text-muted)]";
	if (strength > 30) {
		StrengthIcon = ShieldAlert;
		color = "text-[var(--color-warning)]";
	}
	if (strength > 80) {
		StrengthIcon = ShieldCheck;
		color = "text-[var(--color-success)]";
	}

	return (
		<div className="w-full max-w-lg mx-auto">
			<div className="surface-card p-8 text-center mb-8">
				<motion.div
					className={`w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-bg-surface-3)] flex items-center justify-center ${color} transition-colors duration-500`}
					animate={{ scale: isComplete ? [1, 1.2, 1] : 1 }}>
					<StrengthIcon size={48} />
				</motion.div>

				<h3 className="text-2xl font-bold mb-2">Сила пароля: {strength}%</h3>
				<div className="h-4 w-full bg-[var(--color-bg-surface-3)] rounded-full overflow-hidden mb-6">
					<motion.div
						className="h-full bg-gradient-to-r from-[var(--color-error)] via-[var(--color-warning)] to-[var(--color-success)]"
						animate={{ width: `${strength}%` }}
					/>
				</div>

				<input
					type="text"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Введите пароль..."
					className="w-full bg-[var(--color-bg-base)] border border-[var(--color-bg-surface-3)] rounded-xl px-4 py-3 text-xl text-center text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all"
				/>

				<div className="mt-4 text-sm text-[var(--color-text-secondary)] text-left space-y-2">
					{password.length > 20 || /([a-zA-Z]+[^a-zA-Z]+){3,}/.test(password) ? (
						<p className="text-[var(--color-success)] font-bold">✨ Похоже на мощную мнемофразу!</p>
					) : (
						<p className={password.length >= 12 ? "text-[var(--color-success)]" : ""}>
							• Длина 12+ символов (или 4+ слова)
						</p>
					)}
					<p className={/[A-Z]/.test(password) ? "text-[var(--color-success)]" : ""}>
						• Заглавная буква
					</p>
					<p className={/[0-9]/.test(password) ? "text-[var(--color-success)]" : ""}>• Цифра</p>
					<p className={/[!@#$%^&*]/.test(password) ? "text-[var(--color-success)]" : ""}>
						• Спецсимвол (!@#$%)
					</p>
				</div>
			</div>

			<button
				onClick={onComplete}
				disabled={!isComplete}
				className={`btn-primary w-full py-4 text-lg font-bold transition-all ${!isComplete ? "opacity-50 cursor-not-allowed grayscale" : "animate-pulse"}`}>
				Проверить защиту
			</button>
		</div>
	);
};
