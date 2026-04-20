// Live Products JavaScript
let liveProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadLiveProducts();
});

// Load live products
async function loadLiveProducts() {
  try {
    // Try to load from cached products
    const cachedProducts = localStorage.getItem('cachedProducts');
    if (cachedProducts) {
      const allProducts = JSON.parse(cachedProducts);
      // Get random 12 products for the live session
      liveProducts = allProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
    } else {
      // Try to fetch from JSON
      const response = await fetch('../simba_products.json');
      const data = await response.json();
      const allProducts = Array.isArray(data) ? data : (data.products || []);
      liveProducts = allProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    // Use dummy products
    liveProducts = [
      { id: 1, name: 'Inyange Milk 1L', price: 1200, category: 'Food Products', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
      { id: 5, name: 'Azam Cooking Oil 2L', price: 8500, category: 'Food Products', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300' },
      { id: 12, name: 'Bralirwa Primus Beer', price: 1500, category: 'Alcoholic Drinks', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300' },
      { id: 23, name: 'Nivea Body Lotion', price: 4500, category: 'Cosmetics & Personal Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300' },
      { id: 45, name: 'Rice 5kg', price: 12000, category: 'Food Products', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' },
      { id: 67, name: 'Sugar 2kg', price: 3500, category: 'Food Products', image: 'https://images.unsplash.com/photo-1519735777090-ec97a2f5f6f1?w=300' }
    ];
  }
  
  renderLiveProducts();
}

// Render live products
function renderLiveProducts() {
  const grid = document.getElementById('liveProductsGrid');
  if (!grid) return;
  
  grid.innerHTML = liveProducts.map(product => `
    <div class="live-product-card" onclick="viewProduct(${product.id})">
      <img src="${product.image}" alt="${product.name}" class="live-product-img" onerror="this.src='https://via.placeholder.com/80'">
      <div class="live-product-info">
        <div class="live-product-name">${product.name}</div>
        <div class="live-product-price">${formatPrice(product.price)}</div>
        <button class="live-product-btn" onclick="addToCartFromLive(event, ${product.id})">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

// Add to cart from live
function addToCartFromLive(event, productId) {
  event.stopPropagation();
  
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('add to cart')) {
    return;
  }
  
  const product = liveProducts.find(p => p.id === productId);
  if (!product) return;
  
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`${product.name} added to cart! 🛒`);
  
  // Visual feedback
  const btn = event.target.closest('.live-product-btn');
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added!';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 1500);
  }
}

// View product details
function viewProduct(productId) {
  window.open(`../product.html?id=${productId}`, '_blank');
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.textContent = totalItems;
}

// Show toast
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
