import React, { useState } from "react";
import { Wifi, Lock, ShieldCheck, ShieldAlert, Smartphone } from "lucide-react";
import { motion } from "motion/react";

export const WifiSimulator = ({ onComplete }) => {
	const [vpnEnabled, setVpnEnabled] = useState(false);
	const [selectedNetwork, setSelectedNetwork] = useState(null);
	const [feedback, setFeedback] = useState(null); // 'success' | 'error'

	const networks = [
		{ id: 1, ssid: "Cafe_Summer_Free", secured: false, type: "trap" },
		{ id: 2, ssid: "Cafe_Summer_Official", secured: true, type: "safe" },
		{ id: 3, ssid: "Free_Fast_Internet", secured: false, type: "trap" },
	];

	const handleConnect = (network) => {
		setSelectedNetwork(network.id);

		if (vpnEnabled) {
			setFeedback("success");
			setTimeout(onComplete, 2000);
		} else {
			if (network.type === "trap") {
				setFeedback("error");
			} else {
				// Even official networks are safer with VPN, but let's say it's OK-ish
				setFeedback("warning"); // or success if lenient
				setTimeout(onComplete, 2000);
			}
		}
	};

	return (
		<div className="w-full max-w-sm bg-gray-900 border-4 border-gray-700 rounded-3xl overflow-hidden shadow-2xl relative">
			{/* Phone Header */}
			<div className="bg-gray-800 p-4 flex justify-between items-center text-xs text-gray-400">
				<span>12:30</span>
				<div className="flex gap-1">
					<Wifi size={14} />
					<div className="w-4 h-2 bg-green-500 rounded-sm"></div>
				</div>
			</div>

			{/* Screen Content */}
			<div className="p-6 h-[400px] flex flex-col relative">
				{/* VPN Toggle */}
				<div className="mb-6 bg-gray-800 p-4 rounded-xl flex items-center justify-between">
					<div className="flex items-center gap-3">
						<ShieldCheck size={20} className={vpnEnabled ? "text-green-400" : "text-gray-500"} />
						<span className="font-bold text-white">VPN Protection</span>
					</div>
					<button
						onClick={() => setVpnEnabled(!vpnEnabled)}
						className={`w-12 h-6 rounded-full p-1 transition-colors ${vpnEnabled ? "bg-green-500" : "bg-gray-600"}`}>
						<motion.div
							layout
							className="w-4 h-4 bg-white rounded-full"
							animate={{ x: vpnEnabled ? 24 : 0 }}
						/>
					</button>
				</div>

				<h3 className="text-gray-400 uppercase text-xs font-bold mb-3 tracking-wider">
					Wi-Fi Networks
				</h3>

				<div className="space-y-3">
					{networks.map((net) => (
						<button
							key={net.id}
							onClick={() => handleConnect(net)}
							className={`w-full p-4 rounded-xl flex items-center justify-between transition-all border
                        ${
													selectedNetwork === net.id
														? "border-blue-500 bg-blue-500/10"
														: "border-gray-700 bg-gray-800 hover:bg-gray-750"
												}
                     `}>
							<div className="flex items-center gap-3">
								<Wifi size={18} className={net.secured ? "text-white" : "text-yellow-400"} />
								<div className="text-left">
									<div className="text-sm font-bold text-white">{net.ssid}</div>
									<div className="text-[10px] text-gray-400">
										{net.secured ? "Secured (WPA2)" : "Open / Unsecured"}
									</div>
								</div>
							</div>
							{net.secured && <Lock size={14} className="text-gray-500" />}
						</button>
					))}
				</div>

				{/* Feedback Overlay */}
				{feedback === "error" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-xl text-sm font-bold flex items-center gap-3 backdrop-blur-sm">
						<ShieldAlert size={20} />
						Твои данные перехвачены! Включи VPN!
					</motion.div>
				)}

				{feedback === "success" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute bottom-4 left-4 right-4 bg-green-500/90 text-white p-4 rounded-xl text-sm font-bold flex items-center gap-3 backdrop-blur-sm">
						<ShieldCheck size={20} />
						Отлично! Соединение защищено.
					</motion.div>
				)}

				{feedback === "warning" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute bottom-4 left-4 right-4 bg-amber-500/90 text-white p-4 rounded-xl text-sm font-bold flex items-center gap-3 backdrop-blur-sm">
						<Lock size={20} />
						Безопасно, но с VPN было бы лучше!
					</motion.div>
				)}
			</div>
		</div>
	);
};
