import React, { useState } from "react";
import {
	Wifi,
	Lock,
	ShieldCheck,
	ShieldAlert,
	Smartphone,
	ArrowLeft,
	ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const WifiSimulator = ({ onComplete, onPrevious, canGoPrevious, isCompleted, onNext }) => {
	const [vpnEnabled, setVpnEnabled] = useState(false);
	const [selectedNetwork, setSelectedNetwork] = useState(null);
	const [feedback, setFeedback] = useState(isCompleted ? "success" : null);
	const [scanMode, setScanMode] = useState(false); // New: Scanner toggle

	const networks = [
		{
			id: 1,
			ssid: "Cafe_Summer_Free",
			secured: false,
			type: "trap",
			bssid: "02:00:00:00:01",
			security: "OPEN",
		},
		{
			id: 2,
			ssid: "Cafe_Summer_Official",
			secured: true,
			type: "safe",
			bssid: "AA:BB:CC:DD:EE",
			security: "WPA2",
		},
		// Evil Twin Scenario:
		{
			id: 3,
			ssid: "Free_Fast_WiFi",
			secured: true,
			type: "safe",
			bssid: "11:22:33:44:55",
			security: "WPA2",
		},
		{
			id: 4,
			ssid: "Free_Fast_WiFi",
			secured: false,
			type: "trap",
			bssid: "DE:AD:BE:EF:00",
			security: "OPEN",
		},
	];

	const handleConnect = (network) => {
		setSelectedNetwork(network.id);

		if (vpnEnabled) {
			setFeedback("success");
		} else {
			if (network.type === "trap") {
				setFeedback("error");
			} else {
				setFeedback("warning");
			}
		}
	};

	const isSuccess = feedback === "success" || feedback === "warning";

	return (
		<div className="flex flex-col w-full max-w-4xl mx-auto items-center">
			<div className="w-full max-w-md md:max-w-lg bg-gray-900 border-4 border-gray-700 rounded-3xl overflow-hidden shadow-2xl relative mx-auto my-8">
				{/* Phone Header */}
				<div className="bg-gray-800 p-4 flex justify-between items-center text-sm text-gray-400">
					<span>12:30</span>
					<div className="flex gap-2">
						<Wifi size={16} />
						<div className="w-5 h-2.5 bg-green-500 rounded-sm"></div>
					</div>
				</div>

				{/* Screen Content */}
				<div className="p-6 md:p-8 h-125 md:h-137.5 flex flex-col relative">
					{/* VPN Toggle - Big Card Style */}
					<button
						onClick={() => setVpnEnabled(!vpnEnabled)}
						className={`
                        w-full mb-6 p-4 rounded-2xl flex items-center justify-between transition-all duration-300 border-2
                        ${
													vpnEnabled
														? "bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
														: "bg-gray-800 border-gray-700 hover:bg-gray-750"
												}
                    `}>
						<div className="flex items-center gap-4">
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
									vpnEnabled ? "bg-green-500 text-gray-900" : "bg-gray-700 text-gray-400"
								}`}>
								<ShieldCheck size={28} />
							</div>
							<div className="text-left">
								<div
									className={`font-bold text-lg ${vpnEnabled ? "text-green-400" : "text-white"}`}>
									VPN {vpnEnabled ? "АКТИВЕН" : "ОТКЛЮЧЕН"}
								</div>
								<div className="text-[10px] text-gray-400">
									{vpnEnabled ? "Трафик зашифрован" : "Нажмите для защиты"}
								</div>
							</div>
						</div>
						<div
							className={`w-14 h-8 rounded-full p-1 transition-colors ${vpnEnabled ? "bg-green-500" : "bg-gray-600"}`}>
							<motion.div
								layout
								className="w-6 h-6 bg-white rounded-full shadow-sm"
								animate={{ x: vpnEnabled ? 24 : 0 }}
							/>
						</div>
					</button>

					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 uppercase text-sm font-bold tracking-wider text-left">
							Wi-Fi Сети
						</h3>
						<button
							onClick={() => setScanMode(!scanMode)}
							className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${scanMode ? "bg-blue-500/20 border-blue-500 text-blue-400" : "border-gray-600 text-gray-500 hover:text-white"}`}>
							{scanMode ? "СКАНЕР ВКЛ" : "СКАНЕР"}
						</button>
					</div>

					<div className="space-y-3 overflow-y-auto max-h-60 md:max-h-70 pr-1">
						{networks.map((net) => (
							<button
								key={net.id}
								onClick={() => handleConnect(net)}
								className={`w-full p-4 rounded-xl flex items-center justify-between transition-all border text-left min-h-16
                        ${
													selectedNetwork === net.id
														? "border-blue-500 bg-blue-500/10"
														: "border-gray-700 bg-gray-800 hover:bg-gray-750"
												}
                     `}>
								<div className="flex items-center gap-3 w-full">
									<Wifi size={22} className={net.secured ? "text-white" : "text-yellow-500"} />
									<div className="w-full">
										<div className="flex justify-between items-center w-full">
											<div className="text-base md:text-lg font-bold text-white">{net.ssid}</div>
											{/* Lock icon moved here for better layout */}
											{net.secured && !scanMode && <Lock size={14} className="text-gray-500" />}
										</div>

										{scanMode ? (
											<div className="flex justify-between items-center mt-1.5 text-[10px] md:text-xs font-mono text-gray-400 bg-black/30 p-1.5 rounded">
												<span>MAC: {net.bssid}</span>
												<span
													className={net.security === "OPEN" ? "text-red-400" : "text-green-400"}>
													{net.security}
												</span>
											</div>
										) : (
											<div className="text-xs text-gray-400">
												{net.secured ? "Защищено" : "Открытая сеть"}
											</div>
										)}
									</div>
								</div>
							</button>
						))}
					</div>

					{/* Feedback Overlay - Full Screen Modal */}
					<AnimatePresence>
						{feedback === "error" && (
							<motion.div
								initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
								animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
								exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
								className="absolute inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center text-center p-6">
								<motion.div
									initial={{ scale: 0.5, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
									<ShieldAlert size={48} className="text-red-500" />
								</motion.div>
								<h3 className="text-2xl font-bold text-red-500 mb-2">ОПАСНО!</h3>
								<p className="text-gray-300 mb-6 leading-relaxed">
									Эта сеть открыта! Хакер перехватил твои пароли.
									<br />
									<span className="text-sm text-gray-500 mt-2 block">
										Всегда включай VPN в кафе.
									</span>
								</p>
								<button
									onClick={() => setFeedback(null)}
									className="bg-gray-700 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-600 transition-colors shadow-lg border border-gray-600">
									Попробовать снова
								</button>
							</motion.div>
						)}

						{feedback === "success" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 z-50 bg-emerald-900/95 flex flex-col items-center justify-center text-center p-6 border-4 border-emerald-500/30 rounded-2xl">
								<motion.div
									initial={{ scale: 0.5 }}
									animate={{ scale: 1 }}
									className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
									<ShieldCheck size={56} className="text-white" />
								</motion.div>
								<h3 className="text-3xl font-bold text-white mb-2">ОТЛИЧНО!</h3>
								<p className="text-emerald-100 mb-0">Трафик зашифрован.</p>
							</motion.div>
						)}

						{feedback === "warning" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center text-center p-6">
								<div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
									<Lock size={48} className="text-amber-500" />
								</div>
								<h3 className="text-2xl font-bold text-amber-500 mb-2">Нормально</h3>
								<p className="text-gray-300 mb-6">
									Сеть защищена паролем, но VPN все равно надежнее.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center gap-4 mt-8 px-4">
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
					whileHover={isSuccess ? { scale: 1.05 } : {}}
					whileTap={isSuccess ? { scale: 0.95 } : {}}
					onClick={isSuccess ? onComplete : undefined}
					disabled={!isSuccess}
					className={`flex items-center justify-center text-sm sm:text-base px-8 py-3 rounded-full transition-all ${
						isSuccess
							? "btn-primary shadow-lg shadow-primary/20"
							: "bg-bg-surface-2/50 text-text-muted cursor-not-allowed border-2 border-bg-surface-3"
					}`}>
					{isSuccess ? (
						<>
							Далее <ArrowRight size={20} className="ml-2" />
						</>
					) : (
						<>
							<Lock size={16} className="mr-2" />
							Выберите сеть
						</>
					)}
				</motion.button>
			</div>
		</div>
	);
};
