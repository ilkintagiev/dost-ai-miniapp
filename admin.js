// Initialize Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// Initialize Supabase
let supabase;
let currentUser = null;

// Initialize on load
window.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase
    const supabaseInitialized = initSupabase();

    if (!supabaseInitialized) {
        alert('Ошибка подключения к базе данных');
        return;
    }

    // Check admin access
    currentUser = tg.initDataUnsafe.user;

    if (!currentUser) {
        alert('Доступ запрещён. Откройте через Telegram Mini App.');
        window.location.href = 'index.html';
        return;
    }

    const isAdmin = await checkAdminAccess();

    if (!isAdmin) {
        alert('У вас нет прав администратора');
        window.location.href = 'index.html';
        return;
    }

    // Load dashboard
    loadDashboard();
});

// Check admin access
async function checkAdminAccess() {
    try {
        const isAdmin = await isUserAdmin(currentUser.id);
        return isAdmin;
    } catch (error) {
        console.error('Error checking admin access:', error);
        return false;
    }
}

// Switch admin tabs
function switchAdminTab(tabName) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));

    // Add active class to selected tab and section
    event.target.classList.add('active');
    document.getElementById(`${tabName}-section`).classList.add('active');

    // Load content based on tab
    if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'products') {
        loadProducts();
    } else if (tabName === 'orders') {
        loadOrders();
    }
}

// ============================================
// DASHBOARD
// ============================================

async function loadDashboard() {
    try {
        // Load stats
        const products = await getAllProducts();
        const orders = await getAllOrders();

        const totalProducts = products ? products.length : 0;
        const totalOrders = orders ? orders.length : 0;
        const totalRevenue = orders ? orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) : 0;
        const pendingOrders = orders ? orders.filter(o => o.status === 'pending').length : 0;

        // Update stats
        document.getElementById('total-products-stat').textContent = totalProducts;
        document.getElementById('total-orders-stat').textContent = totalOrders;
        document.getElementById('total-revenue-stat').textContent = `${totalRevenue.toLocaleString('ru-RU')} ₽`;
        document.getElementById('pending-orders-stat').textContent = pendingOrders;

        // Show recent orders
        const recentOrders = orders ? orders.slice(0, 5) : [];
        renderRecentOrders(recentOrders);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function renderRecentOrders(orders) {
    const container = document.getElementById('recent-orders-list');

    if (!orders || orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Нет заказов</p></div>';
        return;
    }

    container.innerHTML = orders.map(order => {
        const date = new Date(order.created_at).toLocaleDateString('ru-RU');
        const items = JSON.parse(order.items || '[]');

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Заказ #${order.id.slice(0, 8)}</div>
                        <div class="order-date">${date}</div>
                    </div>
                    <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
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
    }).join('');
}

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

async function loadProducts() {
    try {
        const products = await getAllProducts();
        renderProductsTable(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProductsTable(products) {
    const tbody = document.getElementById('products-table-body');

    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Нет товаров</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                ${product.image_url ?
            `<img src="${product.image_url}" class="product-image-thumb" alt="${product.name}">` :
            '<div style="width: 50px; height: 50px; background: var(--bg-primary); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">📦</div>'
        }
            </td>
            <td><strong>${product.name}</strong><br><small style="color: var(--text-secondary);">${product.description || ''}</small></td>
            <td>${getCategoryText(product.category)}</td>
            <td><strong>${parseFloat(product.price).toLocaleString('ru-RU')} ₽</strong></td>
            <td>${product.stock || 0}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editProduct('${product.id}')">✏️ Изменить</button>
                    <button class="btn-small btn-delete" onclick="deleteProductConfirm('${product.id}')">🗑️ Удалить</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Preview image before upload
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('image-preview');
            const uploadText = document.getElementById('upload-text');
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadText.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Handle add product form
async function handleAddProduct(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Добавление...';

    try {
        // Upload image if provided
        let imageUrl = null;
        const imageFile = formData.get('image');

        if (imageFile && imageFile.size > 0) {
            const productId = Date.now().toString();
            imageUrl = await uploadProductImage(imageFile, productId);
        }

        // Create product object
        const product = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')) || 0,
            image_url: imageUrl
        };

        // Add to database
        const result = await addProduct(product);

        if (result) {
            alert('Товар успешно добавлен!');
            form.reset();
            document.getElementById('image-preview').style.display = 'none';
            document.getElementById('upload-text').style.display = 'block';
            loadProducts();
        } else {
            alert('Ошибка при добавлении товара');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Ошибка: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Добавить товар <span class="arrow">→</span>';
    }
}

// Edit product (simplified - just shows alert for now)
function editProduct(productId) {
    alert('Функция редактирования в разработке. ID: ' + productId);
    // TODO: Implement edit modal
}

// Delete product with confirmation
async function deleteProductConfirm(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }

    try {
        const success = await deleteProduct(productId);

        if (success) {
            alert('Товар удалён');
            loadProducts();
        } else {
            alert('Ошибка при удалении товара');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Ошибка: ' + error.message);
    }
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

async function loadOrders() {
    try {
        const orders = await getAllOrders();
        renderOrdersTable(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('orders-table-body');

    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Нет заказов</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const date = new Date(order.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const items = JSON.parse(order.items || '[]');
        const itemsText = items.map(i => `${i.name} x${i.quantity}`).join(', ');

        return `
            <tr>
                <td><small>#${order.id.slice(0, 8)}</small></td>
                <td><strong>${order.user_name || 'Гость'}</strong></td>
                <td><small>${itemsText}</small></td>
                <td><strong>${parseFloat(order.total).toLocaleString('ru-RU')} ₽</strong></td>
                <td>
                    <select class="order-status-select" onchange="handleStatusChange('${order.id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Ожидает</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Подтверждён</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>В обработке</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Отправлен</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Доставлен</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Отменён</option>
                    </select>
                </td>
                <td><small>${date}</small></td>
            </tr>
        `;
    }).join('');
}

// Handle order status change
async function handleStatusChange(orderId, newStatus) {
    try {
        const result = await updateOrderStatus(orderId, newStatus);

        if (result) {
            alert('Статус заказа обновлён');
            loadDashboard(); // Refresh dashboard stats
        } else {
            alert('Ошибка при обновлении статуса');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Ошибка: ' + error.message);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCategoryText(category) {
    const categories = {
        'phones': '📱 Телефоны',
        'glasses': '🕶️ Умные очки',
        'devices': '🤖 AI устройства'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Ожидает',
        'confirmed': 'Подтверждён',
        'processing': 'В обработке',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменён'
    };
    return statuses[status] || status;
}

console.log('Admin panel initialized');
