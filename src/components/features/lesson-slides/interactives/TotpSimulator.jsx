import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	Timer,
	Smartphone,
	CheckCircle,
	RefreshCw,
	ShieldCheck,
	ArrowLeft,
	ArrowRight,
	Lock,
} from "lucide-react";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const TotpSimulator = ({ onComplete, onPrevious, canGoPrevious, isCompleted, onNext }) => {
	const [timeLeft, setTimeLeft] = useState(30);
	const [serverCode, setServerCode] = useState(generateCode());
	const [input, setInput] = useState("");
	const [isSuccess, setIsSuccess] = useState(isCompleted || false);
	const [error, setError] = useState(null);

	function generateCode() {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}

	useEffect(() => {
		if (isSuccess || isCompleted) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					// Code expired
					setServerCode(generateCode());
					return 30;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isSuccess, isCompleted]);

	// Handle input change
	const handleChange = (e) => {
		const val = e.target.value.replace(/\D/g, "").slice(0, 6);
		setInput(val);
		setError(null);

		if (val.length === 6) {
			if (val === serverCode) {
				setIsSuccess(true);
			} else {
				setError("Неверный код! Возможно, он уже успел обновиться?");
				// Simple shake efffect logic could be added here
			}
		}
	};

	return (
		<div className="flex flex-col w-full max-w-6xl mx-auto h-full p-4">
			<div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 relative w-full">
				{isSuccess ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center justify-center p-8 text-center bg-gray-900/50 rounded-3xl border border-bg-surface-3 backdrop-blur-sm motion-safe">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1, rotate: 360 }}
							transition={{ type: "spring", stiffness: 200, damping: 20 }}
							className="text-success mb-6">
							<CheckCircle size={80} />
						</motion.div>
						<h2 className="text-3xl font-bold text-text-primary mb-4">Доступ разрешен!</h2>
						<p className="text-text-secondary text-center max-w-md mb-8 text-lg">
							Вы успели ввести код. Такие коды живут всего 30 секунд, поэтому украсть их очень
							сложно.
						</p>
					</motion.div>
				) : (
					<>
						{/* Virtual Phone */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							className="w-72 bg-black rounded-[3rem] p-4 border-4 border-gray-800 shadow-2xl relative motion-safe">
							{/* Notch */}
							<div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-10" />

							{/* Screen */}
							<div className="h-125 bg-bg-surface-2 rounded-[2.5rem] overflow-hidden flex flex-col relative text-white">
								{/* App Header */}
								<div className="bg-gray-900 p-6 pt-12 pb-4 flex items-center justify-between">
									<span className="font-bold text-lg">Authenticator</span>
									<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs">
										Me
									</div>
								</div>

								{/* Code Item */}
								<div className="p-4 bg-gray-800 m-4 rounded-xl flex items-center justify-between">
									<div>
										<div className="text-xs text-gray-400">Digital Fortress</div>
										<div className="text-2xl font-mono tracking-widest text-blue-400 font-bold mt-1">
											{serverCode.slice(0, 3)} {serverCode.slice(3)}
										</div>
									</div>
									<div className="relative w-8 h-8 flex items-center justify-center">
										{/* Timer Circle */}
										<svg className="w-full h-full -rotate-90">
											<circle
												cx="16"
												cy="16"
												r="14"
												stroke="currentColor"
												className="text-gray-700"
												strokeWidth="3"
												fill="none"
											/>
											<motion.circle
												cx="16"
												cy="16"
												r="14"
												stroke="currentColor"
												className="text-blue-500"
												strokeWidth="3"
												fill="none"
												strokeDasharray={88}
												animate={{ strokeDashoffset: 88 - (88 * timeLeft) / 30 }}
												transition={{ duration: 1, ease: "linear" }}
											/>
										</svg>
										<span className="absolute text-[10px] font-mono">{timeLeft}</span>
									</div>
								</div>

								<div className="mt-auto p-4 text-center text-gray-500 text-xs pb-8">
									Codes refresh automatically
								</div>
							</div>
						</motion.div>

						{/* Login Form */}
						<div className="flex-1 max-w-sm">
							<div className="surface-card p-8 border border-bg-surface-3">
								<div className="w-16 h-16 bg-bg-surface-3 rounded-full mx-auto mb-6 flex items-center justify-center">
									<ShieldCheck size={32} className="text-primary" />
								</div>
								<h2 className="text-2xl font-bold text-center mb-2">Двухэтапная проверка</h2>
								<p className="text-text-secondary text-center text-sm mb-6">
									Введите 6-значный код из приложения Authenticator.
								</p>

								<div className="mb-6 relative">
									<input
										type="text"
										value={input}
										onChange={handleChange}
										placeholder="000 000"
										maxLength={6}
										className={`
                                w-full bg-bg-base border rounded-xl px-4 py-4 text-2xl font-mono text-center tracking-[0.5em] focus:outline-none transition-all
                                ${error ? "border-error text-error" : "border-bg-surface-3 focus:border-primary"}
                            `}
									/>
									{error && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-error text-xs mt-2 text-center absolute -bottom-6 w-full">
											{error}
										</motion.div>
									)}
								</div>
							</div>
							<p className="text-center text-text-muted text-sm mt-6 max-w-xs mx-auto">
								<Timer size={14} className="inline mr-1" />
								Поторопитесь! Код обновится через {timeLeft} сек.
							</p>
						</div>
					</>
				)}
			</div>
			{/* Navigation Buttons */}
			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isSuccess}
				lockedMessage="Введите код"
			/>
		</div>
	);
};
