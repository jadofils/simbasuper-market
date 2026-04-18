// Favorites page functionality
let allProducts = [];
let favoriteProducts = [];
let currentFilter = 'all';
let currentSort = 'recent';

// Load products and favorites
async function loadFavorites() {
  try {
    const response = await fetch('simba_products.json');
    const data = await response.json();
    allProducts = data.products;
    
    const likedIds = getLikedProducts();
    favoriteProducts = allProducts.filter(p => likedIds.includes(p.id));
    
    updateCounts();
    renderFavorites();
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
}

// Get liked products from localStorage
function getLikedProducts() {
  return JSON.parse(localStorage.getItem('likedProducts') || '[]');
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
  
  document.getElementById('favoritesCount').textContent = `${counts.all} items saved`;
  document.getElementById('allCount').textContent = counts.all;
  document.getElementById('cosmeticsCount').textContent = counts['Cosmetics & Personal Care'];
  document.getElementById('foodCount').textContent = counts['Food Products'];
  document.getElementById('drinksCount').textContent = counts['Alcoholic Drinks'];
  document.getElementById('kitchenCount').textContent = counts['Kitchenware & Electronics'];
  document.getElementById('otherCount').textContent = counts.other;
  
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
  
  if (!grid) return;
  
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
      // Keep original order (most recently added first)
      const likedIds = getLikedProducts();
      filtered.sort((a, b) => likedIds.indexOf(b.id) - likedIds.indexOf(a.id));
      break;
  }
  
  // Show/hide empty state
  if (filtered.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
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
});
