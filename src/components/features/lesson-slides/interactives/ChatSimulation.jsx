import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, ShieldAlert, CheckCircle } from "lucide-react";

const ChatMessage = ({ msg }) => {
	const isMe = msg.sender === "me";

	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
			{!isMe && (
				<div className="w-8 h-8 rounded-full bg-linear-gradient from-purple-500 to-pink-500 flex items-center justify-center mr-2 text-white text-xs font-bold shrink-0">
					{msg.sender[0]}
				</div>
			)}
			<div
				className={`
            max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed
            ${
							isMe
								? "bg-primary text-on-primary rounded-tr-none"
								: "bg-bg-surface-2 text-text-primary rounded-tl-none border border-bg-surface-3"
						}
          `}>
				{msg.text}
			</div>
		</motion.div>
	);
};

export const ChatSimulation = ({ onComplete, data }) => {
	// Default Scenario (Steam Phishing)
	const defaultScenario = {
		messages: [
			{
				id: 1,
				sender: "Support",
				text: "Здравствуйте! Замечена подозрительная активность на вашем аккаунте Steam.",
			},
			{
				id: 2,
				sender: "Support",
				text: "Срочно перейдите по ссылке steam-community-secure.com/login чтобы подтвердить, что это вы, иначе аккаунт будет заблокирован через 24 часа.",
			},
		],
		options: [
			{ text: "Ок, перехожу, спасибо!", isCorrect: false },
			{ text: "Это фишинг. Домен левый. В бан.", isCorrect: true },
		],
		header: {
			title: "Steam Support?",
			subtitle: "online",
			iconColor: "from-purple-500 to-pink-500", // gradient classes
		},
	};

	const config = data || defaultScenario;

	const [messages, setMessages] = useState(config.messages);
	const [isTyping, setIsTyping] = useState(false);
	const [finished, setFinished] = useState(false);
	const [outcome, setOutcome] = useState(null); // 'safe' | 'hacked'

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isTyping]);

	const handleChoice = (choice) => {
		// Add user message
		setMessages((prev) => [...prev, { id: Date.now(), sender: "me", text: choice.text }]);

		setIsTyping(true);

		// Simulate typing delay
		setTimeout(() => {
			setIsTyping(false);
			if (choice.isCorrect) {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now() + 1,
						sender: "System",
						text: "✅ Угроза предотвращена. Вы правильно распознали фишинг!",
					},
				]);
				setOutcome("safe");
			} else {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now() + 1,
						sender: "System",
						text: "❌ Вы перешли по ссылке. Ваши данные украдены.",
					},
				]);
				setOutcome("hacked");
			}
			setFinished(true);
		}, 1500);
	};

	const options = config.options;

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="surface-card h-125 flex flex-col overflow-hidden border border-bg-surface-3">
				{/* Fake Header */}
				<div className="h-14 bg-bg-surface-2 border-b border-bg-surface-3 flex items-center px-4 justify-between">
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-full bg-linear-gradient ${config.header?.iconColor || "from-gray-500 to-gray-700"}`}
						/>
						<div className="flex flex-col">
							<span className="text-sm font-bold">{config.header?.title || "Support"}</span>
							<span className="text-xs text-text-secondary">
								{config.header?.subtitle || "online"}
							</span>
						</div>
					</div>
					<ShieldAlert size={18} className="text-error" />
				</div>

				{/* Chat Area */}
				<div className="flex-1 p-4 overflow-y-auto bg-bg-base">
					{messages.map((m) => (
						<ChatMessage key={m.id} msg={m} />
					))}
					{isTyping && (
						<div className="text-xs text-text-muted italic ml-12 mb-4">Support печатает...</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* Controls */}
				<div className="p-4 bg-bg-surface-2 border-t border-bg-surface-3">
					{!finished ? (
						<div className="grid gap-2">
							{options.map((opt, i) => (
								<button
									key={i}
									onClick={() => handleChoice(opt)}
									className="w-full p-3 rounded-xl bg-bg-surface-3 hover:bg-primary hover:text-on-primary text-sm font-medium transition-colors text-left">
									{opt.text}
								</button>
							))}
						</div>
					) : (
						<div className="text-center">
							{outcome === "safe" ? (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="flex flex-col items-center gap-2 text-success">
									<CheckCircle size={32} />
									<span className="font-bold">Вы в безопасности!</span>
								</motion.div>
							) : (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="flex flex-col items-center gap-2 text-error">
									<ShieldAlert size={32} />
									<span className="font-bold">Аккаунт взломан!</span>
									<button
										onClick={() => setFinished(false)}
										className="text-xs underline mt-2 text-text-secondary">
										Попробовать снова
									</button>
								</motion.div>
							)}

							{outcome === "safe" && (
								<button onClick={onComplete} className="btn-primary w-full mt-4">
									Завершить тренировку
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
