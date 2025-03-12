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
    
    // Обработчики для навигационных кнопок Android
    document.querySelector('.back-nav').addEventListener('click', () => {
        // Имитация кнопки "Назад"
        const activeScreen = document.querySelector('.screen-content.active-screen');
        if (activeScreen) {
            if (activeScreen.classList.contains('chat-screen')) {
                document.querySelector('.chat-screen').classList.remove('active-screen');
                document.querySelector('.whatsapp-screen').classList.add('active-screen');
            } else {
                goToHomeScreen();
            }
        }
    });
    
    document.querySelector('.recent-nav').addEventListener('click', () => {
        // Имитация кнопки "Недавние приложения"
        sendPushNotification('Система', 'Недавние приложения', '📱');
    });
    
    // Инициализация экрана блокировки
    initLockScreen();
    
    // Функция инициализации полноэкранного режима
    initFullscreenMode();
    
    // Обновление функции инициализации
    initUI();
});

// Обновление времени
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.querySelector('.time').textContent = `${hours}:${minutes}`;
}

// Массив контактов
const contacts = [
    { id: 1, name: "Мама", phone: "+7 (999) 123-45-67", avatar: "👩" },
    { id: 2, name: "Папа", phone: "+7 (999) 765-43-21", avatar: "👨" },
    { id: 3, name: "Бабушка", phone: "+7 (999) 111-22-33", avatar: "👵" },
    { id: 4, name: "Дедушка", phone: "+7 (999) 444-55-66", avatar: "👴" },
    { id: 5, name: "Учитель", phone: "+7 (999) 777-88-99", avatar: "👩‍🏫" },
    { id: 6, name: "Друг Петя", phone: "+7 (999) 222-33-44", avatar: "👦" },
    { id: 7, name: "Подруга Маша", phone: "+7 (999) 555-66-77", avatar: "👧" }
];

// Массив недавних звонков
const recentCalls = [
    { name: "Мама", time: "Вчера, 18:30", type: "incoming", duration: "5:23" },
    { name: "Папа", time: "Вчера, 17:15", type: "outgoing", duration: "2:45" },
    { name: "Бабушка", time: "Позавчера, 12:10", type: "missed", duration: "" },
    { name: "Учитель", time: "3 дня назад, 14:22", type: "outgoing", duration: "1:30" }
];

// Инициализация приложения "Контакты"
function initContacts() {
    const contactsList = document.querySelector('.contacts-list');
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        
        contactElement.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-name">${contact.name}</div>
        `;
        
        contactElement.addEventListener('click', () => {
            openContactDetails(contact);
        });
        
        contactsList.appendChild(contactElement);
    });
    
    // Обработчик для кнопки добавления контакта
    document.querySelector('.add-contact-button').addEventListener('click', () => {
        sendPushNotification('Контакты', 'Функция добавления контакта недоступна', '👤');
    });
}

// Открытие деталей контакта
function openContactDetails(contact) {
    sendPushNotification('Контакты', `Открыт контакт: ${contact.name}`, '👤');
}

// Инициализация приложения "Телефон"
function initPhone() {
    // Инициализация вкладок
    document.querySelectorAll('.phone-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Активация вкладки
            document.querySelectorAll('.phone-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Показ соответствующего экрана
            document.querySelectorAll('.dialer-screen, .recent-screen, .contacts-tab-screen').forEach(screen => {
                screen.classList.remove('active-tab');
            });
            
            if (tabName === 'dialer') {
                document.querySelector('.dialer-screen').classList.add('active-tab');
            } else if (tabName === 'recent') {
                document.querySelector('.recent-screen').classList.add('active-tab');
                loadRecentCalls();
            } else if (tabName === 'contacts') {
                document.querySelector('.contacts-tab-screen').classList.add('active-tab');
                loadPhoneContacts();
            }
        });
    });
    
    // Инициализация клавиатуры набора номера
    const phoneNumber = document.querySelector('.phone-number');
    
    document.querySelectorAll('.dialer-key').forEach(key => {
        key.addEventListener('click', () => {
            const digit = key.getAttribute('data-key');
            phoneNumber.value += digit;
        });
    });
    
    // Кнопка очистки номера
    document.querySelector('.clear-number').addEventListener('click', () => {
        phoneNumber.value = phoneNumber.value.slice(0, -1);
    });
    
    // Кнопка вызова
    document.querySelector('.call-button').addEventListener('click', () => {
        if (phoneNumber.value.trim() === '') {
            sendPushNotification('Телефон', 'Введите номер телефона', '📱');
            return;
        }
        
        initiateCall(phoneNumber.value);
    });
    
    // Инициализация экрана входящего звонка
    document.querySelector('.decline-call').addEventListener('click', () => {
        declineCall();
    });
    
    document.querySelector('.accept-call').addEventListener('click', () => {
        acceptCall();
    });
    
    // Инициализация экрана активного звонка
    document.querySelector('.end-call').addEventListener('click', () => {
        endCall();
    });
    
    document.querySelectorAll('.call-control').forEach(control => {
        control.addEventListener('click', () => {
            control.classList.toggle('active');
        });
    });
}

// Загрузка недавних звонков
function loadRecentCalls() {
    const recentCallsList = document.querySelector('.recent-calls');
    recentCallsList.innerHTML = '';
    
    recentCalls.forEach(call => {
        const callElement = document.createElement('div');
        callElement.className = `recent-call-item ${call.type}`;
        
        let icon = '';
        if (call.type === 'incoming') {
            icon = '<i class="fas fa-phone-alt incoming-icon"></i>';
        } else if (call.type === 'outgoing') {
            icon = '<i class="fas fa-phone-alt outgoing-icon"></i>';
        } else if (call.type === 'missed') {
            icon = '<i class="fas fa-phone-slash missed-icon"></i>';
        }
        
        callElement.innerHTML = `
            <div class="call-icon">${icon}</div>
            <div class="call-details">
                <div class="call-name">${call.name}</div>
                <div class="call-time">${call.time}</div>
            </div>
            <button class="call-back"><i class="fas fa-phone-alt"></i></button>
        `;
        
        callElement.querySelector('.call-back').addEventListener('click', () => {
            initiateCall(call.name);
        });
        
        recentCallsList.appendChild(callElement);
    });
}

// Загрузка контактов в приложении "Телефон"
function loadPhoneContacts() {
    const contactsList = document.querySelector('.contacts-in-phone');
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        
        contactElement.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-phone">${contact.phone}</div>
            </div>
            <button class="call-contact"><i class="fas fa-phone-alt"></i></button>
        `;
        
        contactElement.querySelector('.call-contact').addEventListener('click', () => {
            initiateCall(contact.name);
        });
        
        contactsList.appendChild(contactElement);
    });
}

// Инициация звонка
function initiateCall(nameOrNumber) {
    // Находим контакт по имени или номеру
    let callerName = nameOrNumber;
    let callerAvatar = '👤';
    
    const contact = contacts.find(c => c.name === nameOrNumber || c.phone === nameOrNumber);
    if (contact) {
        callerName = contact.name;
        callerAvatar = contact.avatar;
    }
    
    // Показываем экран активного звонка
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    document.querySelector('.active-call-screen').classList.add('active-screen');
    
    // Обновляем информацию о звонящем
    document.querySelector('.active-call-screen .caller-name').textContent = callerName;
    document.querySelector('.active-call-screen .caller-avatar').textContent = callerAvatar;
    
    // Запускаем таймер звонка
    startCallTimer();
    
    // Добавляем звонок в историю
    const now = new Date();
    const time = `Сегодня, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    recentCalls.unshift({
        name: callerName,
        time: time,
        type: 'outgoing',
        duration: '0:00'
    });
}

// Входящий звонок
function incomingCall(callerName = 'Мама') {
    // Находим контакт
    const contact = contacts.find(c => c.name === callerName);
    let callerAvatar = '👤';
    
    if (contact) {
        callerAvatar = contact.avatar;
    }
    
    // Показываем экран входящего звонка
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    document.querySelector('.incoming-call-screen').classList.add('active-screen');
    
    // Обновляем информацию о звонящем
    document.querySelector('.incoming-call-screen .caller-name').textContent = callerName;
    document.querySelector('.incoming-call-screen .caller-avatar').textContent = callerAvatar;
    
    // Воспроизводим звук звонка
    playRingtone();
}

// Принятие звонка
function acceptCall() {
    // Останавливаем звук звонка
    stopRingtone();
    
    // Показываем экран активного звонка
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    document.querySelector('.active-call-screen').classList.add('active-screen');
    
    // Копируем информацию о звонящем
    const callerName = document.querySelector('.incoming-call-screen .caller-name').textContent;
    const callerAvatar = document.querySelector('.incoming-call-screen .caller-avatar').textContent;
    
    document.querySelector('.active-call-screen .caller-name').textContent = callerName;
    document.querySelector('.active-call-screen .caller-avatar').textContent = callerAvatar;
    
    // Запускаем таймер звонка
    startCallTimer();
    
    // Добавляем звонок в историю
    const now = new Date();
    const time = `Сегодня, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    recentCalls.unshift({
        name: callerName,
        time: time,
        type: 'incoming',
        duration: '0:00'
    });
}

// Отклонение звонка
function declineCall() {
    // Останавливаем звук звонка
    stopRingtone();
    
    // Возвращаемся на предыдущий экран
    document.querySelector('.incoming-call-screen').classList.remove('active-screen');
    document.querySelector('.home-screen').classList.add('active-screen');
    
    // Добавляем пропущенный звонок в историю
    const callerName = document.querySelector('.incoming-call-screen .caller-name').textContent;
    const now = new Date();
    const time = `Сегодня, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    recentCalls.unshift({
        name: callerName,
        time: time,
        type: 'missed',
        duration: ''
    });
    
    // Показываем уведомление о пропущенном звонке
    sendPushNotification('Телефон', `Пропущенный вызов от ${callerName}`, '📱');
}

// Завершение звонка
function endCall() {
    // Останавливаем таймер звонка
    stopCallTimer();
    
    // Возвращаемся на предыдущий экран
    document.querySelector('.active-call-screen').classList.remove('active-screen');
    document.querySelector('.home-screen').classList.add('active-screen');
    
    // Обновляем длительность последнего звонка в истории
    if (recentCalls.length > 0) {
        recentCalls[0].duration = document.querySelector('.call-duration').textContent;
    }
}

// Таймер звонка
let callTimer;
let callSeconds = 0;

function startCallTimer() {
    callSeconds = 0;
    updateCallDuration();
    
    callTimer = setInterval(() => {
        callSeconds++;
        updateCallDuration();
    }, 1000);
}

function stopCallTimer() {
    clearInterval(callTimer);
}

function updateCallDuration() {
    const minutes = Math.floor(callSeconds / 60);
    const seconds = callSeconds % 60;
    
    document.querySelector('.call-duration').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Звук звонка
function playRingtone() {
    // Имитация звука звонка
    console.log('Звук звонка: дрррр-дрррр');
}

function stopRingtone() {
    // Остановка звука звонка
    console.log('Звук звонка остановлен');
}

// Обновляем функцию инициализации приложений
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
    
    // Инициализация Dock-приложений
    initDockApps();
    
    // Инициализация Flood-режима
    initFloodMode();
    
    // Инициализация чата с возможностью отправки сообщений
    initChatInput();
    
    // Инициализация приложения "Контакты"
    initContacts();
    
    // Инициализация приложения "Телефон"
    initPhone();
    
    // Добавляем случайный входящий звонок через некоторое время
    setTimeout(() => {
        // Случайный выбор контакта для звонка
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        incomingCall(randomContact.name);
    }, 60000 + Math.random() * 120000); // Звонок через 1-3 минуты
}

// Добавление анимаций при переключении экранов
function openApp(appName) {
    // Анимация исчезновения текущего экрана
    const currentScreen = document.querySelector('.active-screen');
    if (currentScreen) {
        currentScreen.style.animation = 'fadeOut 0.2s ease forwards';
        
        setTimeout(() => {
            // Скрываем все экраны
            document.querySelectorAll('.screen-content, .home-screen').forEach(screen => {
                screen.classList.remove('active-screen');
                screen.style.animation = '';
            });
            
            // Открываем нужный экран с анимацией
            let targetScreen;
            
            switch(appName) {
                case 'geometrydash':
                    targetScreen = document.querySelector('.geometry-dash-screen');
                    break;
                case 'whatsapp':
                    targetScreen = document.querySelector('.whatsapp-screen');
                    
                    // Сбрасываем счетчик непрочитанных сообщений
                    let totalUnread = 0;
                    chats.forEach(chat => {
                        totalUnread += chat.unread;
                        chat.unread = 0;
                    });
                    
                    // Обновляем UI
                    initWhatsApp();
                    updateAppBadges();
                    break;
                case 'phone':
                    targetScreen = document.querySelector('.phone-screen');
                    break;
                case 'settings':
                    targetScreen = document.querySelector('.settings-screen');
                    break;
                case 'camera':
                    targetScreen = document.querySelector('.camera-screen');
                    break;
                case 'playmarket':
                    targetScreen = document.querySelector('.playmarket-screen');
                    initPlayMarket();
                    break;
                case 'contacts':
                    targetScreen = document.querySelector('.contacts-screen');
                    initContacts();
                    break;
                case 'messages':
                    // Показываем уведомление, что приложение недоступно
                    sendPushNotification('Система', 'Приложение "Сообщения" недоступно', '📱');
                    targetScreen = document.querySelector('.home-screen');
                    break;
                case 'chrome':
                    // Показываем уведомление, что приложение недоступно
                    sendPushNotification('Система', 'Приложение "Chrome" недоступно', '🌐');
                    targetScreen = document.querySelector('.home-screen');
                    break;
                default:
                    targetScreen = document.querySelector('.home-screen');
            }
            
            if (targetScreen) {
                targetScreen.classList.add('active-screen');
                targetScreen.style.animation = 'fadeIn 0.3s ease forwards';
            }
        }, 200);
    }
}

// Добавляем стили для недавних звонков
document.head.insertAdjacentHTML('beforeend', `
<style>
.recent-call-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
}

.call-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
}

.incoming-icon {
    color: #4CD964;
}

.outgoing-icon {
    color: #007AFF;
}

.missed-icon {
    color: #FF3B30;
}

.call-details {
    flex: 1;
}

.call-name {
    font-size: 16px;
    color: #212121;
}

.call-time {
    font-size: 14px;
    color: #757575;
}

.call-back, .call-contact {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #4CD964;
    color: white;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
}

.contact-phone {
    font-size: 14px;
    color: #757575;
}

.contact-info {
    flex: 1;
}
</style>
`);

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
    
    // Инициализация Dock-приложений
    initDockApps();
    
    // Инициализация Flood-режима
    initFloodMode();
    
    // Инициализация чата с возможностью отправки сообщений
    initChatInput();
    
    // Инициализация приложения "Контакты"
    initContacts();
    
    // Инициализация приложения "Телефон"
    initPhone();
    
    // Добавляем случайный входящий звонок через некоторое время
    setTimeout(() => {
        // Случайный выбор контакта для звонка
        const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
        incomingCall(randomContact.name);
    }, 60000 + Math.random() * 120000); // Звонок через 1-3 минуты
}

// Открытие приложения
function openApp(appName) {
    // Скрываем все экраны
    document.querySelectorAll('.screen-content, .home-screen').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    // Открываем нужный экран
    switch(appName) {
        case 'geometrydash':
            document.querySelector('.geometry-dash-screen').classList.add('active-screen');
            break;
        case 'whatsapp':
            document.querySelector('.whatsapp-screen').classList.add('active-screen');
            
            // Сбрасываем счетчик непрочитанных сообщений
            let totalUnread = 0;
            chats.forEach(chat => {
                totalUnread += chat.unread;
                chat.unread = 0;
            });
            
            // Обновляем UI
            initWhatsApp();
            updateAppBadges();
            break;
        case 'phone':
            document.querySelector('.phone-screen').classList.add('active-screen');
            break;
        case 'settings':
            document.querySelector('.settings-screen').classList.add('active-screen');
            break;
        case 'camera':
            document.querySelector('.camera-screen').classList.add('active-screen');
            initCamera();
            break;
        case 'playmarket':
            document.querySelector('.playmarket-screen').classList.add('active-screen');
            initPlayMarket();
            break;
        case 'messages':
            // Показываем уведомление, что приложение недоступно
            sendPushNotification('Система', 'Приложение "Сообщения" недоступно', '📱');
            document.querySelector('.home-screen').classList.add('active-screen');
            break;
        case 'chrome':
            // Показываем уведомление, что приложение недоступно
            sendPushNotification('Система', 'Приложение "Chrome" недоступно', '🌐');
            document.querySelector('.home-screen').classList.add('active-screen');
            break;
        default:
            document.querySelector('.home-screen').classList.add('active-screen');
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
    // Скрываем все экраны
    document.querySelectorAll('.screen-content, .home-screen').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    
    // Показываем домашний экран
    document.querySelector('.home-screen').classList.add('active-screen');
}

// Инициализация WhatsApp
function initWhatsApp() {
    const chatList = document.querySelector('.chat-list');
    
    // Очищаем список чатов
    chatList.innerHTML = '';
    
    // Добавляем чаты
    chats.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.className = 'chat-item';
        chatElement.setAttribute('data-id', chat.id);
        
        chatElement.innerHTML = `
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-header">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-time">${chat.time}</div>
                </div>
                <div class="chat-last-message">${chat.lastMessage}</div>
            </div>
            ${chat.unread > 0 ? `<div class="chat-badge">${chat.unread}</div>` : ''}
        `;
        
        // Обработчик нажатия на чат
        chatElement.addEventListener('click', () => {
            openChat(chat);
        });
        
        chatList.appendChild(chatElement);
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
        
        if (message.type === 'voice') {
            // Голосовое сообщение
            messageElement.className = `message ${message.received ? 'received' : 'sent'} voice-message`;
            messageElement.innerHTML = `
                <div class="voice-message-content">
                    <i class="fas fa-play voice-play-button"></i>
                    <div class="voice-waveform"></div>
                    <div class="voice-duration">${message.duration}</div>
                </div>
                <div class="message-time">${message.time}</div>
            `;
        } else if (message.type === 'photo') {
            // Фото сообщение
            messageElement.className = `message ${message.received ? 'received' : 'sent'} photo-message`;
            messageElement.innerHTML = `
                <div class="photo-message-content">
                    <img src="${message.photoUrl}" alt="Photo" class="message-photo">
                </div>
                <div class="message-time">${message.time}</div>
            `;
        } else {
            // Обычное текстовое сообщение
            messageElement.className = `message ${message.received ? 'received' : 'sent'}`;
            messageElement.innerHTML = `
                <div class="message-content">${message.text}</div>
                <div class="message-time">${message.time}</div>
            `;
        }
        
        chatMessages.appendChild(messageElement);
    });
    
    // Прокрутка к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Сброс счетчика непрочитанных сообщений
    const chatItem = document.querySelector(`.chat-item[data-id="${chat.id}"]`);
    const unreadBadge = chatItem.querySelector('.chat-badge');
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
                const chatItem = document.querySelector(`.chat-item[data-id="${chat.id}"]`);
                const lastMessageElement = chatItem.querySelector('.chat-last-message');
                const timeElement = chatItem.querySelector('.chat-time');
                
                lastMessageElement.textContent = messageText;
                timeElement.textContent = time;
                
                // Обновление или добавление бейджа с непрочитанными
                let unreadBadge = chatItem.querySelector('.chat-badge');
                if (unreadBadge) {
                    unreadBadge.textContent = chat.unread;
                } else {
                    const chatMeta = chatItem.querySelector('.chat-info');
                    unreadBadge = document.createElement('div');
                    unreadBadge.className = 'chat-badge';
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

// Глобальные переменные для интервалов Flood-режима
let floodCallInterval;
let floodMessageInterval;
let floodNotificationInterval;

// Функция инициализации Flood-режима
function initFloodMode() {
    // Получаем переключатель из настроек (а не с домашнего экрана)
    const floodToggle = document.getElementById('floodModeToggle');
    
    if (!floodToggle) {
        console.error('Переключатель Flood-режима не найден!');
        return;
    }
    
    floodToggle.addEventListener('change', function() {
        if (this.checked) {
            // Включаем Flood-режим
            document.querySelector('.phone').classList.add('flood-mode-active');
            startFloodMode();
            
            // Добавляем анимацию к элементу настроек
            const floodModeItem = document.getElementById('floodModeItem');
            if (floodModeItem) {
                floodModeItem.style.backgroundColor = 'rgba(255, 59, 48, 0.1)';
            }
            
            // Показываем уведомление о включении режима
            sendPushNotification('Система', 'Flood-режим активирован! Держись крепче!', '⚠️');
        } else {
            // Выключаем Flood-режим
            document.querySelector('.phone').classList.remove('flood-mode-active');
            stopFloodMode();
            
            // Возвращаем обычный фон элементу настроек
            const floodModeItem = document.getElementById('floodModeItem');
            if (floodModeItem) {
                floodModeItem.style.backgroundColor = 'white';
            }
            
            // Показываем уведомление о выключении режима
            sendPushNotification('Система', 'Flood-режим деактивирован', '✅');
        }
    });
    
    // Добавляем эффект "секретной функции"
    const floodModeItem = document.getElementById('floodModeItem');
    if (floodModeItem) {
        floodModeItem.addEventListener('click', function(e) {
            // Не активируем при клике на переключатель
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN' && e.target.tagName !== 'LABEL') {
                // Показываем подсказку
                sendPushNotification('Настройки', 'Это секретная функция для крутых пацанов!', '🔥');
            }
        });
    }
}

// Функция запуска Flood-режима
function startFloodMode() {
    console.log('Запуск Flood-режима');
    
    // Начинаем спамить звонками каждые 5-10 секунд
    floodCallInterval = setInterval(() => {
        // Выбираем случайный контакт для звонка
        const randomCallIndex = Math.floor(Math.random() * incomingCalls.length);
        const randomCall = incomingCalls[randomCallIndex];
        
        // Показываем входящий звонок
        showIncomingCall(randomCall);
    }, Math.random() * 5000 + 5000); // 5-10 секунд
    
    // Начинаем спамить сообщениями каждые 2-5 секунд
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
    }, Math.random() * 3000 + 2000); // 2-5 секунд
    
    // Также добавим случайные push-уведомления от других приложений
    floodNotificationInterval = setInterval(() => {
        const apps = [
            { title: 'Instagram', message: 'У вас новое сообщение!', icon: '📷' },
            { title: 'TikTok', message: 'Ваше видео набирает популярность!', icon: '🎵' },
            { title: 'Школа', message: 'СРОЧНО! Родительское собрание!', icon: '🏫' },
            { title: 'Банк', message: 'Ваша карта заблокирована!', icon: '💳' },
            { title: 'Неизвестный номер', message: 'Перезвоните по номеру +7********45', icon: '❓' }
        ];
        
        const randomApp = apps[Math.floor(Math.random() * apps.length)];
        sendPushNotification(randomApp.title, randomApp.message, randomApp.icon);
    }, Math.random() * 4000 + 3000); // 3-7 секунд
}

// Функция остановки Flood-режима
function stopFloodMode() {
    console.log('Остановка Flood-режима');
    
    // Очищаем интервалы
    if (floodCallInterval) clearInterval(floodCallInterval);
    if (floodMessageInterval) clearInterval(floodMessageInterval);
    if (floodNotificationInterval) clearInterval(floodNotificationInterval);
}

// Вспомогательная функция для обновления UI чата
function updateChatUI(chat) {
    // Находим элемент чата в списке
    const chatElement = document.querySelector(`.chat-item[data-id="${chat.id}"]`);
    
    if (chatElement) {
        // Обновляем последнее сообщение и время
        chatElement.querySelector('.chat-last-message').textContent = chat.lastMessage;
        chatElement.querySelector('.chat-time').textContent = chat.time;
        
        // Обновляем бейдж с непрочитанными сообщениями
        const badgeElement = chatElement.querySelector('.chat-badge');
        if (chat.unread > 0) {
            if (badgeElement) {
                badgeElement.textContent = chat.unread;
            } else {
                const newBadge = document.createElement('div');
                newBadge.className = 'chat-badge';
                newBadge.textContent = chat.unread;
                chatElement.appendChild(newBadge);
            }
        } else if (badgeElement) {
            badgeElement.remove();
        }
    }
}

// Добавляем функцию для отправки сообщений в чате
function initChatInput() {
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-message');
    
    // Функция отправки сообщения
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text === '') return;
        
        // Получаем текущий чат
        const chatName = document.querySelector('.contact-name').textContent;
        const currentChat = chats.find(c => c.name === chatName);
        
        if (!currentChat) return;
        
        // Текущее время
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // Создание сообщения
        const newMessage = {
            text: text,
            time: time,
            received: false
        };
        
        // Добавление сообщения в чат
        currentChat.messages.push(newMessage);
        currentChat.lastMessage = text;
        currentChat.time = time;
        
        // Обновление UI
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        messageElement.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${time}</div>
        `;
        
        document.querySelector('.chat-messages').appendChild(messageElement);
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
        
        // Очистка поля ввода
        chatInput.value = '';
        
        // Обновляем список чатов
        updateChatUI(currentChat);
        
        // Генерация автоматического ответа через 1-3 секунды
        setTimeout(() => {
            generateAutoReply(currentChat);
        }, Math.random() * 2000 + 1000);
    }
    
    // Обработчик нажатия на кнопку отправки
    sendButton.addEventListener('click', sendMessage);
    
    // Обработчик нажатия Enter в поле ввода
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Добавляем кнопки для голосовых сообщений и фото
    addVoiceMessageButton();
    addPhotoButton();
}

// Функция для генерации автоматического ответа
function generateAutoReply(chat) {
    // Текущее время
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    // Выбор ответа в зависимости от контакта
    let replyText = '';
    
    switch(chat.name) {
        case 'Мама':
            const mamaReplies = [
                "Немедленно сделай уроки!",
                "Ты покормил кота?",
                "Что ты ел сегодня?",
                "Я звонила твоему учителю",
                "Папа будет недоволен твоими оценками",
                "Не забудь помыть посуду",
                "Бабушка спрашивала о тебе"
            ];
            replyText = mamaReplies[Math.floor(Math.random() * mamaReplies.length)];
            break;
            
        case 'Папа':
            const papaReplies = [
                "Как дела в школе?",
                "Помоги маме по дому",
                "Я задержусь на работе",
                "Не сиди долго за телефоном",
                "Купи хлеба по дороге домой",
                "Не забудь про тренировку"
            ];
            replyText = papaReplies[Math.floor(Math.random() * papaReplies.length)];
            break;
            
        case 'Бабушка':
            const grandmaReplies = [
                "Кушал сегодня?",
                "Я пирожки испекла",
                "Приезжай на выходных",
                "Как твои оценки, внучек?",
                "Тепло ли ты одеваешься?",
                "Я связала тебе новые носочки"
            ];
            replyText = grandmaReplies[Math.floor(Math.random() * grandmaReplies.length)];
            break;
            
        case 'Алкаш':
            const alkashReplies = [
                "Отдавай деньги!!!",
                "Я тебя найду",
                "Ты где шкет?",
                "Не обманывай меня",
                "Я все равно тебя поймаю",
                "Скажи маме чтоб позвонила"
            ];
            replyText = alkashReplies[Math.floor(Math.random() * alkashReplies.length)];
            break;
            
        case 'Одноклассник Петя':
            const petyaReplies = [
                "Что задали по матеше?",
                "Пойдем гулять?",
                "Скинь ответы по физике",
                "Ты видел новую игру?",
                "Училка опять злая была",
                "Завтра контрольная?"
            ];
            replyText = petyaReplies[Math.floor(Math.random() * petyaReplies.length)];
            break;
            
        default:
            const defaultReplies = [
                "Ок",
                "Понятно",
                "Хорошо",
                "Не понял тебя",
                "???",
                "Перезвони мне"
            ];
            replyText = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }
    
    // Создание сообщения
    const newMessage = {
        text: replyText,
        time: time,
        received: true
    };
    
    // Добавление сообщения в чат
    chat.messages.push(newMessage);
    chat.lastMessage = replyText;
    chat.time = time;
    chat.unread++;
    
    // Обновление UI
    updateChatUI(chat);
    
    // Если чат открыт, добавляем сообщение на экран
    if (document.querySelector('.chat-screen').classList.contains('active-screen') && 
        document.querySelector('.contact-name').textContent === chat.name) {
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message received';
        
        messageElement.innerHTML = `
            <div class="message-content">${replyText}</div>
            <div class="message-time">${time}</div>
        `;
        
        document.querySelector('.chat-messages').appendChild(messageElement);
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
        
        // Сбрасываем счетчик непрочитанных
        chat.unread = 0;
    } else {
        // Показываем уведомление
        showNotification(chat.name, replyText, chat.avatar);
    }
    
    // Обновляем бейджи на иконках приложений
    updateAppBadges();
}

// Функция для добавления голосовых сообщений
function addVoiceMessageButton() {
    const chatInputContainer = document.querySelector('.chat-input-container');
    const chatInput = document.querySelector('.chat-input');
    
    // Добавляем кнопку для голосовых сообщений
    const voiceButton = document.createElement('button');
    voiceButton.className = 'voice-message-button';
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
    
    // Вставляем кнопку перед полем ввода
    chatInputContainer.insertBefore(voiceButton, chatInput);
    
    // Добавляем обработчик для записи голосового сообщения
    let isRecording = false;
    let recordingTimeout;
    
    voiceButton.addEventListener('mousedown', () => {
        isRecording = true;
        voiceButton.classList.add('recording');
        
        // Показываем индикатор записи
        const recordingIndicator = document.createElement('div');
        recordingIndicator.className = 'recording-indicator';
        recordingIndicator.innerHTML = `
            <div class="recording-wave"></div>
            <div class="recording-time">0:00</div>
        `;
        chatInputContainer.appendChild(recordingIndicator);
        
        // Имитируем запись (через 2-5 секунд отправляем голосовое)
        recordingTimeout = setTimeout(() => {
            if (isRecording) {
                sendVoiceMessage();
            }
        }, Math.random() * 3000 + 2000);
    });
    
    // Отпускание кнопки - отправка сообщения
    voiceButton.addEventListener('mouseup', () => {
        if (isRecording) {
            clearTimeout(recordingTimeout);
            sendVoiceMessage();
        }
    });
    
    // Функция отправки голосового сообщения
    function sendVoiceMessage() {
        isRecording = false;
        voiceButton.classList.remove('recording');
        
        // Удаляем индикатор записи
        const recordingIndicator = document.querySelector('.recording-indicator');
        if (recordingIndicator) {
            recordingIndicator.remove();
        }
        
        // Получаем текущий чат
        const chatName = document.querySelector('.contact-name').textContent;
        const currentChat = chats.find(c => c.name === chatName);
        
        if (!currentChat) return;
        
        // Текущее время
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // Длительность голосового (случайная от 0:01 до 0:59)
        const voiceDuration = `0:${Math.floor(Math.random() * 59 + 1).toString().padStart(2, '0')}`;
        
        // Создание голосового сообщения
        const newMessage = {
            type: 'voice',
            duration: voiceDuration,
            time: time,
            received: false
        };
        
        // Добавление сообщения в чат
        currentChat.messages.push(newMessage);
        currentChat.lastMessage = '🎤 Голосовое сообщение';
        currentChat.time = time;
        
        // Обновление UI
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent voice-message';
        
        messageElement.innerHTML = `
            <div class="voice-message-content">
                <i class="fas fa-play voice-play-button"></i>
                <div class="voice-waveform"></div>
                <div class="voice-duration">${voiceDuration}</div>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        document.querySelector('.chat-messages').appendChild(messageElement);
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
        
        // Обновляем список чатов
        updateChatUI(currentChat);
        
        // Генерация автоматического ответа через 1-3 секунды
        setTimeout(() => {
            generateAutoReply(currentChat);
        }, Math.random() * 2000 + 1000);
    }
}

// Добавляем функцию для отправки фото
function addPhotoButton() {
    const chatInputContainer = document.querySelector('.chat-input-container');
    const sendButton = document.querySelector('.send-message');
    
    // Добавляем кнопку для отправки фото
    const photoButton = document.createElement('button');
    photoButton.className = 'photo-button';
    photoButton.innerHTML = '<i class="fas fa-image"></i>';
    
    // Вставляем кнопку перед кнопкой отправки
    chatInputContainer.insertBefore(photoButton, sendButton);
    
    // Обработчик нажатия на кнопку фото
    photoButton.addEventListener('click', () => {
        // Показываем диалог выбора фото
        const photoDialog = document.createElement('div');
        photoDialog.className = 'photo-dialog';
        photoDialog.innerHTML = `
            <div class="photo-dialog-header">
                <button class="photo-dialog-close"><i class="fas fa-times"></i></button>
                <div class="photo-dialog-title">Отправить фото</div>
            </div>
            <div class="photo-options">
                <div class="photo-option" data-source="camera">
                    <i class="fas fa-camera"></i>
                    <span>Камера</span>
                </div>
                <div class="photo-option" data-source="gallery">
                    <i class="fas fa-images"></i>
                    <span>Галерея</span>
                </div>
            </div>
        `;
        
        document.querySelector('.phone').appendChild(photoDialog);
        
        // Анимация появления
        setTimeout(() => {
            photoDialog.classList.add('show');
        }, 10);
        
        // Обработчик закрытия диалога
        photoDialog.querySelector('.photo-dialog-close').addEventListener('click', () => {
            photoDialog.classList.remove('show');
            setTimeout(() => {
                photoDialog.remove();
            }, 300);
        });
        
        // Обработчики выбора источника фото
        photoDialog.querySelectorAll('.photo-option').forEach(option => {
            option.addEventListener('click', () => {
                const source = option.getAttribute('data-source');
                photoDialog.classList.remove('show');
                
                setTimeout(() => {
                    photoDialog.remove();
                    sendPhoto(source);
                }, 300);
            });
        });
    });
    
    // Функция отправки фото
    function sendPhoto(source) {
        // Получаем текущий чат
        const chatName = document.querySelector('.contact-name').textContent;
        const currentChat = chats.find(c => c.name === chatName);
        
        if (!currentChat) return;
        
        // Текущее время
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // URL фото (используем заглушку)
        const photoUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mendigo_na_baixa_pombalina.jpg';
        
        // Создание сообщения с фото
        const newMessage = {
            type: 'photo',
            photoUrl: photoUrl,
            time: time,
            received: false
        };
        
        // Добавление сообщения в чат
        currentChat.messages.push(newMessage);
        currentChat.lastMessage = '📷 Фото';
        currentChat.time = time;
        
        // Обновление UI
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent photo-message';
        
        messageElement.innerHTML = `
            <div class="photo-message-content">
                <img src="${photoUrl}" alt="Photo" class="message-photo">
            </div>
            <div class="message-time">${time}</div>
        `;
        
        document.querySelector('.chat-messages').appendChild(messageElement);
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
        
        // Обновляем список чатов
        updateChatUI(currentChat);
        
        // Генерация автоматического ответа через 1-3 секунды
        setTimeout(() => {
            generateAutoReply(currentChat);
        }, Math.random() * 2000 + 1000);
    }
}

// Функция для инициализации камеры
function initCamera() {
    const cameraView = document.getElementById('cameraView');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const takePhotoBtn = document.querySelector('.take-photo');
    const photoBackBtn = document.querySelector('.photo-back');
    const savePhotoBtn = document.querySelector('.save-photo');
    const sharePhotoBtn = document.querySelector('.share-photo');
    
    // Делаем фото (всегда одно и то же изображение)
    function takePhoto() {
        // Показываем экран просмотра фото
        document.querySelector('.camera-screen').classList.remove('active-screen');
        document.querySelector('.photo-view-screen').classList.add('active-screen');
        
        // Устанавливаем фиксированное изображение
        capturedPhoto.src = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Mendigo_na_baixa_pombalina.jpg';
    }
    
    // Возврат к камере
    function backToCamera() {
        document.querySelector('.photo-view-screen').classList.remove('active-screen');
        document.querySelector('.camera-screen').classList.add('active-screen');
    }
    
    // Сохранение фото
    function savePhoto() {
        sendPushNotification('Камера', 'Фото сохранено в галерею', '📷');
        
        // Добавляем фото в галерею (имитация)
        setTimeout(() => {
            document.querySelector('.photo-view-screen').classList.remove('active-screen');
            goToHomeScreen();
        }, 1000);
    }
    
    // Поделиться фото
    function sharePhoto() {
        // Показываем диалог выбора приложения для отправки
        const shareDialog = document.createElement('div');
        shareDialog.className = 'share-dialog';
        shareDialog.innerHTML = `
            <div class="share-dialog-header">Поделиться через</div>
            <div class="share-apps">
                <div class="share-app" data-app="whatsapp">
                    <div class="share-app-icon"><i class="fab fa-whatsapp"></i></div>
                    <div class="share-app-name">WhatsApp</div>
                </div>
                <div class="share-app" data-app="instagram">
                    <div class="share-app-icon"><i class="fab fa-instagram"></i></div>
                    <div class="share-app-name">Instagram</div>
                </div>
                <div class="share-app" data-app="telegram">
                    <div class="share-app-icon"><i class="fab fa-telegram"></i></div>
                    <div class="share-app-name">Telegram</div>
                </div>
            </div>
            <button class="share-cancel">Отмена</button>
        `;
        
        document.querySelector('.phone').appendChild(shareDialog);
        
        // Обработчики для диалога
        shareDialog.querySelector('.share-cancel').addEventListener('click', () => {
            shareDialog.remove();
        });
        
        shareDialog.querySelectorAll('.share-app').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.getAttribute('data-app');
                shareDialog.remove();
                sendPushNotification('Камера', `Фото отправлено через ${appName}`, '📷');
                
                setTimeout(() => {
                    document.querySelector('.photo-view-screen').classList.remove('active-screen');
                    goToHomeScreen();
                }, 1000);
            });
        });
    }
    
    // Назначаем обработчики событий
    takePhotoBtn.addEventListener('click', takePhoto);
    photoBackBtn.addEventListener('click', backToCamera);
    savePhotoBtn.addEventListener('click', savePhoto);
    sharePhotoBtn.addEventListener('click', sharePhoto);
}

// Функция для инициализации режима "Хакер"
function initHackerMode() {
    const hackerToggle = document.getElementById('hackerModeToggle');
    
    if (!hackerToggle) return;
    
    hackerToggle.addEventListener('change', function() {
        if (this.checked) {
            // Включаем режим "Хакер"
            document.querySelector('.phone').classList.add('hacker-mode-active');
            sendPushNotification('Система', 'Режим "Хакер" активирован', '💻');
            
            // Добавляем эффект "взлома"
            showHackingEffect();
        } else {
            // Выключаем режим "Хакер"
            document.querySelector('.phone').classList.remove('hacker-mode-active');
            sendPushNotification('Система', 'Режим "Хакер" деактивирован', '✅');
        }
    });
    
    // Эффект "взлома"
    function showHackingEffect() {
        const hackingTexts = [
            'Взлом системы...',
            'Доступ получен',
            'Загрузка данных...',
            'Перехват сообщений...',
            'Обход защиты...',
            'Установка бэкдора...',
            'Шифрование соединения...'
        ];
        
        let count = 0;
        const interval = setInterval(() => {
            if (count >= hackingTexts.length || !hackerToggle.checked) {
                clearInterval(interval);
                return;
            }
            
            sendPushNotification('ХАКЕР', hackingTexts[count], '🔓');
            count++;
        }, 1500);
    }
}

// Функция для инициализации игры "Змейка"
function initSnakeGame() {
    const snakeGameItem = document.getElementById('snakeGameItem');
    const snakeBackButton = document.querySelector('.snake-back');
    
    if (!snakeGameItem) return;
    
    // Обработчик нажатия на пункт меню "Змейка"
    snakeGameItem.addEventListener('click', function() {
        document.querySelector('.settings-screen').classList.remove('active-screen');
        document.querySelector('.snake-game-screen').classList.add('active-screen');
        startSnakeGame();
    });
    
    // Обработчик нажатия на кнопку "Назад" в игре
    snakeBackButton.addEventListener('click', function() {
        document.querySelector('.snake-game-screen').classList.remove('active-screen');
        document.querySelector('.settings-screen').classList.add('active-screen');
    });
    
    // Функция запуска игры "Змейка"
    function startSnakeGame() {
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('snakeScore');
        
        const gridSize = 20;
        const gridWidth = canvas.width / gridSize;
        const gridHeight = canvas.height / gridSize;
        
        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let direction = 'right';
        let score = 0;
        let gameSpeed = 150;
        let gameInterval;
        
        // Функция отрисовки игры
        function draw() {
            // Очистка холста
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Отрисовка змейки
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#FF3B30' : '#007AFF';
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            });
            
            // Отрисовка еды
            ctx.fillStyle = '#4CD964';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
            
            // Обновление счета
            scoreElement.textContent = score;
        }
        
        // Функция обновления игры
        function update() {
            // Создаем новую голову змейки
            const head = { ...snake[0] };
            
            // Обновляем позицию головы в зависимости от направления
            switch (direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }
            
            // Проверка на столкновение со стеной
            if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
                gameOver();
                return;
            }
            
            // Проверка на столкновение с самой собой
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOver();
                return;
            }
            
            // Добавляем новую голову
            snake.unshift(head);
            
            // Проверка на поедание еды
            if (head.x === food.x && head.y === food.y) {
                // Увеличиваем счет
                score += 10;
                
                // Создаем новую еду
                food = {
                    x: Math.floor(Math.random() * gridWidth),
                    y: Math.floor(Math.random() * gridHeight)
                };
                
                // Увеличиваем скорость игры
                if (gameSpeed > 50) {
                    gameSpeed -= 5;
                    clearInterval(gameInterval);
                    gameInterval = setInterval(update, gameSpeed);
                }
                
                // Звук поедания
                const eatSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
                eatSound.volume = 0.5;
                eatSound.play();
            } else {
                // Удаляем хвост
                snake.pop();
            }
            
            // Отрисовка игры
            draw();
        }
        
        // Функция завершения игры
        function gameOver() {
            clearInterval(gameInterval);
            
            // Звук проигрыша
            const gameOverSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-470.mp3');
            gameOverSound.volume = 0.5;
            gameOverSound.play();
            
            // Отображение сообщения о проигрыше
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = '20px Arial';
            ctx.fillText(`Счет: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
            ctx.fillText('Нажмите для новой игры', canvas.width / 2, canvas.height / 2 + 50);
            
            // Обработчик нажатия для перезапуска игры
            canvas.addEventListener('click', restartGame, { once: true });
        }
        
        // Функция перезапуска игры
        function restartGame() {
            snake = [{ x: 10, y: 10 }];
            food = { x: 15, y: 15 };
            direction = 'right';
            score = 0;
            gameSpeed = 150;
            
            clearInterval(gameInterval);
            gameInterval = setInterval(update, gameSpeed);
        }
        
        // Обработчик нажатий клавиш
        document.addEventListener('keydown', function(e) {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'down') direction = 'up';
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') direction = 'left';
                    break;
                case 'ArrowRight':
                    if (direction !== 'left') direction = 'right';
                    break;
            }
        });
        
        // Обработчик свайпов для мобильных устройств
        let touchStartX, touchStartY;
        
        canvas.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchmove', function(e) {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                // Горизонтальный свайп
                if (dx > 0 && direction !== 'left') {
                    direction = 'right';
                } else if (dx < 0 && direction !== 'right') {
                    direction = 'left';
                }
            } else {
                // Вертикальный свайп
                if (dy > 0 && direction !== 'up') {
                    direction = 'down';
                } else if (dy < 0 && direction !== 'down') {
                    direction = 'up';
                }
            }
            
            touchStartX = touchEndX;
            touchStartY = touchEndY;
            e.preventDefault();
        }, { passive: false });
        
        // Запуск игры
        gameInterval = setInterval(update, gameSpeed);
        draw();
    }
}

// Функция инициализации Play Market
function initPlayMarket() {
    // Добавляем заголовок
    const playmarketScreen = document.querySelector('.playmarket-screen');
    
    if (!playmarketScreen.querySelector('.app-header')) {
        const header = document.createElement('div');
        header.className = 'app-header playmarket-header';
        header.innerHTML = `
            <button class="home-button-app"><i class="fas fa-home"></i></button>
            <h2>Play Market</h2>
        `;
        
        // Добавляем обработчик для кнопки "Домой"
        header.querySelector('.home-button-app').addEventListener('click', goToHomeScreen);
        
        // Вставляем заголовок в начало экрана
        playmarketScreen.insertBefore(header, playmarketScreen.firstChild);
    }
    
    // Проверяем, есть ли уже история поиска
    if (!playmarketScreen.querySelector('.search-history')) {
        // Добавляем поисковую строку
        const searchBar = document.createElement('div');
        searchBar.className = 'search-bar';
        searchBar.innerHTML = `
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Поиск приложений и игр">
        `;
        
        // Добавляем историю поиска
        const searchHistory = document.createElement('div');
        searchHistory.className = 'search-history';
        searchHistory.innerHTML = `
            <h3>История поиска</h3>
            <div class="history-items">
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>скачать сбербанк взлома на деньги бесплатно</span>
                </div>
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>как стать хакером за 5 минут</span>
                </div>
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>майнкрафт без вирусов скачать</span>
                </div>
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>как взломать игру на бесконечные деньги</span>
                </div>
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>читы на фортнайт без бана</span>
                </div>
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>как скачать роблокс на телефон бесплатно</span>
                </div>
                <div class="history-item">
                    <i class="fas fa-history"></i>
                    <span>как получить вбаксы бесплатно 2023</span>
                </div>
            </div>
        `;
        
        // Вставляем элементы на экран
        playmarketScreen.insertBefore(searchBar, playmarketScreen.querySelector('.app-categories'));
        playmarketScreen.insertBefore(searchHistory, playmarketScreen.querySelector('.app-categories'));
        
        // Добавляем обработчики для истории поиска
        searchHistory.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const searchText = item.querySelector('span').textContent;
                searchBar.querySelector('input').value = searchText;
                
                // Показываем уведомление
                sendPushNotification('Play Market', `Поиск: ${searchText}`, '🔍');
            });
        });
    }
}

// Инициализация Dock-приложений
function initDockApps() {
    document.querySelectorAll('.dock-app').forEach(app => {
        app.addEventListener('click', () => {
            const appName = app.getAttribute('data-app');
            openApp(appName);
        });
    });
}

// Улучшенная функция отправки уведомлений
function sendPushNotification(title, message, icon) {
    const notificationContainer = document.querySelector('.notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Обработчик закрытия уведомления
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Функция создания контейнера для уведомлений
    function createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }
}

// Инициализация экрана блокировки
function initLockScreen() {
    const lockScreen = document.querySelector('.lock-screen');
    const screen = document.querySelector('.screen');
    
    // Обновляем время и дату на экране блокировки
    function updateLockScreenTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.lock-time').textContent = `${hours}:${minutes}`;
        
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
        const day = days[now.getDay()];
        const date = now.getDate();
        const month = months[now.getMonth()];
        
        document.querySelector('.lock-date').textContent = `${day}, ${date} ${month}`;
    }
    
    updateLockScreenTime();
    setInterval(updateLockScreenTime, 1000);
    
    // Обработчик свайпа для разблокировки
    let startY = 0;
    
    lockScreen.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    
    lockScreen.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        
        if (diff > 50) {
            lockScreen.style.transform = `translateY(-${diff}px)`;
        }
    });
    
    lockScreen.addEventListener('touchend', (e) => {
        const currentY = e.changedTouches[0].clientY;
        const diff = startY - currentY;
        
        if (diff > 150) {
            // Разблокировка
            lockScreen.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                lockScreen.style.display = 'none';
                document.querySelector('.home-screen').classList.add('active-screen');
            }, 300);
        } else {
            // Возврат на место
            lockScreen.style.transform = 'translateY(0)';
        }
    });
    
    // Для десктопа (имитация свайпа с помощью клика)
    lockScreen.addEventListener('click', () => {
        lockScreen.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            lockScreen.style.display = 'none';
            document.querySelector('.home-screen').classList.add('active-screen');
        }, 300);
    });
}

// Вызываем функцию инициализации экрана блокировки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initLockScreen();
});

// Улучшенная функция для включения полноэкранного режима
function enableFullscreen() {
    const elem = document.documentElement;
    
    try {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        } else {
            // Если полноэкранный режим не поддерживается, просто адаптируем размеры
            handleOrientationChange();
        }
    } catch (e) {
        console.error("Ошибка при переходе в полноэкранный режим:", e);
        // Если произошла ошибка, просто адаптируем размеры
        handleOrientationChange();
    }
}

// Улучшенная функция инициализации полноэкранного режима
function initFullscreenMode() {
    addFullscreenButton();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleOrientationChange);
    
    // Инициализация при загрузке
    handleOrientationChange();
    
    // Обработчик изменения ориентации экрана
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Автоматический полноэкранный режим на мобильных устройствах
    if (window.innerWidth <= 767) {
        // Добавляем кнопку для входа в полноэкранный режим на мобильных устройствах
        const mobileFullscreenButton = document.createElement('button');
        mobileFullscreenButton.className = 'mobile-fullscreen-button';
        mobileFullscreenButton.innerHTML = '<i class="fas fa-expand"></i> Полный экран';
        document.body.appendChild(mobileFullscreenButton);
        
        mobileFullscreenButton.addEventListener('click', () => {
            enableFullscreen();
            mobileFullscreenButton.style.display = 'none';
        });
    }
}

// Улучшенный обработчик изменения ориентации экрана
function handleOrientationChange() {
    // Обновляем высоту для мобильных браузеров (решение проблемы с адресной строкой)
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Адаптируем размер шрифта в зависимости от размера экрана
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.04;
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Проверяем ориентацию экрана
    if (window.innerWidth > window.innerHeight) {
        // Ландшафтная ориентация
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    } else {
        // Портретная ориентация
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    }
}

// Добавляем кнопку для включения полноэкранного режима
function addFullscreenButton() {
    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'fullscreen-button';
    fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    document.body.appendChild(fullscreenButton);
    
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            enableFullscreen();
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            exitFullscreen();
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    // Скрываем кнопку на мобильных устройствах
    if (window.innerWidth <= 767) {
        fullscreenButton.style.display = 'none';
    }
}

// Функция для выхода из полноэкранного режима
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

// Вызываем функцию инициализации полноэкранного режима
document.addEventListener('DOMContentLoaded', () => {
    initFullscreenMode();
});

// Добавляем функцию для плавающей кнопки "Домой"
function addFloatingHomeButton() {
    const floatingHomeButton = document.createElement('button');
    floatingHomeButton.className = 'floating-home-button';
    floatingHomeButton.innerHTML = '<i class="fas fa-home"></i>';
    document.body.appendChild(floatingHomeButton);
    
    floatingHomeButton.addEventListener('click', () => {
        goToHomeScreen();
    });
}

// Обновляем функцию инициализации UI
function initUI() {
    // Удаляем добавление верхней кнопки "Домой"
    // addHomeButton();
    
    // Добавляем только плавающую кнопку "Домой"
    addFloatingHomeButton();
    
    // Скрываем кнопку на экране блокировки
    const lockScreen = document.querySelector('.lock-screen');
    if (lockScreen) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const display = window.getComputedStyle(lockScreen).getPropertyValue('display');
                    const floatingHomeButton = document.querySelector('.floating-home-button');
                    
                    if (display === 'none') {
                        floatingHomeButton.style.display = 'flex';
                    } else {
                        floatingHomeButton.style.display = 'none';
                    }
                }
            });
        });
        
        observer.observe(lockScreen, { attributes: true });
        
        // Начальное состояние
        const floatingHomeButton = document.querySelector('.floating-home-button');
        floatingHomeButton.style.display = 'none';
    }
}

// Вызываем функцию инициализации UI
document.addEventListener('DOMContentLoaded', () => {
    initUI();
});

// Инициализация приложения "Сообщения"
function initMessages() {
    const messagesList = document.querySelector('.messages-list');
    if (!messagesList) return;
    
    // Очищаем список сообщений
    messagesList.innerHTML = '';
    
    // Массив сообщений
    const messages = [
        { name: "Мама", text: "Как дела в школе?", time: "10:15", avatar: "👩", unread: 2 },
        { name: "Папа", text: "Не забудь про уроки!", time: "09:30", avatar: "👨", unread: 0 },
        { name: "Бабушка", text: "Кушал ли ты сегодня?", time: "Вчера", avatar: "👵", unread: 1 },
        { name: "Учитель", text: "Домашнее задание на завтра: стр. 15, упр. 3", time: "Вчера", avatar: "👩‍🏫", unread: 0 },
        { name: "Петя", text: "Го в майнкрафт играть после школы", time: "08:45", avatar: "👦", unread: 0 },
        { name: "Маша", text: "Дай списать домашку по матеше", time: "Вчера", avatar: "👧", unread: 0 },
        { name: "Неизвестный номер", text: "Привет! Я выиграл в лотерею и хочу поделиться с тобой! Нажми сюда!", time: "07:20", avatar: "🤖", unread: 3 }
    ];
    
    // Добавляем сообщения в список
    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        let unreadBadge = '';
        if (message.unread > 0) {
            unreadBadge = `<div class="message-unread">${message.unread}</div>`;
        }
        
        messageItem.innerHTML = `
            <div class="message-avatar">${message.avatar}</div>
            <div class="message-content">
                <div class="message-name">${message.name}</div>
                <div class="message-text">${message.text}</div>
            </div>
            <div class="message-time">${message.time}</div>
            ${unreadBadge}
        `;
        
        messageItem.addEventListener('click', () => {
            // Показываем уведомление о родительском контроле
            if (message.name === "Неизвестный номер") {
                sendPushNotification('Родительский контроль', 'Обнаружено подозрительное сообщение! Доступ заблокирован.', '🛑');
            } else {
                sendPushNotification('Сообщения', `Открыт чат с ${message.name}`, '💬');
            }
        });
        
        messagesList.appendChild(messageItem);
    });
    
    // Обработчик для кнопки нового сообщения
    const newMessageButton = document.querySelector('.new-message-button');
    if (newMessageButton) {
        newMessageButton.addEventListener('click', () => {
            sendPushNotification('Сообщения', 'Для создания нового сообщения требуется разрешение родителей', '🔒');
        });
    }
    
    // Обновляем бейдж с количеством непрочитанных сообщений
    updateAppBadges();
}

// Инициализация приложения "Chrome"
function initChrome() {
    // Обработчик для адресной строки
    const addressInput = document.querySelector('.chrome-address-bar input');
    if (!addressInput) return;
    
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const url = addressInput.value.trim().toLowerCase();
            
            // Проверяем на запрещенные слова
            const blockedWords = ['взлом', 'чит', 'хакер', 'бесплатно', 'скачать', 'вирус', 'деньги', 'взломать'];
            
            let isBlocked = false;
            blockedWords.forEach(word => {
                if (url.includes(word)) {
                    isBlocked = true;
                }
            });
            
            if (isBlocked) {
                sendPushNotification('Родительский контроль', 'Доступ к этому сайту заблокирован!', '🛑');
                
                // Добавляем смешную анимацию "взлома"
                showHackingAnimation();
            } else {
                sendPushNotification('Chrome', 'Для посещения сайтов требуется разрешение родителей', '🔒');
            }
            
            // Очищаем поле ввода
            addressInput.value = '';
        }
    });
    
    // Обработчики для закладок
    document.querySelectorAll('.bookmark-item').forEach(bookmark => {
        bookmark.addEventListener('click', () => {
            const bookmarkName = bookmark.querySelector('.bookmark-name').textContent;
            
            if (bookmarkName === 'Игры') {
                sendPushNotification('Родительский контроль', 'Доступ к играм ограничен! Сначала сделай домашнее задание!', '🎮');
                
                // Добавляем смешную анимацию "грустного смайлика"
                showSadFaceAnimation();
            } else {
                sendPushNotification('Chrome', `Для посещения ${bookmarkName} требуется разрешение родителей`, '🔒');
            }
        });
    });
    
    // Обработчики для истории
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const historyName = item.querySelector('.history-name').textContent;
            
            // Проверяем на запрещенные слова
            const blockedWords = ['взлом', 'чит', 'хакер', 'бесплатно', 'скачать', 'вирус', 'деньги', 'взломать'];
            
            let isBlocked = false;
            blockedWords.forEach(word => {
                if (historyName.toLowerCase().includes(word)) {
                    isBlocked = true;
                }
            });
            
            if (isBlocked) {
                sendPushNotification('Родительский контроль', 'Доступ к этому сайту заблокирован!', '🛑');
                
                // Добавляем смешную анимацию "взлома"
                showHackingAnimation();
            } else {
                sendPushNotification('Chrome', 'Для посещения сайтов требуется разрешение родителей', '🔒');
            }
        });
    });
}

// Функция для отображения смешной анимации "взлома"
function showHackingAnimation() {
    // Создаем элемент для анимации
    const hackingOverlay = document.createElement('div');
    hackingOverlay.className = 'hacking-overlay';
    hackingOverlay.innerHTML = `
        <div class="hacking-content">
            <h2>ВНИМАНИЕ! ОБНАРУЖЕН ВИРУС!</h2>
            <div class="hacking-progress">
                <div class="progress-bar"></div>
            </div>
            <div class="hacking-text">Идет сканирование системы...</div>
            <div class="hacking-emoji">🚨</div>
        </div>
    `;
    
    document.body.appendChild(hackingOverlay);
    
    // Анимация прогресс-бара
    setTimeout(() => {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = '100%';
        
        const hackingText = document.querySelector('.hacking-text');
        hackingText.textContent = 'Вирус обнаружен и заблокирован!';
        
        const hackingEmoji = document.querySelector('.hacking-emoji');
        hackingEmoji.textContent = '✅';
        
        // Удаляем анимацию через 3 секунды
        setTimeout(() => {
            hackingOverlay.remove();
        }, 3000);
    }, 2000);
}

// Функция для отображения смешной анимации "грустного смайлика"
function showSadFaceAnimation() {
    // Создаем элемент для анимации
    const sadFaceOverlay = document.createElement('div');
    sadFaceOverlay.className = 'sad-face-overlay';
    sadFaceOverlay.innerHTML = `
        <div class="sad-face-content">
            <div class="sad-face-emoji">😢</div>
            <div class="sad-face-text">Сначала нужно сделать домашнее задание!</div>
            <div class="sad-face-subtext">Мама сказала, что игры только после уроков</div>
        </div>
    `;
    
    document.body.appendChild(sadFaceOverlay);
    
    // Удаляем анимацию через 3 секунды
    setTimeout(() => {
        sadFaceOverlay.remove();
    }, 3000);
}

// Обновляем функцию открытия приложений
function openApp(appName) {
    // Анимация исчезновения текущего экрана
    const currentScreen = document.querySelector('.active-screen');
    if (currentScreen) {
        currentScreen.style.animation = 'fadeOut 0.2s ease forwards';
        
        setTimeout(() => {
            // Скрываем все экраны
            document.querySelectorAll('.screen-content, .home-screen').forEach(screen => {
                screen.classList.remove('active-screen');
                screen.style.animation = '';
            });
            
            // Открываем нужный экран с анимацией
            let targetScreen;
            
            switch(appName) {
                case 'geometrydash':
                    targetScreen = document.querySelector('.geometry-dash-screen');
                    break;
                case 'whatsapp':
                    targetScreen = document.querySelector('.whatsapp-screen');
                    
                    // Сбрасываем счетчик непрочитанных сообщений
                    let totalUnread = 0;
                    chats.forEach(chat => {
                        totalUnread += chat.unread;
                        chat.unread = 0;
                    });
                    
                    // Обновляем UI
                    initWhatsApp();
                    updateAppBadges();
                    break;
                case 'phone':
                    targetScreen = document.querySelector('.phone-screen');
                    break;
                case 'settings':
                    targetScreen = document.querySelector('.settings-screen');
                    break;
                case 'camera':
                    targetScreen = document.querySelector('.camera-screen');
                    break;
                case 'playmarket':
                    targetScreen = document.querySelector('.playmarket-screen');
                    initPlayMarket();
                    break;
                case 'contacts':
                    targetScreen = document.querySelector('.contacts-screen');
                    initContacts();
                    break;
                case 'messages':
                    targetScreen = document.querySelector('.messages-screen');
                    initMessages();
                    break;
                case 'chrome':
                    targetScreen = document.querySelector('.chrome-screen');
                    initChrome();
                    break;
                default:
                    targetScreen = document.querySelector('.home-screen');
            }
            
            if (targetScreen) {
                targetScreen.classList.add('active-screen');
                targetScreen.style.animation = 'fadeIn 0.3s ease forwards';
            }
        }, 200);
    }
}

// Обновляем функцию обновления бейджей приложений
function updateAppBadges() {
    // Обновляем бейдж WhatsApp
    let totalUnreadWhatsApp = 0;
    chats.forEach(chat => {
        totalUnreadWhatsApp += chat.unread;
    });
    
    const whatsappBadge = document.querySelector('[data-app="whatsapp"] .app-badge');
    if (whatsappBadge) {
        whatsappBadge.textContent = totalUnreadWhatsApp > 0 ? totalUnreadWhatsApp : '';
    }
    
    // Обновляем бейдж Сообщений
    let totalUnreadMessages = 0;
    const messages = [
        { name: "Мама", unread: 2 },
        { name: "Бабушка", unread: 1 },
        { name: "Неизвестный номер", unread: 3 }
    ];
    
    messages.forEach(message => {
        totalUnreadMessages += message.unread;
    });
    
    const messagesBadge = document.querySelector('[data-app="messages"] .app-badge');
    if (messagesBadge) {
        messagesBadge.textContent = totalUnreadMessages > 0 ? totalUnreadMessages : '';
    }
}