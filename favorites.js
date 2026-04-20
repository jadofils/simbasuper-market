// Favorites page functionality
let allProducts = [];
let favoriteProducts = [];
let currentFilter = 'all';
let currentSort = 'recent';

// Dummy products with real images (fallback)
const dummyProducts = [
  { id: 1, name: 'Inyange Milk 1L', price: 1200, category: 'Food Products', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop' },
  { id: 5, name: 'Azam Cooking Oil 2L', price: 8500, category: 'Food Products', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop' },
  { id: 12, name: 'Bralirwa Primus Beer', price: 1500, category: 'Alcoholic Drinks', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop' },
  { id: 23, name: 'Nivea Body Lotion', price: 4500, category: 'Cosmetics & Personal Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop' },
  { id: 45, name: 'Rice 5kg', price: 12000, category: 'Food Products', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop' },
  { id: 67, name: 'Sugar 2kg', price: 3500, category: 'Food Products', image: 'https://images.unsplash.com/photo-1519735777090-ec97a2f5f6f1?w=300&h=300&fit=crop' },
  { id: 89, name: 'Colgate Toothpaste', price: 2500, category: 'Cosmetics & Personal Care', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300&h=300&fit=crop' },
  { id: 102, name: 'Dove Soap', price: 1800, category: 'Cosmetics & Personal Care', image: 'https://images.unsplash.com/photo-1585128903994-03b9e8e2d8e0?w=300&h=300&fit=crop' }
];

// Load products and favorites
async function loadFavorites() {
  console.log('Loading favorites...');
  
  // Check if we have liked products, if not create dummy ones
  let likedIds = getLikedProducts();
  if (likedIds.length === 0) {
    console.log('No favorites found, creating dummy favorites...');
    likedIds = [1, 5, 12, 23, 45, 67, 89, 102];
    localStorage.setItem('likedProducts', JSON.stringify(likedIds));
  }
  
  console.log('Liked IDs:', likedIds);
  
  // Try to load from cached products first (from main page)
  const cachedProducts = localStorage.getItem('cachedProducts');
  if (cachedProducts) {
    try {
      allProducts = JSON.parse(cachedProducts);
      console.log('Loaded from cache:', allProducts.length, 'products');
    } catch (e) {
      console.error('Error parsing cached products:', e);
    }
  }
  
  // If no cached products, try to fetch from JSON
  if (allProducts.length === 0) {
    try {
      const response = await fetch('simba_products.json');
      const data = await response.json();
      allProducts = Array.isArray(data) ? data : (data.products || []);
      console.log('Loaded from JSON:', allProducts.length, 'products');
    } catch (error) {
      console.error('Error loading from JSON:', error);
      // Fall back to dummy products
      allProducts = dummyProducts;
      console.log('Using dummy products:', allProducts.length);
    }
  }
  
  // Filter to get favorite products
  favoriteProducts = allProducts.filter(p => likedIds.includes(p.id));
  console.log('Favorite products found:', favoriteProducts.length);
  
  updateCounts();
  renderFavorites();
}

// Get liked products from localStorage
function getLikedProducts() {
  const liked = JSON.parse(localStorage.getItem('likedProducts') || '[]');
  console.log('getLikedProducts called, found:', liked);
  return liked;
}

// Update all counts
function updateCounts() {
  const counts = {
    all: favoriteProducts.length,
    'Cosmetics & Personal Care': 0,
    'Food Products': 0,
    'Alcoholic Drinks': 0,
    'Kitchenware & Electronics': 0,
    other: 0
  };
  
  favoriteProducts.forEach(product => {
    if (counts[product.category] !== undefined) {
      counts[product.category]++;
    } else {
      counts.other++;
    }
  });
  
  console.log('Counts:', counts);
  
  const favoritesCount = document.getElementById('favoritesCount');
  if (favoritesCount) favoritesCount.textContent = `${counts.all} items saved`;
  
  const allCount = document.getElementById('allCount');
  if (allCount) allCount.textContent = counts.all;
  
  const cosmeticsCount = document.getElementById('cosmeticsCount');
  if (cosmeticsCount) cosmeticsCount.textContent = counts['Cosmetics & Personal Care'];
  
  const foodCount = document.getElementById('foodCount');
  if (foodCount) foodCount.textContent = counts['Food Products'];
  
  const drinksCount = document.getElementById('drinksCount');
  if (drinksCount) drinksCount.textContent = counts['Alcoholic Drinks'];
  
  const kitchenCount = document.getElementById('kitchenCount');
  if (kitchenCount) kitchenCount.textContent = counts['Kitchenware & Electronics'];
  
  const otherCount = document.getElementById('otherCount');
  if (otherCount) otherCount.textContent = counts.other;
  
  // Update favorites badge
  const badge = document.getElementById('favoritesBadge');
  if (badge) {
    badge.textContent = counts.all;
    badge.style.display = counts.all > 0 ? 'flex' : 'none';
  }
}

// Render favorites
function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  const emptyState = document.getElementById('emptyFavorites');
  
  if (!grid || !emptyState) return;
  
  // Filter products
  let filtered = [...favoriteProducts];
  
  if (currentFilter !== 'all') {
    if (currentFilter === 'other') {
      const mainCategories = ['Cosmetics & Personal Care', 'Food Products', 'Alcoholic Drinks', 'Kitchenware & Electronics'];
      filtered = filtered.filter(p => !mainCategories.includes(p.category));
    } else {
      filtered = filtered.filter(p => p.category === currentFilter);
    }
  }
  
  // Sort products
  switch(currentSort) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'recent':
      const likedIds = getLikedProducts();
      filtered.sort((a, b) => likedIds.indexOf(b.id) - likedIds.indexOf(a.id));
      break;
  }
  
  console.log('Filtered products:', filtered.length);
  
  // Show/hide empty state
  if (favoriteProducts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
    console.log('Showing empty state - no favorites');
    return;
  }
  
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-light);">No products in this category</p>';
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    console.log('No products in filtered category');
    return;
  }
  
  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  
  // Render products
  grid.innerHTML = filtered.map(product => `
    <div class="favorite-card">
      <button class="remove-favorite-btn" onclick="removeFavorite(event, ${product.id})" title="Remove from favorites">
        <i class="fas fa-times"></i>
      </button>
      <a href="product.html?id=${product.id}" class="favorite-card-link">
        <img src="${product.image}" alt="${product.name}" class="favorite-img" loading="lazy" />
        <div class="favorite-info">
          <div class="favorite-category">${product.category}</div>
          <div class="favorite-name">${product.name}</div>
          <div class="favorite-price">${formatPrice(product.price)}</div>
        </div>
      </a>
      <button class="favorite-add-cart" onclick="addToCartFromFavorites(event, ${product.id})">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>
  `).join('');
  
  console.log('Rendered', filtered.length, 'products');
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
}

// Remove favorite
function removeFavorite(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  
  let liked = getLikedProducts();
  liked = liked.filter(id => id !== productId);
  localStorage.setItem('likedProducts', JSON.stringify(liked));
  
  showToast('Removed from favorites');
  loadFavorites();
}

// Add to cart from favorites
function addToCartFromFavorites(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  
  const product = allProducts.find(p => p.id === productId);
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
  showToast('Added to cart!');
}

// Clear all favorites
function clearAllFavorites() {
  if (favoriteProducts.length === 0) return;
  
  if (confirm('Are you sure you want to remove all favorites?')) {
    localStorage.setItem('likedProducts', JSON.stringify([]));
    showToast('All favorites cleared');
    loadFavorites();
  }
}

// Add all to cart
function addAllToCart() {
  if (favoriteProducts.length === 0) return;
  
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  favoriteProducts.forEach(product => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  });
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`Added ${favoriteProducts.length} items to cart!`);
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const mobileBadge = document.getElementById('mobileCartBadge');
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (badge) badge.textContent = totalItems;
  if (mobileBadge) mobileBadge.textContent = totalItems;
}

// Show toast
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Favorites page initializing...');
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeIcon = document.querySelector('#themeToggle i');
  if (themeIcon) {
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.favorite-card');
      
      cards.forEach(card => {
        const name = card.querySelector('.favorite-name')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.favorite-category')?.textContent.toLowerCase() || '';
        
        if (name.includes(query) || category.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  // Filter tabs
  const tabs = document.querySelectorAll('.favorites-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderFavorites();
    });
  });
  
  // Sort
  const sortSelect = document.getElementById('favoritesSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderFavorites();
    });
  }
  
  // Clear all button
  const clearAllBtn = document.getElementById('clearAllBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllFavorites);
  }
  
  // Add all to cart button
  const addAllBtn = document.getElementById('addAllToCartBtn');
  if (addAllBtn) {
    addAllBtn.addEventListener('click', addAllToCart);
  }
  
  // Load favorites
  loadFavorites();
  updateCartBadge();
  
  console.log('Favorites page initialized');
});
