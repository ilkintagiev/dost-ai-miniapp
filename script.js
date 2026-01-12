// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Расширяем приложение на весь экран
tg.expand();

// Настраиваем цвета темы
tg.setHeaderColor('#667eea');
tg.setBackgroundColor('#667eea');

// Переменные для хранения выбранной услуги
let selectedService = '';

// Функции навигации
function showHome() {
    hideAllPages();
    document.getElementById('home-page').classList.add('active');
    tg.BackButton.hide();
}

function showServices() {
    hideAllPages();
    document.getElementById('services-page').classList.add('active');
    tg.BackButton.show();
    tg.BackButton.onClick(showHome);

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function showContact() {
    hideAllPages();
    document.getElementById('contact-page').classList.add('active');
    tg.BackButton.show();
    tg.BackButton.onClick(showServices);

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
}

// Выбор услуги
function selectService(serviceName) {
    selectedService = serviceName;

    // Устанавливаем выбранную услугу в форме
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
        // Ищем опцию с таким значением
        for (let option of serviceSelect.options) {
            if (option.value === serviceName || option.text.includes(serviceName)) {
                serviceSelect.value = option.value;
                break;
            }
        }
    }

    showContact();

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Отправка сообщения
function sendMessage() {
    const serviceSelect = document.getElementById('service-select');
    const taskDescription = document.getElementById('task-description');

    const service = serviceSelect.value;
    const description = taskDescription.value.trim();

    if (!service) {
        tg.showAlert('Пожалуйста, выберите услугу');
        return;
    }

    if (!description) {
        tg.showAlert('Пожалуйста, опишите вашу задачу');
        return;
    }

    // Формируем сообщение
    const message = `🔔 Новая заявка!\n\n📋 Услуга: ${service}\n\n💬 Описание:\n${description}`;

    // Открываем чат с ботом или пользователем
    const telegramUrl = `https://t.me/dostai_grup?text=${encodeURIComponent(message)}`;

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }

    // Показываем подтверждение
    tg.showConfirm('Открыть Telegram для отправки сообщения?', (confirmed) => {
        if (confirmed) {
            tg.openTelegramLink(telegramUrl);
        }
    });
}

// Обработка кнопки "Назад" от Telegram
tg.BackButton.onClick(() => {
    const activePage = document.querySelector('.page.active');

    if (activePage.id === 'services-page') {
        showHome();
    } else if (activePage.id === 'contact-page') {
        showServices();
    }
});

// Готовность приложения
tg.ready();

// Логирование для отладки
console.log('Telegram Web App initialized');
console.log('User:', tg.initDataUnsafe.user);
console.log('Theme:', tg.themeParams);
