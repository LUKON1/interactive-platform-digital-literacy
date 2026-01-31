import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Video, Mic, Clock, User } from "lucide-react";
import { clsx } from "clsx";
import { InteractiveNavigation } from "./InteractiveNavigation";

export const DeepfakeCall = ({ data, onComplete, onPrevious, canGoPrevious, isCompleted }) => {
	const { callerName, callerRole, videoIdle, videoGlitch, poster, scenario } = data;
	const [status, setStatus] = useState(isCompleted ? "ended" : "incoming"); // incoming, active, ended
	const [videoSrc, setVideoSrc] = useState(videoIdle);
	const [timeLeft, setTimeLeft] = useState(45);
	const [result, setResult] = useState(null); // success, caught, failed
	const [isMuted, setIsMuted] = useState(false);
	const videoRef = useRef(null);

	// Timer logic
	useEffect(() => {
		if (status === "active" && timeLeft > 0) {
			const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
			return () => clearInterval(timer);
		} else if (timeLeft === 0 && status === "active") {
			handleEndCall("timeout");
		}
	}, [status, timeLeft]);

	const handleAnswer = () => {
		setStatus("active");
		// Ensure video plays when answered
		if (videoRef.current) {
			videoRef.current.play().catch((e) => console.log("Autoplay prevented", e));
		}
	};

	const handleAction = (actionOption) => {
		if (actionOption.action === "verify_turn") {
			// Switch to glitch video
			setVideoSrc(videoGlitch);
			if (videoRef.current) {
				videoRef.current.load();
				videoRef.current.play();
			}

			// Show success/caught state after a short delay
			setTimeout(() => {
				// User "saw" the glitch. Now they should hang up.
				// We can either auto-end or let them click hangup.
				// Let's let them click hangup but show a hint or just let the video loop.
			}, 2000);
		} else if (actionOption.action === "obey") {
			handleEndCall("failed");
		}
	};

	const handleEndCall = (reason) => {
		setStatus("ended");
		if (reason === "hung_up_safe") {
			// If they hung up, we count it as success if they didn't "obey"
			setResult("success");
			onComplete();
		} else if (reason === "failed" || reason === "timeout") {
			setResult("failed");
		}
	};

	const currentDialogue = scenario[0]; // Simplified for now

	return (
		<div className="flex flex-col items-center w-full max-w-lg mx-auto min-h-full">
			<div className="w-full max-w-sm mx-auto h-162.5 flex flex-col bg-black rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-gray-800 shrink-0 mb-6">
				{/* Status Bar (Simulated Mobile) */}
				<div className="absolute top-0 w-full z-20 px-6 py-4 flex justify-between text-white font-medium text-sm">
					<span>10:33</span>
					<div className="flex gap-1">
						<div className="w-4 h-4 bg-white/20 rounded-full" />
						<div className="w-4 h-4 bg-white/20 rounded-full" />
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 relative bg-gray-900 flex flex-col">
					{status === "incoming" && (
						<div className="flex-1 flex flex-col items-center pt-24 px-6 bg-linear-to-b from-gray-800 to-gray-900">
							<div className="w-32 h-32 rounded-full overflow-hidden mb-6 shadow-xl border-4 border-gray-700/50">
								<img src={poster} alt={callerName} className="w-full h-full object-cover" />
							</div>
							<h2 className="text-3xl text-white font-normal mb-1">{callerName}</h2>
							<p className="text-lg text-gray-400 mb-8">{callerRole}</p>
							<p className="text-gray-500 animate-pulse">Telegram Audio...</p>
						</div>
					)}

					{(status === "active" || status === "ended") && (
						<div className="relative flex-1 bg-black">
							<video
								ref={videoRef}
								src={videoSrc}
								poster={poster}
								loop
								playsInline
								className="w-full h-full object-cover"
							/>

							{/* Call Overlay UI */}
							<div className="absolute top-4 left-4 bg-black/40 backdrop-blur px-3 py-1 rounded-full text-white/80 text-xs flex items-center gap-1">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								00:{45 - timeLeft}
							</div>

							{/* Dialogue Subtitles Style */}
							<div className="absolute bottom-4 left-4 right-4 text-center">
								<div className="bg-black/60 backdrop-blur text-white px-4 py-2 rounded-2xl inline-block text-lg">
									{currentDialogue?.text}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Bottom Controls */}
				<div className="bg-gray-900/90 backdrop-blur-xl p-6 pb-8 z-20 rounded-t-3xl -mt-6">
					{status === "incoming" ? (
						<div className="flex justify-between items-center px-4 pt-2">
							<div className="flex flex-col items-center gap-2">
								<button className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
									<Clock size={24} />
								</button>
								<span className="text-white/50 text-xs">Напомнить</span>
							</div>

							<button
								onClick={handleAnswer}
								className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-900/50 animate-pulse">
								<Phone size={36} fill="currentColor" />
							</button>

							<button
								onClick={() => handleEndCall("hung_up_safe")}
								className="w-16 h-16 rounded-full bg-transparent border border-white/20 flex items-center justify-center text-white/50">
								<PhoneOff size={24} />
							</button>
						</div>
					) : status === "active" ? (
						<div className="flex flex-col gap-4">
							{/* Action Buttons in a grid */}
							<div className="grid grid-cols-2 gap-3 mb-2">
								{currentDialogue?.options.map((option, idx) => (
									<button
										key={idx}
										onClick={() => handleAction(option)}
										className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors text-center border border-white/5">
										{option.label}
									</button>
								))}
							</div>

							{/* Main Call Controls */}
							<div className="flex justify-center items-center gap-6">
								<button
									onClick={() => setIsMuted(!isMuted)}
									className={clsx(
										"p-4 rounded-full transition-colors",
										isMuted ? "bg-white text-black" : "bg-white/10 text-white",
									)}>
									<Mic size={24} />
								</button>
								<button className="p-4 rounded-full bg-white/10 text-white">
									<Video size={24} />
								</button>
								<button
									onClick={() => handleEndCall("hung_up_safe")}
									className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-colors">
									<PhoneOff size={32} fill="currentColor" />
								</button>
							</div>
						</div>
					) : (
						<div className="text-center pt-2">
							{result === "success" ? (
								<div className="bg-green-500/20 text-green-400 p-4 rounded-2xl border border-green-500/30">
									<h3 className="font-bold text-lg mb-1">Звонок завершен</h3>
									<p className="text-sm">Вы вовремя распознали дипфейк.</p>
								</div>
							) : (
								<div className="bg-red-500/20 text-red-400 p-4 rounded-2xl border border-red-500/30">
									<h3 className="font-bold text-lg mb-1">Вы ошиблись</h3>
									<p className="text-sm">Мошенники получили деньги.</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isCompleted}
			/>
		</div>
	);
};
