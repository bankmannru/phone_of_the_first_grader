document.addEventListener('DOMContentLoaded', () => {
    // Инициализация времени
    updateTime();
    setInterval(updateTime, 60000); // Обновление времени каждую минуту
    
    // Инициализация игры Geometry Dash
    const canvas = document.getElementById('gameCanvas');
    const game = new GeometryDash(canvas);
    document.getElementById('startGame').addEventListener('click', game.start);
    
    // Инициализация приложений
    initApps();
    
    // Инициализация чатов WhatsApp
    initWhatsApp();
    
    // Инициализация истории звонков
    initCallHistory();
    
    // Запуск симуляции входящих звонков
    scheduleIncomingCalls();
    
    // Запуск симуляции новых сообщений
    scheduleNewMessages();
    
    // Планирование случайных push-уведомлений
    scheduleRandomPushNotifications();
});

// Обновление времени
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.querySelector('.time').textContent = `${hours}:${minutes}`;
}

// Инициализация приложений
function initApps() {
    // Обработчик нажатия на иконки приложений
    document.querySelectorAll('.app').forEach(app => {
        app.addEventListener('click', () => {
            const appName = app.getAttribute('data-app');
            openApp(appName);
        });
    });
    
    // Обработчик нажатия на кнопку "Домой" в приложениях
    document.querySelectorAll('.home-button-app').forEach(button => {
        button.addEventListener('click', () => {
            goToHomeScreen();
        });
    });
    
    // Обработчик нажатия на кнопку "Назад" в чате
    document.querySelector('.chat-back').addEventListener('click', () => {
        document.querySelector('.chat-screen').classList.remove('active-screen');
        document.querySelector('.whatsapp-screen').classList.add('active-screen');
    });
    
    // Обработчик нажатия на кнопку "Домой" внизу экрана
    document.querySelector('.home-button').addEventListener('click', () => {
        goToHomeScreen();
    });
    
    // Добавляем бейджи с уведомлениями на иконки приложений
    updateAppBadges();
    
    // Инициализация Flood-режима
    initFloodMode();
}

// Открытие приложения
function openApp(appName) {
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    document.querySelector('.home-screen').classList.remove('active-screen');
    
    switch (appName) {
        case 'geometrydash':
            document.querySelector('.geometry-dash-screen').classList.add('active-screen');
            break;
        case 'whatsapp':
            document.querySelector('.whatsapp-screen').classList.add('active-screen');
            break;
        case 'phone':
            document.querySelector('.phone-screen').classList.add('active-screen');
            break;
    }
}

// Закрытие текущего приложения
function closeCurrentApp() {
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    document.querySelector('.home-screen').classList.add('active-screen');
}

// Переход на домашний экран
function goToHomeScreen() {
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    document.querySelector('.home-screen').classList.add('active-screen');
}

// Инициализация WhatsApp
function initWhatsApp() {
    const chatList = document.querySelector('.chat-list');
    
    // Создание элементов чатов
    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.setAttribute('data-chat-id', chat.id);
        
        chatItem.innerHTML = `
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-name">${chat.name}</div>
                <div class="chat-last-message">${chat.lastMessage}</div>
            </div>
            <div class="chat-meta">
                <div class="chat-time">${chat.time}</div>
                ${chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : ''}
            </div>
        `;
        
        chatItem.addEventListener('click', () => {
            openChat(chat);
        });
        
        chatList.appendChild(chatItem);
    });
}

// Открытие чата
function openChat(chat) {
    const chatScreen = document.querySelector('.chat-screen');
    const whatsappScreen = document.querySelector('.whatsapp-screen');
    
    // Обновление информации о контакте
    document.querySelector('.contact-avatar').textContent = chat.avatar;
    document.querySelector('.contact-name').textContent = chat.name;
    
    // Очистка и заполнение сообщений
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = '';
    
    chat.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.received ? 'received' : 'sent'}`;
        
        messageElement.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${message.time}</div>
        `;
        
        chatMessages.appendChild(messageElement);
    });
    
    // Прокрутка к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Сброс счетчика непрочитанных сообщений
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${chat.id}"]`);
    const unreadBadge = chatItem.querySelector('.unread-badge');
    if (unreadBadge) {
        unreadBadge.remove();
        chat.unread = 0;
        
        // Обновляем бейджи на иконках приложений
        updateAppBadges();
    }
    
    // Открытие экрана чата
    whatsappScreen.classList.remove('active-screen');
    chatScreen.classList.add('active-screen');
}

// Инициализация истории звонков
function initCallHistory() {
    const callHistory = document.querySelector('.call-history');
    
    // Создание элементов истории звонков
    calls.forEach(call => {
        const callItem = document.createElement('div');
        callItem.className = 'call-item';
        
        let iconClass = '';
        switch (call.type) {
            case 'missed':
                iconClass = 'missed';
                break;
            case 'outgoing':
                iconClass = 'outgoing';
                break;
            case 'incoming':
                iconClass = 'incoming';
                break;
        }
        
        callItem.innerHTML = `
            <div class="call-icon ${iconClass}">
                <i class="fas fa-${call.type === 'outgoing' ? 'phone-alt' : call.type === 'incoming' ? 'phone' : 'phone-slash'}"></i>
            </div>
            <div class="call-details">
                <div class="call-contact">${call.name} ${call.avatar}</div>
                <div class="call-time">${call.time}${call.duration ? ` • ${call.duration}` : ''}</div>
            </div>
        `;
        
        callHistory.appendChild(callItem);
    });
}

// Планирование входящих звонков
function scheduleIncomingCalls() {
    incomingCalls.forEach(call => {
        setTimeout(() => {
            showIncomingCall(call);
        }, call.delay);
    });
}

// Показ входящего звонка
function showIncomingCall(call) {
    // Если мы на домашнем экране, сначала показываем push-уведомление
    if (document.querySelector('.home-screen').classList.contains('active-screen')) {
        sendPushNotification('Телефон', `Входящий звонок: ${call.name}`, '📞', 1000);
        
        // Задержка перед показом экрана входящего звонка
        setTimeout(() => {
            showIncomingCallScreen(call);
        }, 3000);
    } else {
        showIncomingCallScreen(call);
    }
}

// Показ экрана входящего звонка
function showIncomingCallScreen(call) {
    const incomingCallScreen = document.querySelector('.incoming-call-screen');
    
    // Обновление информации о звонящем
    document.querySelector('.caller-avatar').textContent = call.avatar;
    document.querySelector('.caller-name').textContent = call.name;
    
    // Показ экрана входящего звонка
    document.querySelectorAll('.screen-content, .home-screen').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    incomingCallScreen.classList.add('active-screen');
    
    // Звук звонка
    const ringtone = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-classic-short-phone-ring-1357.mp3');
    ringtone.loop = true;
    ringtone.play();
    
    // Обработчики кнопок
    const declineButton = document.querySelector('.decline-call');
    const acceptButton = document.querySelector('.accept-call');
    
    const declineHandler = () => {
        ringtone.pause();
        incomingCallScreen.classList.remove('active-screen');
        document.querySelector('.home-screen').classList.add('active-screen');
        
        // Добавление в историю звонков
        addCallToHistory(call, 'missed');
        
        // Удаление обработчиков
        declineButton.removeEventListener('click', declineHandler);
        acceptButton.removeEventListener('click', acceptHandler);
    };
    
    const acceptHandler = () => {
        ringtone.pause();
        incomingCallScreen.classList.remove('active-screen');
        showActiveCall(call);
        
        // Удаление обработчиков
        declineButton.removeEventListener('click', declineHandler);
        acceptButton.removeEventListener('click', acceptHandler);
    };
    
    declineButton.addEventListener('click', declineHandler);
    acceptButton.addEventListener('click', acceptHandler);
    
    // Автоматическое завершение звонка через 15 секунд, если не ответили
    setTimeout(() => {
        if (incomingCallScreen.classList.contains('active-screen')) {
            declineHandler();
        }
    }, 15000);
}

// Показ активного звонка
function showActiveCall(call) {
    const activeCallScreen = document.querySelector('.active-call-screen');
    
    // Обновление информации о звонящем
    document.querySelector('.active-call-screen .caller-avatar').textContent = call.avatar;
    document.querySelector('.active-call-screen .caller-name').textContent = call.name;
    
    // Показ экрана активного звонка
    activeCallScreen.classList.add('active-screen');
    
    // Таймер звонка
    let seconds = 0;
    const durationElement = document.querySelector('.call-duration');
    
    const callTimer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        durationElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Обработчик кнопки завершения звонка
    const endCallButton = document.querySelector('.end-call');
    
    const endCallHandler = () => {
        clearInterval(callTimer);
        activeCallScreen.classList.remove('active-screen');
        document.querySelector('.home-screen').classList.add('active-screen');
        
        // Добавление в историю звонков
        addCallToHistory(call, 'incoming', durationElement.textContent);
        
        // Удаление обработчика
        endCallButton.removeEventListener('click', endCallHandler);
    };
    
    endCallButton.addEventListener('click', endCallHandler);
    
    // Автоматическое завершение звонка через случайное время (30-60 секунд)
    const randomDuration = Math.floor(Math.random() * 30000) + 30000;
    setTimeout(endCallHandler, randomDuration);
}

// Добавление звонка в историю
function addCallToHistory(call, type, duration = null) {
    const callHistory = document.querySelector('.call-history');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    const callItem = document.createElement('div');
    callItem.className = 'call-item';
    
    callItem.innerHTML = `
        <div class="call-icon ${type}">
            <i class="fas fa-${type === 'outgoing' ? 'phone-alt' : type === 'incoming' ? 'phone' : 'phone-slash'}"></i>
        </div>
        <div class="call-details">
            <div class="call-contact">${call.name} ${call.avatar}</div>
            <div class="call-time">Сейчас${duration ? ` • ${duration}` : ''}</div>
        </div>
    `;
    
    callHistory.insertBefore(callItem, callHistory.firstChild);
}

// Планирование новых сообщений
function scheduleNewMessages() {
    // Случайные сообщения через случайные промежутки времени
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% шанс получить новое сообщение
            const randomChatIndex = Math.floor(Math.random() * chats.length);
            const chat = chats[randomChatIndex];
            
            // Случайное сообщение в зависимости от отправителя
            let messageText = '';
            switch (chat.name) {
                case 'Мама':
                    messageText = ['Ты поел?', 'Сделал уроки?', 'Когда придешь домой?', 'Не забудь помыть посуду!'][Math.floor(Math.random() * 4)];
                    break;
                case 'Папа':
                    messageText = ['Как дела в школе?', 'Помоги маме по дому', 'Не сиди долго за телефоном', 'Пойдем на рыбалку в выходные?'][Math.floor(Math.random() * 4)];
                    break;
                case 'Бабушка':
                    messageText = ['Кушал сегодня?', 'Тепло оделся?', 'Я пирожки испекла', 'Приезжай в гости'][Math.floor(Math.random() * 4)];
                    break;
                case 'Алкаш':
                    messageText = ['Где маи деньги?', 'Ты где?', 'Дай 100 рублей до завтра', 'Передай привет маме'][Math.floor(Math.random() * 4)];
                    break;
                case 'Одноклассник Петя':
                    messageText = ['Что задали по матеше?', 'Пойдем гулять?', 'Скинь ДЗ', 'Во что играешь?'][Math.floor(Math.random() * 4)];
                    break;
            }
            
            // Текущее время
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;
            
            // Добавление сообщения в чат
            const newMessage = {
                text: messageText,
                time: time,
                received: true
            };
            
            chat.messages.push(newMessage);
            chat.lastMessage = messageText;
            chat.time = time;
            chat.unread++;
            
            // Обновление UI, если мы не в этом чате
            const chatScreen = document.querySelector('.chat-screen');
            const currentChatName = document.querySelector('.contact-name').textContent;
            
            if (!chatScreen.classList.contains('active-screen') || currentChatName !== chat.name) {
                // Обновление списка чатов
                const chatItem = document.querySelector(`.chat-item[data-chat-id="${chat.id}"]`);
                const lastMessageElement = chatItem.querySelector('.chat-last-message');
                const timeElement = chatItem.querySelector('.chat-time');
                
                lastMessageElement.textContent = messageText;
                timeElement.textContent = time;
                
                // Обновление или добавление бейджа с непрочитанными
                let unreadBadge = chatItem.querySelector('.unread-badge');
                if (unreadBadge) {
                    unreadBadge.textContent = chat.unread;
                } else {
                    const chatMeta = chatItem.querySelector('.chat-meta');
                    unreadBadge = document.createElement('div');
                    unreadBadge.className = 'unread-badge';
                    unreadBadge.textContent = chat.unread;
                    chatMeta.appendChild(unreadBadge);
                }
                
                // Показ уведомления
                showNotification(chat.name, messageText, chat.avatar);
            } else {
                // Если мы в этом чате, добавляем сообщение в чат
                const chatMessages = document.querySelector('.chat-messages');
                const messageElement = document.createElement('div');
                messageElement.className = 'message received';
                
                messageElement.innerHTML = `
                    <div class="message-content">${messageText}</div>
                    <div class="message-time">${time}</div>
                `;
                
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Сбрасываем счетчик непрочитанных
                chat.unread = 0;
            }
        }
    }, 30000); // Проверка каждые 30 секунд
}

// Обновление бейджей на иконках приложений
function updateAppBadges() {
    // Подсчет непрочитанных сообщений в WhatsApp
    const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);
    
    // Обновление бейджа WhatsApp
    const whatsappApp = document.querySelector('.app[data-app="whatsapp"]');
    let whatsappBadge = whatsappApp.querySelector('.app-badge');
    
    if (totalUnread > 0) {
        if (!whatsappBadge) {
            whatsappBadge = document.createElement('div');
            whatsappBadge.className = 'app-badge';
            whatsappApp.querySelector('.app-icon').appendChild(whatsappBadge);
        }
        whatsappBadge.textContent = totalUnread;
    } else if (whatsappBadge) {
        whatsappBadge.remove();
    }
    
    // Обновление бейджа телефона (пропущенные звонки)
    const missedCalls = calls.filter(call => call.type === 'missed').length;
    const phoneApp = document.querySelector('.app[data-app="phone"]');
    let phoneBadge = phoneApp.querySelector('.app-badge');
    
    if (missedCalls > 0) {
        if (!phoneBadge) {
            phoneBadge = document.createElement('div');
            phoneBadge.className = 'app-badge';
            phoneApp.querySelector('.app-icon').appendChild(phoneBadge);
        }
        phoneBadge.textContent = missedCalls;
    } else if (phoneBadge) {
        phoneBadge.remove();
    }
}

// Показ уведомления
function showNotification(sender, message, avatar) {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Создаем обычное уведомление, если мы не на домашнем экране
    if (!document.querySelector('.home-screen').classList.contains('active-screen')) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        notification.innerHTML = `
            <div class="notification-icon">${avatar}</div>
            <div class="notification-content">
                <div class="notification-sender">${sender}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        document.querySelector('.screen').appendChild(notification);
        
        // Воспроизведение звука уведомления
        const notificationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
        notificationSound.volume = 0.5;
        notificationSound.play();
        
        // Удаление уведомления через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'notification-slide-out 0.3s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    } else {
        // Если мы на домашнем экране, показываем push-уведомление
        sendPushNotification('WhatsApp', `${sender}: ${message}`, '📱');
    }
    
    // Обновление бейджей на иконках приложений
    updateAppBadges();
}

// Функция для отправки push-уведомления
function sendPushNotification(title, message, icon, delay = 0) {
    setTimeout(() => {
        // Создаем элемент push-уведомления
        const pushNotification = document.createElement('div');
        pushNotification.className = 'push-notification';
        
        pushNotification.innerHTML = `
            <div class="push-notification-header">
                <div class="push-notification-app-icon">${icon}</div>
                <div class="push-notification-app-name">${title}</div>
                <div class="push-notification-time">Сейчас</div>
            </div>
            <div class="push-notification-content">${message}</div>
        `;
        
        document.querySelector('.screen').appendChild(pushNotification);
        
        // Воспроизведение звука уведомления
        const notificationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
        notificationSound.volume = 0.5;
        notificationSound.play();
        
        // Вибрация (если поддерживается)
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
        
        // Удаление уведомления через 5 секунд
        setTimeout(() => {
            pushNotification.style.animation = 'push-notification-slide-out 0.3s ease-in forwards';
            setTimeout(() => {
                pushNotification.remove();
            }, 300);
        }, 5000);
        
        // Обработчик нажатия на уведомление
        pushNotification.addEventListener('click', () => {
            pushNotification.remove();
            
            // Открываем соответствующее приложение
            if (title === 'WhatsApp') {
                openApp('whatsapp');
                // Если это сообщение, находим чат и открываем его
                const chat = chats.find(c => c.name === message.split(':')[0]);
                if (chat) {
                    setTimeout(() => openChat(chat), 100);
                }
            } else if (title === 'Телефон') {
                openApp('phone');
            }
        });
    }, delay);
}

// Добавляем стили для push-уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes notification-slide-out {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
    
    .app-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        background-color: red;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .app-icon {
        position: relative;
    }
    
    .push-notification {
        position: absolute;
        top: 60px;
        left: 10px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.95);
        color: black;
        padding: 12px 15px;
        border-radius: 12px;
        z-index: 100;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        animation: push-notification-slide-in 0.3s ease-out;
        cursor: pointer;
    }
    
    @keyframes push-notification-slide-in {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes push-notification-slide-out {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
    
    .push-notification-header {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }
    
    .push-notification-app-icon {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        margin-right: 8px;
        background-color: #25D366;
        color: white;
    }
    
    .push-notification-app-name {
        font-weight: bold;
        font-size: 14px;
        flex: 1;
    }
    
    .push-notification-time {
        font-size: 12px;
        color: #777;
    }
    
    .push-notification-content {
        font-size: 14px;
    }
`;
document.head.appendChild(style);

// Планирование случайных push-уведомлений
function scheduleRandomPushNotifications() {
    // Массив возможных уведомлений
    const possibleNotifications = [
        { title: 'Школа', message: 'Завтра контрольная по математике!', icon: '🏫', delay: 60000 },
        { title: 'YouTube', message: 'Новое видео от вашего любимого блогера', icon: '📺', delay: 120000 },
        { title: 'Игры', message: 'Твой друг приглашает тебя в игру', icon: '🎮', delay: 180000 },
        { title: 'Погода', message: 'Завтра ожидается дождь, не забудь зонт', icon: '☔', delay: 240000 }
    ];
    
    // Отправляем случайные уведомления
    possibleNotifications.forEach(notification => {
        setTimeout(() => {
            if (Math.random() < 0.7) { // 70% шанс показать уведомление
                sendPushNotification(notification.title, notification.message, notification.icon);
            }
        }, notification.delay);
    });
}

// Функция инициализации Flood-режима
function initFloodMode() {
    const floodToggle = document.getElementById('floodModeToggle');
    
    floodToggle.addEventListener('change', function() {
        if (this.checked) {
            // Включаем Flood-режим
            document.querySelector('.phone').classList.add('flood-mode-active');
            startFloodMode();
        } else {
            // Выключаем Flood-режим
            document.querySelector('.phone').classList.remove('flood-mode-active');
            stopFloodMode();
        }
    });
}

// Глобальные переменные для интервалов Flood-режима
let floodCallInterval;
let floodMessageInterval;

// Функция запуска Flood-режима
function startFloodMode() {
    // Показываем уведомление о включении режима
    sendPushNotification('Система', 'Flood-режим активирован!', '⚠️');
    
    // Начинаем спамить звонками каждые 10-15 секунд
    floodCallInterval = setInterval(() => {
        // Выбираем случайный контакт для звонка
        const randomCallIndex = Math.floor(Math.random() * incomingCalls.length);
        const randomCall = incomingCalls[randomCallIndex];
        
        // Показываем входящий звонок
        showIncomingCall(randomCall);
    }, Math.random() * 5000 + 10000); // 10-15 секунд
    
    // Начинаем спамить сообщениями каждые 3-7 секунд
    floodMessageInterval = setInterval(() => {
        // Выбираем случайный чат
        const randomChatIndex = Math.floor(Math.random() * chats.length);
        const chat = chats[randomChatIndex];
        
        // Случайное сообщение в зависимости от отправителя
        let messageText = '';
        switch (chat.name) {
            case 'Мама':
                messageText = ['ГДЕ ТЫ???', 'СРОЧНО ПЕРЕЗВОНИ!!!', 'ПОЧЕМУ НЕ ОТВЕЧАЕШЬ?!', 'НЕМЕДЛЕННО ДОМОЙ!!!'][Math.floor(Math.random() * 4)];
                break;
            case 'Папа':
                messageText = ['Перезвони срочно!', 'Где деньги?', 'Ты где пропал?', 'Мама волнуется!'][Math.floor(Math.random() * 4)];
                break;
            case 'Бабушка':
                messageText = ['Внучек, ответь!', 'Я волнуюсь!', 'Позвони бабушке!', 'Ты кушал сегодня???'][Math.floor(Math.random() * 4)];
                break;
            case 'Алкаш':
                messageText = ['ОТДАЙ МОИ ДЕНЬГИ!!!', 'Я ЖДУ ТЕБЯ У ШКОЛЫ!!!', 'ТЫ ГДЕ ПРЯЧЕШЬСЯ???', 'ВЫХОДИ ПОГОВОРИМ!!!'][Math.floor(Math.random() * 4)];
                break;
            case 'Одноклассник Петя':
                messageText = ['Ответь срочно!', 'Тебя ищет физрук!', 'За тобой пришли!', 'Ты попал в неприятности!'][Math.floor(Math.random() * 4)];
                break;
        }
        
        // Текущее время
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // Добавление сообщения в чат
        const newMessage = {
            text: messageText,
            time: time,
            received: true
        };
        
        chat.messages.push(newMessage);
        chat.lastMessage = messageText;
        chat.time = time;
        chat.unread++;
        
        // Обновление UI и показ уведомления
        updateChatUI(chat);
        showNotification(chat.name, messageText, chat.avatar);
    }, Math.random() * 4000 + 3000); // 3-7 секунд
    
    // Также добавим случайные push-уведомления от других приложений
    setInterval(() => {
        const apps = [
            { title: 'Instagram', message: 'У вас новое сообщение!', icon: '📷' },
            { title: 'TikTok', message: 'Ваше видео набирает популярность!', icon: '🎵' },
            { title: 'Школа', message: 'СРОЧНО! Родительское собрание!', icon: '🏫' },
            { title: 'Банк', message: 'Ваша карта заблокирована!', icon: '💳' },
            { title: 'Неизвестный номер', message: 'Перезвоните по номеру +7********45', icon: '❓' }
        ];
        
        const randomApp = apps[Math.floor(Math.random() * apps.length)];
        sendPushNotification(randomApp.title, randomApp.message, randomApp.icon);
    }, Math.random() * 8000 + 5000); // 5-13 секунд
}

// Функция остановки Flood-режима
function stopFloodMode() {
    // Очищаем интервалы
    clearInterval(floodCallInterval);
    clearInterval(floodMessageInterval);
    
    // Показываем уведомление о выключении режима
    sendPushNotification('Система', 'Flood-режим деактивирован', '✅');
}

// Вспомогательная функция для обновления UI чата
function updateChatUI(chat) {
    // Обновление списка чатов, если он отображается
    const chatItem = document.querySelector(`.chat-item[data-chat-id="${chat.id}"]`);
    if (chatItem) {
        const lastMessageElement = chatItem.querySelector('.chat-last-message');
        const timeElement = chatItem.querySelector('.chat-time');
        
        lastMessageElement.textContent = chat.lastMessage;
        timeElement.textContent = chat.time;
        
        // Обновление или добавление бейджа с непрочитанными
        let unreadBadge = chatItem.querySelector('.unread-badge');
        if (unreadBadge) {
            unreadBadge.textContent = chat.unread;
        } else {
            const chatMeta = chatItem.querySelector('.chat-meta');
            unreadBadge = document.createElement('div');
            unreadBadge.className = 'unread-badge';
            unreadBadge.textContent = chat.unread;
            chatMeta.appendChild(unreadBadge);
        }
    }
    
    // Обновление бейджей на иконках приложений
    updateAppBadges();
} 