// Данные для WhatsApp
const chats = [
    {
        id: 1,
        name: "Мама",
        avatar: "👩",
        lastMessage: "Почему ты не сделал домашку??",
        time: "10:30",
        unread: 3,
        messages: [
            { text: "Привет, сынок!", time: "09:15", received: true },
            { text: "Ты сделал домашнее задание?", time: "09:16", received: true },
            { text: "Нет еще...", time: "09:20", received: false },
            { text: "Почему ты не сделал домашку??", time: "10:30", received: true },
            { text: "Мне твой учитель звонил!", time: "10:31", received: true },
            { text: "Сказал, что ты опять не сдал математику!", time: "10:32", received: true }
        ]
    },
    {
        id: 2,
        name: "Папа",
        avatar: "👨",
        lastMessage: "Не забудь покормить кота",
        time: "09:45",
        unread: 1,
        messages: [
            { text: "Привет!", time: "09:30", received: true },
            { text: "Не забудь покормить кота", time: "09:45", received: true },
            { text: "И сделай уроки до моего прихода", time: "09:46", received: true }
        ]
    },
    {
        id: 3,
        name: "Бабушка",
        avatar: "👵",
        lastMessage: "Кушал сегодня?",
        time: "Вчера",
        unread: 0,
        messages: [
            { text: "Внучек, как дела?", time: "Вчера, 15:20", received: true },
            { text: "Нормально", time: "Вчера, 16:00", received: false },
            { text: "Кушал сегодня?", time: "Вчера, 16:05", received: true },
            { text: "Да, бабушка", time: "Вчера, 16:10", received: false }
        ]
    },
    {
        id: 4,
        name: "Алкаш",
        avatar: "🥴",
        lastMessage: "Где маи деньги?",
        time: "08:12",
        unread: 5,
        messages: [
            { text: "Привет малой", time: "07:30", received: true },
            { text: "Где маи деньги?", time: "08:12", received: true },
            { text: "Я тебе вчера занимал на мороженое", time: "08:13", received: true },
            { text: "Отдавай быстро", time: "08:14", received: true },
            { text: "Я не брал у вас денег", time: "08:20", received: false },
            { text: "Вы меня с кем-то путаете", time: "08:21", received: false }
        ]
    },
    {
        id: 5,
        name: "Одноклассник Петя",
        avatar: "👦",
        lastMessage: "Дай списать домашку",
        time: "Вчера",
        unread: 0,
        messages: [
            { text: "Привет", time: "Вчера, 18:30", received: true },
            { text: "Привет", time: "Вчера, 18:35", received: false },
            { text: "Дай списать домашку", time: "Вчера, 18:36", received: true },
            { text: "Я сам не сделал", time: "Вчера, 18:40", received: false },
            { text: "Блин(((", time: "Вчера, 18:41", received: true }
        ]
    }
];

// Данные для звонков
const calls = [
    {
        id: 1,
        name: "Мама",
        avatar: "👩",
        time: "10:15",
        type: "missed",
        duration: null
    },
    {
        id: 2,
        name: "Учитель",
        avatar: "👨‍🏫",
        time: "Вчера",
        type: "incoming",
        duration: "2:30"
    },
    {
        id: 3,
        name: "Бабушка",
        avatar: "👵",
        time: "Вчера",
        type: "outgoing",
        duration: "5:12"
    },
    {
        id: 4,
        name: "Неизвестный номер",
        avatar: "❓",
        time: "Позавчера",
        type: "missed",
        duration: null
    }
];

// Данные для входящих звонков
const incomingCalls = [
    {
        id: 1,
        name: "Мама",
        avatar: "👩",
        delay: 60000 // 1 минута
    },
    {
        id: 2,
        name: "Учитель",
        avatar: "👨‍🏫",
        delay: 180000 // 3 минуты
    },
    {
        id: 3,
        name: "Алкаш",
        avatar: "🥴",
        delay: 300000 // 5 минут
    }
]; 