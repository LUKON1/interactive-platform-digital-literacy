import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, AlertCircle, Video, Mic, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { InteractiveNavigation } from "./InteractiveNavigation";

// Quiz questions
const QUIZ_QUESTIONS = [
	{
		id: 1,
		type: "video",
		scenario:
			"Политик в прямом эфире делает заявление о новом законе. Видео опубликовано на официальном канале новостей.",
		videoSrc: "/assets/antideepfakepolitic.mp4",
		hints: [
			"Опубликовано проверенным источником",
			"Прямой эфир сложнее подделать",
			"Есть водяной знак телеканала",
		],
		isReal: true,
		explanation:
			"**Реально**. Официальные каналы новостей и прямые эфиры — надёжные источники. Дипфейки обычно появляются в перезаливах или на сомнительных ресурсах.",
	},
	{
		id: 2,
		type: "audio",
		scenario:
			"Тебе звонит 'твой руководитель' и просит срочно перевести деньги на новый счёт. Голос похож, но звук слегка роботизированный.",
		audioSrc: "/assets/deepfakeceovice.m4a",
		hints: [
			"Необычное качество звука",
			"Срочность — типичная тактика мошенников",
			"Просьба о деньгах без предупреждения",
		],
		isReal: false,
		explanation:
			"**Дипфейк**! Красные флаги: искусственная срочность, просьба о деньгах, 'роботизированный' голос. Всегда перезванивай по известному номеру для проверки.",
	},
	{
		id: 3,
		type: "video",
		scenario:
			"Видео со знаменитостью, где она рекламирует криптовалюту. Опубликовано на странице в VK с 5000 подписчиков, создана неделю назад.",
		videoSrc: "/assets/Russian_Business_Man_Video.mp4",
		hints: [
			"Неофициальная страница",
			"Малое количество подписчиков",
			"Знаменитости редко рекламируют криптовалюту",
		],
		isReal: false,
		explanation:
			"**Дипфейк**! Мошенники массово создают фейковые видео со знаменитостями для крипто-скама. Проверяй: есть ли это видео на официальных аккаунтах?",
	},
	{
		id: 4,
		type: "text",
		scenario: `
**От кого:** Служба безопасности ПАО Сбербанк <support@sberbank-security.net>  
**Тема:** Срочное уведомление: Ваш доступ к онлайн-банку может быть ограничен

Уважаемый клиент!

Доводим до вашего сведения, что в рамках обновления протоколов безопасности и в соответствии с требованиями Федерального закона №115-ФЗ, всем пользователям необходимо пройти обязательную процедуру подтверждения личности и актуализации персональных данных.

**Почему это важно?**  
В последнее время участились случаи несанкционированного доступа к личным кабинетам. Обновление ваших данных позволит нам активировать дополнительный уровень защиты и предотвратить возможные мошеннические операции по вашим счетам.

**Что вам нужно сделать?**  
Для завершения процедуры идентификации, пожалуйста, перейдите на нашу защищенную страницу верификации и следуйте инструкциям:

[ПОДТВЕРДИТЬ ЛИЧНОСТЬ](https://sberbank-security.net)

**Внимание:** Если процедура подтверждения не будет пройдена в течение 24 часов, мы будем вынуждены временно приостановить действие вашей банковской карты и доступ к мобильному приложению в целях обеспечения сохранности ваших средств.

Благодарим за понимание и сотрудничество.

С уважением,  
Команда безопасности ПАО Сбербанк.
`,
		hints: [
			"Поддельный домен (.net вместо .ru)",
			"Просьба подтвердить личность — признак фишинга",
			"Даже AI-генерированный текст не сделает фейковый домен реальным",
		],
		isReal: false,
		explanation:
			"**Фишинг с AI-текстом**! Мошенники используют ChatGPT для написания идеальных писем. Но технология не может подделать легитимный домен. Всегда проверяй адрес отправителя!",
	},
	{
		id: 5,
		type: "audio",
		scenario:
			"Аудиозапись интервью с журналистом на радио. В прямом эфире обсуждаются актуальные новости. Звук чистый, журналист задаёт уточняющие вопросы.",
		audioSrc: "/assets/podcast.m4a",
		hints: ["Прямой эфир", "Естественный диалог с импровизацией", "Чистый звук без артефактов"],
		isReal: true,
		explanation:
			"**Реально**. Дипфейки плохо справляются с импровизацией и живыми диалогами. Уточняющие вопросы, паузы и естественная интонация — признаки настоящего разговора.",
	},
];

const TYPE_ICONS = {
	video: Video,
	audio: Mic,
	text: FileText,
};

const TYPE_LABELS = {
	video: "Видео",
	audio: "Аудио",
	text: "Текст",
};

export const MediaVerificationQuiz = ({ onComplete, onPrevious, canGoPrevious, isCompleted }) => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState(isCompleted ? QUIZ_QUESTIONS.map(() => true) : []);
	const [showExplanation, setShowExplanation] = useState(false);
	const [score, setScore] = useState(0);

	const question = QUIZ_QUESTIONS[currentQuestion];
	const TypeIcon = TYPE_ICONS[question.type];
	const hasAnswered = answers[currentQuestion] !== undefined;
	const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1;
	const quizFinished = answers.length === QUIZ_QUESTIONS.length;

	const handleAnswer = (userAnswer) => {
		const isCorrect = userAnswer === question.isReal;

		setAnswers([...answers, isCorrect]);
		setShowExplanation(true);

		if (isCorrect) {
			setScore(score + 1);
		}
	};

	const handleNext = () => {
		if (isLastQuestion) {
			// Quiz finished
		} else {
			setCurrentQuestion(currentQuestion + 1);
			setShowExplanation(false);
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto flex flex-col h-full">
			{!quizFinished ? (
				<>
					{/* Progress bar */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-text-secondary">
								Вопрос {currentQuestion + 1} из {QUIZ_QUESTIONS.length}
							</span>
							<span className="text-sm font-bold text-primary">Правильных: {score}</span>
						</div>
						<div className="w-full h-2 bg-bg-surface-2 rounded-full overflow-hidden">
							<motion.div
								animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
								className="h-full bg-linear-to-r from-primary to-secondary rounded-full"
							/>
						</div>
					</div>

					{/* Question card */}
					<AnimatePresence mode="wait">
						<motion.div
							key={currentQuestion}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="flex-1 mb-6">
							<div className="bg-bg-surface-2 border border-bg-surface-3 rounded-3xl p-6 h-full flex flex-col">
								{/* Type badge */}
								<div className="flex items-center gap-2 mb-4">
									<div className="p-2 rounded-xl bg-primary/10">
										<TypeIcon size={24} className="text-primary" />
									</div>
									<span className="text-sm font-bold text-primary uppercase tracking-wider">
										{TYPE_LABELS[question.type]}
									</span>
								</div>

								{/* Scenario */}
								<div className="flex-1 mb-6 overflow-y-auto custom-scrollbar">
									<div className="text-lg leading-relaxed text-text-primary prose prose-invert prose-p:mb-4 prose-strong:text-primary prose-a:text-blue-400">
										<ReactMarkdown
											components={{
												p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
												a: ({ node, ...props }) => (
													<span className="text-blue-400 underline cursor-not-allowed" {...props} />
												),
											}}>
											{question.scenario}
										</ReactMarkdown>
									</div>

									{/* Video Player */}
									{question.videoSrc && (
										<div className="mt-4 rounded-xl overflow-hidden bg-bg-surface-1 border border-bg-surface-3">
											<video controls className="w-full aspect-video">
												<source src={question.videoSrc} type="video/mp4" />
												Ваш браузер не поддерживает видео элемент.
											</video>
										</div>
									)}

									{/* Audio Player */}
									{question.audioSrc && (
										<div className="mt-4 p-4 rounded-xl bg-bg-surface-1 border border-bg-surface-3">
											<div className="flex items-center gap-3 mb-2">
												<div className="p-2 rounded-full bg-primary/10">
													<Mic size={20} className="text-primary" />
												</div>
												<span className="text-sm font-bold text-text-secondary">
													Прослушайте запись:
												</span>
											</div>
											<audio controls className="w-full h-10 accent-primary">
												<source src={question.audioSrc} type="audio/mp4" />
												<source src={question.audioSrc} type="audio/mpeg" />
												Ваш браузер не поддерживает аудио элемент.
											</audio>
										</div>
									)}
								</div>

								{/* Hints */}
								<div className="bg-bg-surface-1 rounded-2xl p-4 mb-6">
									<div className="flex items-center gap-2 mb-3">
										<AlertCircle size={18} className="text-primary" />
										<span className="text-sm font-bold text-text-primary">Подсказки:</span>
									</div>
									<ul className="space-y-2">
										{question.hints.map((hint, index) => (
											<li
												key={index}
												className="flex items-start gap-2 text-sm text-text-secondary">
												<span className="text-primary">•</span>
												<span>{hint}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Answer buttons */}
								{!hasAnswered ? (
									<div className="grid grid-cols-2 gap-4">
										<button
											onClick={() => handleAnswer(true)}
											className="py-4 px-6 rounded-2xl bg-success/10 border-2 border-success/30 hover:bg-success/20 transition-all text-success font-bold text-lg">
											Реально ✓
										</button>
										<button
											onClick={() => handleAnswer(false)}
											className="py-4 px-6 rounded-2xl bg-error/10 border-2 border-error/30 hover:bg-error/20 transition-all text-error font-bold text-lg">
											Дипфейк ✗
										</button>
									</div>
								) : (
									showExplanation && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className={`
											p-6 rounded-2xl border-2
											${answers[currentQuestion] ? "bg-success/10 border-success/30" : "bg-error/10 border-error/30"}
										`}>
											<div className="flex items-start gap-3 mb-3">
												{answers[currentQuestion] ? (
													<CheckCircle size={28} className="text-success shrink-0" />
												) : (
													<XCircle size={28} className="text-error shrink-0" />
												)}
												<div>
													<h4
														className={`font-bold text-lg mb-2 ${answers[currentQuestion] ? "text-success" : "text-error"}`}>
														{answers[currentQuestion] ? "Правильно!" : "Неправильно"}
													</h4>
													<div className="text-text-secondary text-sm leading-relaxed">
														<ReactMarkdown
															components={{
																strong: ({ node, ...props }) => (
																	<span className="font-bold text-text-primary" {...props} />
																),
															}}>
															{question.explanation}
														</ReactMarkdown>
													</div>
												</div>
											</div>
											<button
												onClick={handleNext}
												className="mt-4 w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold transition-colors">
												{isLastQuestion ? "Показать результаты" : "Следующий вопрос →"}
											</button>
										</motion.div>
									)
								)}
							</div>
						</motion.div>
					</AnimatePresence>
				</>
			) : (
				// Results screen
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="flex-1 flex items-center justify-center">
					<div className="bg-bg-surface-2 border border-bg-surface-3 rounded-3xl p-8 text-center max-w-md">
						<div className="mb-6">
							{score >= 4 ? (
								<div className="w-24 h-24 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
									<CheckCircle size={48} className="text-success" />
								</div>
							) : (
								<div className="w-24 h-24 mx-auto rounded-full bg-error/20 flex items-center justify-center mb-4">
									<XCircle size={48} className="text-error" />
								</div>
							)}
							<h2 className="text-3xl font-bold text-text-primary mb-2">Квиз завершён!</h2>
							<p className="text-5xl font-bold text-primary mb-4">
								{score} / {QUIZ_QUESTIONS.length}
							</p>
							<p className="text-text-secondary">
								{score >= 4
									? "Отличный результат! Ты хорошо разбираешься в распознавании дипфейков."
									: "Неплохо, но есть куда расти. Изучи признаки дипфейков внимательнее."}
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Navigation */}
			<InteractiveNavigation
				onPrevious={onPrevious}
				canGoPrevious={canGoPrevious}
				onNext={onComplete}
				isCompleted={isCompleted || quizFinished}
				lockedMessage="Ответь на все вопросы"
			/>
		</div>
	);
};
