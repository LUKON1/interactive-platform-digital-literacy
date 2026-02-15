import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	Copy,
	ArrowRight,
	ShieldAlert,
	CheckCircle,
	Smartphone,
	AlertTriangle,
	Clipboard,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const CryptoTransactor = ({ data, onComplete, onPrevious, canGoPrevious }) => {
	const [step, setStep] = useState("start"); // start, copying, input, success, fail, fixed
	const [inputAddress, setInputAddress] = useState("");
	const [clipboard, setClipboard] = useState("");
	const [hasPasted, setHasPasted] = useState(false);

	// Game/Level data
	const targetAddress = data?.targetAddress || "0x71C...9A2";
	const spoofedAddress = data?.spoofedAddress || "0x71C...8B1"; // Looks similar but different end
	const amount = data?.amount || "0.5 ETH";

	const handleCopy = () => {
		setClipboard(spoofedAddress); // The malware mechanic: copy the WRONG address
		setStep("input");
	};

	// Simulate manual paste
	const handlePasteClick = () => {
		if (!clipboard) return;
		setInputAddress(clipboard);
		setHasPasted(true);
	};

	const handleSend = () => {
		if (inputAddress === targetAddress) {
			setStep("success");
		} else {
			setStep("fail");
		}
	};

	const handleReport = () => {
		if (inputAddress === spoofedAddress) {
			// Correctly identified the malware
			setInputAddress(targetAddress); // Fix it for them as a reward
			setStep("fixed");
		} else {
			// Reported a valid address? (Unlikely flow here, but safe to handle)
			setStep("fail");
		}
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-1 w-full max-w-md mx-auto surface-card border border-bg-surface-3 overflow-hidden shadow-2xl flex flex-col">
				{/* Mobile Header Simulator */}
				<div className="bg-bg-surface-2 px-6 py-4 border-b border-bg-surface-3 flex justify-between items-center shrink-0">
					<div className="flex items-center gap-2">
						<Smartphone size={18} className="text-text-secondary" />
						<span className="font-bold text-sm text-text-primary tracking-wide">CryptoWallet</span>
					</div>
					<div className="text-xs text-text-muted font-mono bg-bg-surface-3 px-2 py-1 rounded-md">
						Testnet
					</div>
				</div>

				<div className="p-6 relative flex-1 flex flex-col justify-center min-h-100">
					<AnimatePresence mode="wait">
						{/* STEP 1: Task Description */}
						{step === "start" && (
							<motion.div
								key="start"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="space-y-8">
								<div className="text-center space-y-3">
									<h3 className="text-2xl font-bold text-text-primary">Перевод другу</h3>
									<p className="text-text-secondary text-base leading-relaxed">
										Вам нужно перевести <strong>{amount}</strong> на кошелек друга.
									</p>
								</div>

								<div className="bg-bg-surface-2 p-5 rounded-2xl border border-bg-surface-3 space-y-3">
									<div className="text-xs text-text-muted uppercase tracking-wider font-bold">
										Реквизиты друга
									</div>
									<div className="flex items-center justify-between bg-bg-base p-4 rounded-xl border border-bg-surface-3 group">
										<code className="text-lg font-mono text-primary">{targetAddress}</code>
										<button
											onClick={handleCopy}
											className="p-3 hover:bg-bg-surface-3 rounded-xl transition-colors text-text-secondary hover:text-white"
											title="Скопировать">
											<Copy size={20} />
										</button>
									</div>
									<p className="text-xs text-text-muted text-center">
										Нажмите кнопку, чтобы скопировать адрес
									</p>
								</div>
							</motion.div>
						)}

						{/* STEP 2: The Inputs */}
						{(step === "input" || step === "fixed") && (
							<motion.div
								key="input"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-8">
								<div className="space-y-6">
									<div>
										<label className="text-xs font-bold text-text-muted mb-2 block uppercase">
											Адрес получателя
										</label>
										<div className="relative group">
											<input
												type="text"
												value={inputAddress}
												readOnly
												placeholder="Нажмите для вставки"
												onClick={!hasPasted ? handlePasteClick : undefined}
												className={clsx(
													"w-full bg-bg-base border-2 rounded-xl p-4 text-base font-mono transition-all cursor-pointer focus:outline-hidden",
													step === "fixed"
														? "border-success text-success bg-success/5"
														: "border-bg-surface-3 text-text-primary hover:border-primary/50",
												)}
											/>
											{!hasPasted && (
												<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
													<div className="bg-bg-surface-3/80 backdrop-blur-xs px-3 py-1 rounded-lg text-xs font-mono text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
														<Clipboard size={12} className="inline mr-1" />
														Вставить из буфера
													</div>
												</div>
											)}
										</div>
									</div>

									<div>
										<label className="text-xs font-bold text-text-muted mb-2 block uppercase">
											Сумма
										</label>
										<div className="w-full bg-bg-base border border-bg-surface-3 rounded-xl p-4 text-lg font-medium text-text-primary flex justify-between items-center">
											<span>{amount}</span>
											<span className="text-text-muted text-sm">~$1000</span>
										</div>
									</div>
								</div>

								{hasPasted && step !== "fixed" && (
									<div className="grid grid-cols-2 gap-3 pt-2">
										<button
											onClick={handleReport}
											className="py-4 rounded-xl bg-bg-surface-2 hover:bg-error/20 hover:text-error text-text-muted font-bold transition-all border border-bg-surface-3 flex items-center justify-center gap-2 text-sm">
											<AlertTriangle size={18} />
											Это не тот адрес!
										</button>

										<button
											onClick={handleSend}
											className="py-4 rounded-xl bg-primary hover:brightness-110 text-on-primary font-bold transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 text-sm">
											<ArrowRight size={18} />
											Отправить
										</button>
									</div>
								)}

								{step === "fixed" && (
									<div className="space-y-4">
										<div className="bg-success/10 border border-success/20 rounded-xl p-3 flex items-start gap-3">
											<CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
											<div className="text-sm text-text-primary">
												<span className="font-bold text-success block mb-1">Вирус перехвачен!</span>
												Вы заметили подмену и восстановили верный адрес. Теперь можно отправлять.
											</div>
										</div>
										<button
											onClick={handleSend}
											className="w-full py-4 rounded-xl bg-success hover:brightness-110 text-on-secondary font-bold transition-all shadow-lg shadow-success/20 active:scale-95 flex items-center justify-center gap-2">
											<ArrowRight size={20} />
											Отправить безопасно
										</button>
									</div>
								)}
							</motion.div>
						)}

						{/* STEP 3: Results */}
						{step === "success" && (
							<motion.div
								key="success"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="text-center space-y-6">
								<div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto shadow-xl shadow-success/10 mb-6">
									<CheckCircle size={48} strokeWidth={3} />
								</div>
								<div className="space-y-3">
									<h3 className="text-3xl font-bold text-text-primary">Перевод успешен</h3>
									<p className="text-text-secondary text-lg">
										Средства ушли на верный адрес. Ваша внимательность спасла ваши деньги!
									</p>
								</div>
							</motion.div>
						)}

						{step === "fail" && (
							<motion.div
								key="fail"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="text-center space-y-6">
								<div className="w-24 h-24 bg-error/20 text-error rounded-full flex items-center justify-center mx-auto shadow-xl shadow-error/10 mb-6">
									<ShieldAlert size={48} strokeWidth={3} />
								</div>
								<div className="space-y-3">
									<h3 className="text-3xl font-bold text-error">Деньги потеряны</h3>
									<p className="text-text-secondary text-lg">
										Вы отправили средства на адрес хакера.
										<br />
										<span className="text-text-muted text-sm mt-2 block">
											Адреса отличались всего несколькими символами.
										</span>
									</p>
								</div>
								<div className="pt-4">
									<button
										onClick={() => {
											setStep("start");
											setInputAddress("");
											setClipboard("");
											setHasPasted(false);
										}}
										className="px-8 py-3 bg-bg-surface-3 rounded-full text-text-primary font-bold hover:bg-bg-surface-2 transition-colors border border-bg-surface-3">
										Попробовать еще раз
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Navigation Footer */}
			<div className="max-w-4xl mx-auto w-full">
				<InteractiveNavigation
					onPrevious={onPrevious}
					canGoPrevious={canGoPrevious}
					onNext={onComplete}
					isCompleted={step === "success"}
					lockedMessage="Завершите перевод"
				/>
			</div>
		</div>
	);
};
