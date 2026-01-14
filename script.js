// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Расширяем приложение на весь экран
tg.expand();

// Настраиваем цвета темы
tg.setHeaderColor('#f5f0e8');
tg.setBackgroundColor('#f5f0e8');

// Переменные для хранения выбранной услуги
let selectedService = '';

// Shopping cart
let cart = [];

// Products from Supabase
let allProducts = [];

// Initialize Supabase on page load
window.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase
    const supabaseInitialized = initSupabase();

    if (supabaseInitialized) {
        console.log('Supabase connected!');
        // Load products from database
        await loadProductsFromDatabase();

        // Check if user is admin
        const user = tg.initDataUnsafe.user;
        if (user) {
            const isAdmin = await isUserAdmin(user.id);
            if (isAdmin) {
                const adminBtn = document.getElementById('admin-button');
                if (adminBtn) {
                    adminBtn.style.display = 'inline-flex';
                }
            }
        }
    } else {
        console.warn('Supabase not initialized, using static products');
    }

    loadCart();
    switchTab('services');
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('dostai_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('dostai_cart', JSON.stringify(cart));
    updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}

// Tab switching
function switchTab(tabName) {
    // Hide all pages
    hideAllPages();

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    if (tabName === 'services') {
        document.getElementById('services-page').classList.add('active');
        document.querySelector('[data-page="services"]').classList.add('active');
    } else if (tabName === 'products') {
        document.getElementById('products-page').classList.add('active');
        document.querySelector('[data-page="products"]').classList.add('active');
        renderProducts();
    } else if (tabName === 'cart') {
        document.getElementById('cart-page').classList.add('active');
        document.querySelector('[data-page="cart"]').classList.add('active');
        renderCart();
    } else if (tabName === 'profile') {
        document.getElementById('profile-page').classList.add('active');
        document.querySelector('[data-page="profile"]').classList.add('active');
        loadProfile();
    }

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Load products from Supabase
async function loadProductsFromDatabase() {
    try {
        const products = await getAllProducts();
        if (products && products.length > 0) {
            allProducts = products;
            console.log(`Loaded ${products.length} products from Supabase`);
        } else {
            console.warn('No products found in database, using static data');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render products
function renderProducts() {
    // Use Supabase products if available, otherwise fall back to static products
    const productsToRender = allProducts.length > 0 ? allProducts : (typeof products !== 'undefined' ? products : { phones: [], glasses: [], devices: [] });

    // Group products by category
    const productsByCategory = {
        phones: [],
        glasses: [],
        devices: []
    };

    if (Array.isArray(productsToRender)) {
        // Products from Supabase (array)
        productsToRender.forEach(product => {
            if (productsByCategory[product.category]) {
                productsByCategory[product.category].push(product);
            }
        });
    } else {
        // Static products (object)
        productsByCategory.phones = productsToRender.phones || [];
        productsByCategory.glasses = productsToRender.glasses || [];
        productsByCategory.devices = productsToRender.devices || [];
    }

    // Render phones
    const phonesGrid = document.getElementById('phones-grid');
    if (phonesGrid) {
        phonesGrid.innerHTML = productsByCategory.phones.map(product => createProductCard(product)).join('');
    }

    // Render glasses
    const glassesGrid = document.getElementById('glasses-grid');
    if (glassesGrid) {
        glassesGrid.innerHTML = productsByCategory.glasses.map(product => createProductCard(product)).join('');
    }

    // Render devices
    const devicesGrid = document.getElementById('devices-grid');
    if (devicesGrid) {
        devicesGrid.innerHTML = productsByCategory.devices.map(product => createProductCard(product)).join('');
    }
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-name="${product.name.toLowerCase()}" data-product-desc="${product.description.toLowerCase()}">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">В корзину</button>
            </div>
        </div>
    `;
}

// Search products
function searchProducts(query) {
    const searchInput = document.getElementById('product-search');
    const clearBtn = document.getElementById('clear-search');

    // Show/hide clear button
    if (query.length > 0) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }

    // If no query, show all products
    if (!query || query.trim() === '') {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const name = card.dataset.productName || '';
        const desc = card.dataset.productDesc || '';

        if (name.includes(searchTerm) || desc.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('product-search');
    const clearBtn = document.getElementById('clear-search');

    searchInput.value = '';
    clearBtn.classList.remove('visible');

    // Show all products
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = 'block';
    });
}

// Add to cart
function addToCart(productId) {
    // Find product from Supabase or static data
    let product = null;

    if (allProducts.length > 0) {
        // Search in Supabase products
        product = allProducts.find(p => p.id === productId);
    } else if (typeof products !== 'undefined') {
        // Search in static products
        for (let category in products) {
            product = products[category].find(p => p.id === productId);
            if (product) break;
        }
    }

    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url || product.image,
            quantity: 1,
            type: 'product'
        });
    }

    saveCart();

    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }

    // Show notification
    tg.showPopup({
        title: 'Добавлено в корзину',
        message: product.name,
        buttons: [{ type: 'ok' }]
    });
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalSection = document.getElementById('cart-total-section');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары или услуги</p>
            </div>
        `;
        cartTotalSection.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.style.display='none'">` : ''}
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">✕</button>
            </div>
        </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-price').textContent = `${total.toLocaleString('ru-RU')} ₽`;
    cartTotalSection.style.display = 'block';
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    saveCart();
    renderCart();
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();

    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Detailed order message with prices
    const itemsList = cart.map(item =>
        `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`
    ).join('\n');

    const message = `🛒 НОВЫЙ ЗАКАЗ!\n\n📦 Товары:\n${itemsList}\n\n💰 ИТОГО: ${total.toLocaleString('ru-RU')} ₽\n\n👤 Клиент ждёт подтверждения!`;

    const telegramUrl = `https://t.me/dostai_grup?text=${encodeURIComponent(message)}`;

    // Check if running in Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.platform !== 'unknown') {
        // Running in Telegram
        tg.showConfirm('Оформить заказ через Telegram?', (confirmed) => {
            if (confirmed) {
                tg.openTelegramLink(telegramUrl);
                cart = [];
                saveCart();
                renderCart();
            }
        });
    } else {
        // Running in browser
        if (confirm('Оформить заказ через Telegram?\n\nВы будете перенаправлены в Telegram для отправки заказа.')) {
            window.open(telegramUrl, '_blank');
            cart = [];
            saveCart();
            renderCart();
        }
    }
}

// Функции навигации (старые)
function showHome() {
    hideAllPages();
    document.getElementById('home-page').classList.add('active');
    tg.BackButton.hide();
}

function showServices() {
    switchTab('services');
}

function showContact() {
    hideAllPages();
    document.getElementById('contact-page').classList.add('active');
    tg.BackButton.show();
    tg.BackButton.onClick(() => switchTab('services'));

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
    } else if (activePage.id === 'products-page') {
        showHome(); // Or navigate to a default tab if home is not desired
    } else if (activePage.id === 'cart-page') {
        switchTab('products'); // Go back to products from cart
    } else if (activePage.id === 'contact-page') {
        switchTab('services'); // Go back to services from contact
    }
});

// Готовность приложения
tg.ready();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    // Start on services tab
    switchTab('services');
});

// Логирование для отладки
console.log('DOST AI Mini App initialized');
console.log('User:', tg.initDataUnsafe.user);
console.log('Theme:', tg.themeParams);

// ============================================
// PROFILE FUNCTIONS
// ============================================

// Load user profile
async function loadProfile() {
    // Get Telegram user data
    const user = tg.initDataUnsafe.user;

    if (user) {
        // Update profile info
        const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-username').textContent = user.username ? `@${user.username}` : 'Пользователь Telegram';

        // Save/update user in Supabase
        if (typeof getOrCreateUser === 'function') {
            await getOrCreateUser(user);
        }

        // Load order history
        await loadOrderHistory(user.id);
    } else {
        // Fallback for testing
        document.getElementById('user-name').textContent = 'Гость';
        document.getElementById('user-username').textContent = 'Войдите через Telegram';
    }

    // Update cart items count
    document.getElementById('cart-items-count').textContent = cart.length;
}

// Load order history
async function loadOrderHistory(userId) {
    const ordersList = document.getElementById('orders-list');

    try {
        // Get orders from Supabase
        const orders = typeof getUserOrders === 'function' ? await getUserOrders(userId) : null;

        if (orders && orders.length > 0) {
            // Calculate stats
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

            // Update stats
            document.getElementById('total-orders').textContent = totalOrders;
            document.getElementById('total-spent').textContent = `${totalSpent.toLocaleString('ru-RU')} ₽`;

            // Render orders
            ordersList.innerHTML = orders.map(order => createOrderCard(order)).join('');
        } else {
            // Show empty state
            ordersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Пока нет заказов</p>
                    <button class="cta-button" onclick="switchTab('products')" style="margin-top: 16px;">
                        Посмотреть товары
                        <span class="arrow">→</span>
                    </button>
                </div>
            `;

            // Reset stats
            document.getElementById('total-orders').textContent = '0';
            document.getElementById('total-spent').textContent = '0 ₽';
        }
    } catch (error) {
        console.error('Error loading order history:', error);
        ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <p>Ошибка загрузки заказов</p>
            </div>
        `;
    }
}

// Create order card HTML
function createOrderCard(order) {
    const date = new Date(order.created_at).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const items = JSON.parse(order.items || '[]');
    const statusClass = order.status || 'pending';
    const statusText = {
        'pending': 'Ожидает',
        'confirmed': 'Подтверждён',
        'processing': 'В обработке',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменён'
    }[order.status] || 'Ожидает';

    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Заказ #${order.id.slice(0, 8)}</div>
                    <div class="order-date">${date}</div>
                </div>
                <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            <div class="order-items">
                ${items.map(item => `
                    <div class="order-item">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-quantity">x${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span class="order-total-label">Итого:</span>
                <span class="order-total-value">${parseFloat(order.total).toLocaleString('ru-RU')} ₽</span>
            </div>
        </div>
    `;
}
