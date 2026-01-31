import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Search, Copy } from "lucide-react";
import { motion } from "motion/react";

export const CryptoScanner = ({ onComplete }) => {
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [complete, setComplete] = useState(false);

	const tokens = [
		{
			id: 1,
			symbol: "USDT",
			name: "Tether USD",
			address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
			holders: "5,000,000+",
			isReal: true,
		},
		{
			id: 2,
			symbol: "USDT",
			name: "Tether USD (Promo)",
			address: "0xFaKe...8821",
			holders: "124",
			isReal: false,
		},
	];

	const handleSelect = (token) => {
		setSelectedIndex(token.id);
		if (token.isReal) {
			setComplete(true);
			setTimeout(onComplete, 2000);
		}
	};

	return (
		<div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
			<div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
				<span className="font-bold text-white flex items-center gap-2">
					<Search size={16} /> Token Scanner
				</span>
				<div className="text-xs text-slate-400">v1.2.0</div>
			</div>

			<div className="p-6">
				<p className="text-sm text-slate-300 mb-4">Найди настоящий USDT контракт для импорта:</p>

				<div className="space-y-4">
					{tokens.map((token) => (
						<button
							key={token.id}
							onClick={() => handleSelect(token)}
							className={`w-full text-left p-4 rounded-lg border transition-all relative overflow-hidden
                        ${
													selectedIndex === token.id
														? token.isReal
															? "bg-emerald-500/10 border-emerald-500"
															: "bg-red-500/10 border-red-500"
														: "bg-slate-800 border-slate-700 hover:border-slate-500"
												}
                      `}>
							<div className="flex justify-between items-start mb-2">
								<div>
									<div className="font-bold text-lg text-white">{token.symbol}</div>
									<div className="text-xs text-slate-400">{token.name}</div>
								</div>
								{selectedIndex === token.id &&
									(token.isReal ? (
										<CheckCircle className="text-emerald-500" />
									) : (
										<AlertTriangle className="text-red-500" />
									))}
							</div>

							<div className="bg-slate-900/50 p-2 rounded text-[10px] font-mono text-slate-400 mb-2 flex items-center gap-2">
								{token.address} <Copy size={10} />
							</div>

							<div className="flex items-center gap-2 text-xs">
								<span className="text-slate-500">Holders:</span>
								<span className={token.isReal ? "text-white" : "text-red-400"}>
									{token.holders}
								</span>
							</div>
						</button>
					))}
				</div>

				{complete && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="mt-6 p-4 bg-emerald-500 text-white rounded-lg text-sm font-bold text-center motion-safe">
						Правильно! Всегда проверяй адрес контракта и количество холдеров.
					</motion.div>
				)}

				{selectedIndex && !tokens.find((t) => t.id === selectedIndex).isReal && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						className="mt-6 p-4 bg-red-500 text-white rounded-lg text-sm font-bold text-center motion-safe">
						Осторожно! Это скам-токен. Адрес подозрительный, мало держателей.
					</motion.div>
				)}
			</div>
		</div>
	);
};
