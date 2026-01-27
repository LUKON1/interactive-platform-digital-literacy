import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	CheckCircle,
	X,
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	Lock,
	RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Message Component
const ChatMessage = ({ msg }) => {
	const isMe = msg.sender === "me";
	const isSystem = msg.sender === "System";

	if (isSystem) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="flex justify-center my-2">
				<div className="bg-bg-surface-3/50 text-text-secondary px-3 py-1.5 rounded-xl text-xs">
					{msg.text}
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			className={`flex w-full mb-2 sm:mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
			<div
				className={`
					max-w-[85%] sm:max-w-[75%] px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm text-left
					${
						isMe
							? "bg-primary text-on-primary rounded-tr-sm"
							: "bg-bg-surface-2 text-text-primary rounded-tl-sm"
					}
				`}>
				{msg.text}
			</div>
		</motion.div>
	);
};

export const ChatSimulation = ({ onComplete, onPrevious, canGoPrevious, isCompleted, data }) => {
	// Telegram + Госуслуги сценарий
	const defaultScenario = {
		messages: [
			{
				id: 1,
				sender: "Госуслуги",
				text: "Добрый день! Обнаружена задолженность по налогам на сумму 8 547 ₽",
			},
			{
				id: 2,
				sender: "Госуслуги",
				text: "Необходимо оплатить в течение 48 часов, иначе будут начислены пени 12% в день. Оплатите по ссылке: gosuslugi-oplata.ru/pay/tax9847",
				highlights: [
					{ text: "48 часов", type: "warning" },
					{ text: "пени 12%", type: "danger" },
					{ text: "gosuslugi-oplata.ru", type: "danger" },
				],
			},
		],
		options: [
			{
				text: "Оплачиваю прямо сейчас",
				isCorrect: false,
				explanation: `❌ **Это фишинг!**

**Красные флаги:**
🚩 Госуслуги НЕ пишут в Telegram - только через личный кабинет
🚩 Поддельный домен (\`gosuslugi-oplata.ru\` вместо \`gosuslugi.ru\`)
🚩 Искусственная срочность и угрозы
🚩 Настоящие пени составляют 1/300 ставки ЦБ, а не 12% в день

**Официальный портал:** gosuslugi.ru`,
				consequence: "Вы перешли по ссылке и ввели данные карты. Деньги украдены 😔",
			},
			{
				text: "Проверю в официальном приложении Госуслуг",
				isCorrect: true,
				explanation: `✅ **Абсолютно верно!**

**Вы правильно заметили:**
✓ Госуслуги не используют мессенджеры для уведомлений
✓ Все налоги и штрафы видны в личном кабинете
✓ Ссылка на оплату подозрительная
✓ Давление сроками - классический признак мошенничества

**Помните:** Всегда проверяйте информацию через официальные каналы!`,
				reward: "✅ Вы не попались на уловку мошенников!",
			},
			{
				text: "Спрошу у поддержки через @gosuslugibot",
				isCorrect: false,
				explanation: `⚠️ **Осторожно!**

Хотя идея проверки хорошая, есть нюанс:
🚩 Официального бота поддержки @gosuslugibot **не существует**
🚩 Мошенники часто создают поддельные боты с похожими названиями

**Правильно:**
✓ Зайти на официальный сайт gosuslugi.ru
✓ Открыть мобильное приложение Госуслуг
✓ Позвонить на горячую линию 115`,
				consequence: "Вы написали в поддельный бот и рассказали о ситуации мошенникам",
			},
		],
		header: {
			title: "Госуслуги 🇷🇺",
			subtitle: "был(а) в сети недавно",
			verified: false,
		},
	};

	const config = data || defaultScenario;

	const [messages, setMessages] = useState(
		isCompleted
			? [...config.messages, { id: 999, sender: "System", text: "Диалог завершен" }]
			: config.messages,
	);
	const [isTyping, setIsTyping] = useState(false);
	const [finished, setFinished] = useState(isCompleted);
	const [outcome, setOutcome] = useState(isCompleted ? "safe" : null);
	const [selectedOption, setSelectedOption] = useState(null);
	const [showExplanation, setShowExplanation] = useState(false);

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isTyping]);

	const handleChoice = (choice) => {
		setSelectedOption(choice);
		setMessages((prev) => [...prev, { id: Date.now(), sender: "me", text: choice.text }]);
		setIsTyping(true);

		setTimeout(() => {
			setIsTyping(false);
			if (choice.isCorrect) {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now() + 1,
						sender: "System",
						text: choice.reward || "✅ Угроза предотвращена!",
					},
				]);
				setOutcome("safe");
				setFinished(true);
			} else {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now() + 1,
						sender: "System",
						text: choice.consequence || "❌ Вы попались на мошенничество",
					},
				]);
				setOutcome("hacked");
				setFinished(true);
			}
			setShowExplanation(true);
		}, 1500);
	};

	const handleRetry = () => {
		// Reset to initial state
		setMessages(config.messages);
		setIsTyping(false);
		setFinished(false);
		setOutcome(null);
		setSelectedOption(null);
		setShowExplanation(false);
	};

	const isComplete = finished && outcome === "safe";

	return (
		<div className="w-full max-w-3xl mx-auto flex flex-col">
			{/* Chat Container */}
			<div className="surface-card overflow-hidden flex flex-col h-[60vh] sm:h-[65vh] md:h-[70vh] shadow-xl">
				{/* Chat Header - Telegram Style */}
				<div className="bg-linear-to-r from-primary to-primary/90 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 shrink-0 shadow-md">
					<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-primary text-xl font-bold shrink-0">
						{config.header.title[0]}
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-white text-sm sm:text-base truncate">
							{config.header.title}
						</h3>
						<p className="text-xs text-white/70">{config.header.subtitle}</p>
					</div>
				</div>

				{/* Messages Area - Darker Telegram-style background */}
				<div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-[#0e1621] space-y-1">
					{messages.map((msg) => {
						return <ChatMessage key={msg.id} msg={msg} />;
					})}

					{isTyping && (
						<div className="flex justify-start">
							<div className="bg-bg-surface-2 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
								<div className="flex gap-1">
									<motion.div
										animate={{ y: [0, -6, 0] }}
										transition={{ repeat: Infinity, duration: 0.6 }}
										className="w-2 h-2 bg-text-muted rounded-full"
									/>
									<motion.div
										animate={{ y: [0, -6, 0] }}
										transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
										className="w-2 h-2 bg-text-muted rounded-full"
									/>
									<motion.div
										animate={{ y: [0, -6, 0] }}
										transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
										className="w-2 h-2 bg-text-muted rounded-full"
									/>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Input Area */}
				<div className="p-3 sm:p-4 bg-bg-surface-2 border-t border-bg-surface-3 shrink-0">
					{!finished ? (
						<div className="space-y-2">
							<p className="text-xs sm:text-sm text-text-secondary mb-2 text-center font-medium">
								Как вы поступите?
							</p>
							<div className="space-y-2">
								{config.options.map((option, idx) => (
									<motion.button
										key={idx}
										whileHover={{ scale: 1.01, x: 2 }}
										whileTap={{ scale: 0.99 }}
										onClick={() => handleChoice(option)}
										className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-left bg-bg-surface-3 hover:bg-primary/20 text-text-primary rounded-xl transition-all border border-bg-surface-3 hover:border-primary/40 shadow-sm">
										{option.text}
									</motion.button>
								))}
							</div>
						</div>
					) : (
						<div className="text-center space-y-3">
							{outcome === "safe" ? (
								<div className="p-3 sm:p-4 bg-success/10 border border-success rounded-xl">
									<CheckCircle
										size={32}
										className="text-success mx-auto mb-2 w-6 h-6 sm:w-8 sm:h-8"
									/>
									<p className="text-success font-bold text-sm sm:text-base">Отлично!</p>
									<p className="text-text-secondary text-xs sm:text-sm mt-1">
										Вы правильно распознали опасность
									</p>
								</div>
							) : (
								<div className="p-3 sm:p-4 bg-error/10 border border-error rounded-xl">
									<AlertTriangle
										size={32}
										className="text-error mx-auto mb-2 w-6 h-6 sm:w-8 sm:h-8"
									/>
									<p className="text-error font-bold text-sm sm:text-base">Будьте осторожнее!</p>
									<p className="text-text-secondary text-xs sm:text-sm mt-1">
										Попробуйте еще раз, чтобы пройти дальше
									</p>
								</div>
							)}

							{/* Retry button for incorrect answers */}
							{outcome === "hacked" && (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={handleRetry}
									className="btn-secondary w-full flex items-center justify-center gap-2">
									<RotateCcw size={16} />
									Попробовать снова
								</motion.button>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className="w-full flex justify-between items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
				{canGoPrevious ? (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={onPrevious}
						className="btn-secondary flex items-center text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4">
						<ArrowLeft size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5" />
						Назад
					</motion.button>
				) : (
					<div />
				)}

				<motion.button
					whileHover={isComplete ? { scale: 1.05 } : {}}
					whileTap={isComplete ? { scale: 0.95 } : {}}
					onClick={isComplete ? onComplete : undefined}
					disabled={!isComplete}
					className={`flex items-center justify-center text-sm sm:text-base md:text-lg px-6 py-3 sm:px-10 sm:py-3 md:px-12 md:py-4 rounded-full transition-all ${
						isComplete
							? "btn-primary shadow-lg shadow-primary/20"
							: "bg-bg-surface-2/50 text-text-muted cursor-not-allowed border-2 border-bg-surface-3"
					}`}>
					{isComplete ? (
						<>
							Далее <ArrowRight size={16} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
						</>
					) : (
						<>
							<Lock size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5" />
							Завершите задание
						</>
					)}
				</motion.button>
			</div>

			{/* Explanation Modal with ReactMarkdown */}
			<AnimatePresence>
				{showExplanation && selectedOption && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
						onClick={() => setShowExplanation(false)}>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className="surface-card max-w-lg w-full p-4 sm:p-6 max-h-[80vh] overflow-y-auto shadow-2xl relative"
							onClick={(e) => e.stopPropagation()}>
							<button
								onClick={() => setShowExplanation(false)}
								className="absolute top-4 right-4 p-2 hover:bg-bg-surface-2 rounded-lg transition-colors z-10">
								<X size={20} className="text-text-muted" />
							</button>

							<div className="flex flex-col items-center text-center mb-6">
								<div
									className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
										selectedOption.isCorrect
											? "bg-success/10 text-success"
											: "bg-error/10 text-error"
									}`}>
									{selectedOption.isCorrect ? (
										<CheckCircle size={32} />
									) : (
										<AlertTriangle size={32} />
									)}
								</div>
								<h3 className="text-2xl font-bold text-text-primary">
									{selectedOption.isCorrect ? "Правильно!" : "Неправильно"}
								</h3>
							</div>

							{/* ReactMarkdown for proper formatting */}
							<div className="prose prose-sm sm:prose-base prose-invert max-w-none">
								<ReactMarkdown
									components={{
										p: ({ ...props }) => (
											<p
												className="mb-3 text-text-primary leading-relaxed text-center"
												{...props}
											/>
										),
										strong: ({ ...props }) => (
											<strong className="text-text-primary font-bold" {...props} />
										),
										code: ({ ...props }) => (
											<code
												className="bg-bg-surface-3 text-primary px-1.5 py-0.5 rounded text-sm"
												{...props}
											/>
										),
										ul: ({ ...props }) => (
											<ul
												className="space-y-2 text-text-primary list-none pl-0 flex flex-col items-center"
												{...props}
											/>
										),
										li: ({ ...props }) => <li className="text-text-primary" {...props} />,
										h2: ({ ...props }) => (
											<h2
												className="text-lg font-bold text-text-primary mb-2 text-center"
												{...props}
											/>
										),
									}}>
									{selectedOption.explanation}
								</ReactMarkdown>
							</div>

							<button
								onClick={() => setShowExplanation(false)}
								className="btn-primary w-full mt-4 sm:mt-6 text-sm sm:text-base shadow-md">
								Понятно
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
