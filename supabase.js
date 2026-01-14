// Supabase Configuration
const SUPABASE_URL = 'https://unogiolsuowfijokmfqb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVub2dpb2xzdW93Zmlqb2ttZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTMwMDQsImV4cCI6MjA4Mzk4OTAwNH0.TU9uTs6A7oTVeN2CweAGM-yo4BcVkZDGdrhT0cbR_uc';

// Initialize Supabase client (using CDN version)
let supabase;

// Initialize Supabase when script loads
function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded. Make sure to include the CDN script.');
        return false;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized successfully!');
    return true;
}

// ============================================
// PRODUCTS API
// ============================================

// Get all products
async function getAllProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}

// Get products by category
async function getProductsByCategory(category) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return null;
    }
}

// Add new product (admin only)
async function addProduct(product) {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

// Update product (admin only)
async function updateProduct(id, updates) {
    try {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
}

// Delete product (admin only)
async function deleteProduct(id) {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// ============================================
// ORDERS API
// ============================================

// Create new order
async function createOrder(orderData) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
}

// Get user orders
async function getUserOrders(userId) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return null;
    }
}

// Get all orders (admin only)
async function getAllOrders() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return null;
    }
}

// Update order status (admin only)
async function updateOrderStatus(orderId, status) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating order status:', error);
        return null;
    }
}

// ============================================
// USERS API
// ============================================

// Get or create user
async function getOrCreateUser(telegramUser) {
    try {
        // Try to get existing user
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', telegramUser.id)
            .single();

        if (existingUser) {
            return existingUser;
        }

        // Create new user if doesn't exist
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{
                id: telegramUser.id,
                username: telegramUser.username || null,
                first_name: telegramUser.first_name || null,
                last_name: telegramUser.last_name || null,
                is_admin: false
            }])
            .select()
            .single();

        if (insertError) throw insertError;
        return newUser;
    } catch (error) {
        console.error('Error getting/creating user:', error);
        return null;
    }
}

// Check if user is admin
async function isUserAdmin(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data?.is_admin || false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// ============================================
// IMAGE UPLOAD
// ============================================

// Upload product image to Supabase Storage
async function uploadProductImage(file, productId) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

// Delete product image
async function deleteProductImage(imageUrl) {
    try {
        // Extract file path from URL
        const urlParts = imageUrl.split('/product-images/');
        if (urlParts.length < 2) return false;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from('product-images')
            .remove([filePath]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSupabase,
        getAllProducts,
        getProductsByCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        createOrder,
        getUserOrders,
        getAllOrders,
        updateOrderStatus,
        getOrCreateUser,
        isUserAdmin,
        uploadProductImage,
        deleteProductImage
    };
}
