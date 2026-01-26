export const LESSONS = {
	"cyber-hygiene": [
		{
			id: "ch-lesson-1",
			title: "Магия сильных паролей",
			description:
				'Почему "123456" — это плохая идея и как создать пароль, который не взломают за миллиард лет.',
			duration: "5 мин",
			slides: [
				{
					id: "slide-1",
					type: "intro",
					title: "Пароли: Твоя первая линия обороны",
					content:
						"Ты когда-нибудь задумывался, как быстро хакеры могут подобрать твой пароль? Спойлер: очень быстро. Если твой пароль '123456' или 'password', тебя взломают за 0.0001 секунды.",
				},
				{
					id: "slide-2",
					type: "fact",
					title: "Шокирующая статистика",
					content:
						"Пароль из 8 символов взламывается за **5 минут**.\n\nПароль из 12 символов? За **200 лет**.\n\nКаждый дополнительный символ увеличивает время взлома экспоненциально!",
					icon: "Clock",
				},
				{
					id: "slide-3",
					type: "theory",
					title: "Два пути самурая",
					content: `Есть два способа создать надежную защиту. Оба **одинаково безопасны**, но один из них удобнее.

1.  **Классический (Сложный):**
    Набор символов: \`X7#m_9$pL2\`.
    *   ✅ Компьютер не взломает.
    *   ❌ Человеку невозможно запомнить. Идеально для менеджеров паролей.

2.  **Мнемофраза (Удобный):**
    Набор слов: \`correct-horse-battery-staple\`.
    *   ✅ Длина > 20 символов делает взлом невозможным.
    *   ✅ **Легко запомнить.** Наш мозг любит образы.

Выбирай мнемофразы для тех паролей, которые нужно вводить руками (вход в систему, мастер-пароль).`,
				},
				{
					id: "slide-4-a",
					type: "interactive",
					variant: "term-sorter",
					title: "Уровень 1: Отсеиваем мусор",
					description: "Убери откровенно слабые пароли.",
					// Default labels: Слабый / Сильный
					data: [
						{ id: "1", content: "password123", category: "unsafe" },
						{ id: "2", content: "admin", category: "unsafe" },
						{ id: "3", content: "K#9mP$2v", category: "safe" },
						{ id: "4", content: "iloveyou", category: "unsafe" },
						{ id: "5", content: "L8*q_Z1!", category: "safe" },
					],
				},
				{
					id: "slide-4-b",
					type: "interactive",
					variant: "term-sorter",
					title: "Уровень 2: Удобство или Хардкор?",
					description:
						"Оба типа защиты надежны. Но что легче запомнить, а что лучше доверить менеджеру паролей?",
					labels: { unsafe: "Хардкор (Символы)", safe: "Мнемофраза (Слова)" },
					data: [
						{ id: "1", content: "X7#m_9$pL2", category: "unsafe" }, // Using 'unsafe' bucket for 'Hardcore' visually (Red/Warning color fits 'Hard')
						{ id: "2", content: "coffee-jump-sky-blue", category: "safe" },
						{ id: "3", content: "9#vB!mk2", category: "unsafe" },
						{ id: "4", content: "purple-elephant-running", category: "safe" },
						{ id: "5", content: "Tr0ub4dor&3", category: "unsafe" },
					],
				},
				{
					id: "slide-5",
					type: "interactive",
					variant: "password-builder",
					title: "Создай свою Мнемофразу",
					description:
						"Попробуй ввести 4 случайных слова через пробел или тире. Например: 'lazy-dog-sleeping-sun'.",
				},
				{
					id: "slide-6",
					type: "outtro",
					title: "Миссия выполнена!",
					content:
						"Ты освоил современный стандарт защиты. Используй мнемофразы для мастер-паролей и важных аккаунтов.",
				},
			],
		},
		{
			id: "ch-lesson-2",
			title: "Двухфакторная аутентификация (2FA)",
			description: "Зачем нужен второй ключ от твоего цифрового дома.",
			duration: "7 мин",
			slides: [
				// ... placeholders
			],
		},
	],
	phishing: [
		{
			id: "lesson-1",
			title: "Охота на фишера",
			description: "Как отличить настоящее письмо от подделки и не потерять аккаунт.",
			duration: "5 мин",
			slides: [
				{
					id: "slide-1",
					type: "intro",
					title: "Что такое Фишинг?",
					content:
						'Фишинг (Phishing) — это ловля на живца. Хакеры закидывают тебе "наживку" (ссылку), надеясь, что ты клюнешь.',
				},
				{
					id: "slide-2",
					type: "fact",
					title: "Цена ошибки",
					content:
						"90% всех взломов компаний начинаются с одного фишингового письма, которое открыл неосторожный сотрудник.",
				},
				{
					id: "slide-3",
					type: "interactive",
					variant: "chat-simulation",
					title: "Симулятор: Steam Support",
					description: "Тебе пришло сообщение. Твои действия?",
				},
				{
					id: "slide-4",
					type: "outtro",
					title: "Ты внимателен!",
					content:
						"Всегда проверяй адрес отправителя и домен ссылки. Steam никогда не пишет в личку с просьбой перейти по ссылке.",
				},
			],
		},
	],
	"safe-wifi": [
		{
			id: "wifi-lesson-1",
			title: "Опасности открытых сетей",
			description: "Как безопасно пользоваться Wi-Fi в кафе и отелях.",
			duration: "3 мин",
			slides: [
				{
					id: "slide-1",
					type: "intro",
					title: "Бесплатный Wi-Fi?",
					content:
						"Ты зашел в кафе, увидел сеть 'Free_Pizza_Wifi' и сразу подключился. Стоп. А это точно сеть кафе?",
				},
				{
					id: "slide-2",
					type: "interactive",
					variant: "wifi-simulator",
					title: "Выбери сеть",
					description: "Попробуй подключиться безопасно. Используй VPN, если нужно.",
				},
				{
					id: "slide-3",
					type: "outtro",
					title: "Ты под защитой!",
					content:
						"Открытые сети без пароля шифруют трафик. Хакер может видеть всё, что ты отправляешь. Всегда используй VPN в публичных местах.",
				},
			],
		},
	],
	"crypto-safety": [
		{
			id: "crypto-lesson-1",
			title: "Как не потерять крипту",
			description: "Отличаем настоящие токены от подделок.",
			duration: "4 мин",
			slides: [
				{
					id: "slide-1",
					type: "intro",
					title: "Дикий Запад Крипты",
					content:
						"В крипте нет техподдержки, которая вернет деньги. Если ты отправишь токены мошеннику — они исчезнут навсегда.",
				},
				{
					id: "slide-2",
					type: "interactive",
					variant: "crypto-scanner",
					title: "Проверка Контракта",
					description: "Тебе предлагают купить новый USDT. Какой из них настоящий?",
				},
				{
					id: "slide-3",
					type: "outtro",
					title: "DYOR (Do Your Own Research)",
					content:
						"Всегда сверяй адреса контрактов на официальных сайтах (CoinMarketCap, Etherscan). Мошенники часто меняют 1-2 символа.",
				},
			],
		},
	],
	"digital-footprint": [],
	// ... other topics
};
