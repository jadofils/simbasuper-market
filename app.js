// Global state
let products = [];
let categories = [];
let currentLanguage = 'en';
let displayedProducts = 12;

// Translations
const translations = {
  en: {
    heroTitle: "Rwanda's Favourite Online Supermarket",
    heroSub: "552 products. Fast delivery. Pay with MoMo.",
    heroBtn: "Shop Now",
    catTitle: "Shop by Category",
    productsTitle: "All Products",
    allCategories: "All Categories",
    sortBy: "Sort by",
    priceLowHigh: "Price: Low → High",
    priceHighLow: "Price: High → Low",
    nameAZ: "Name: A → Z",
    loadMore: "Load More",
    addedToCart: "Added to cart!",
    footerRights: "© 2025 Simba Supermarket. All rights reserved.",
    products: "products"
  },
  fr: {
    heroTitle: "Le Supermarché en Ligne Préféré du Rwanda",
    heroSub: "552 produits. Livraison rapide. Payez avec MoMo.",
    heroBtn: "Acheter Maintenant",
    catTitle: "Acheter par Catégorie",
    productsTitle: "Tous les Produits",
    allCategories: "Toutes les Catégories",
    sortBy: "Trier par",
    priceLowHigh: "Prix: Bas → Haut",
    priceHighLow: "Prix: Haut → Bas",
    nameAZ: "Nom: A → Z",
    loadMore: "Charger Plus",
    addedToCart: "Ajouté au panier!",
    footerRights: "© 2025 Simba Supermarket. Tous droits réservés.",
    products: "produits"
  },
  rw: {
    heroTitle: "Isoko Nkuru y'Intaneti mu Rwanda",
    heroSub: "Ibicuruzwa 552. Gutanga vuba. Kwishyura na MoMo.",
    heroBtn: "Gura Ubu",
    catTitle: "Gura ukurikije Icyiciro",
    productsTitle: "Ibicuruzwa Byose",
    allCategories: "Ibyiciro Byose",
    sortBy: "Shiraho",
    priceLowHigh: "Igiciro: Hasi → Hejuru",
    priceHighLow: "Igiciro: Hejuru → Hasi",
    nameAZ: "Izina: A → Z",
    loadMore: "Tangaza Byinshi",
    addedToCart: "Byongewe mu gitebo!",
    footerRights: "© 2025 Simba Supermarket. Uburenganzira bwose burahawe.",
    products: "ibicuruzwa"
  }
};

// Load products from JSON
async function loadProducts() {
  try {
    console.log('Loading products...');
    const response = await fetch('simba_products.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    products = data.products;
    
    console.log(`Loaded ${products.length} products`);
    
    // Extract unique categories
    const categoryMap = new Map();
    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          name: product.category,
          count: 0
        });
      }
      categoryMap.get(product.category).count++;
    });
    
    categories = Array.from(categoryMap.values());
    console.log(`Found ${categories.length} categories`);
    
    renderCategories();
    renderProducts();
    populateCategoryFilter();
    updateCartBadge();
  } catch (error) {
    console.error('Error loading products:', error);
    const grid = document.getElementById('productsGrid');
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;"></i>
          <h2>Error Loading Products</h2>
          <p style="color: var(--text-light);">${error.message}</p>
          <button class="btn-primary" onclick="loadProducts()" style="margin-top: 1rem;">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
    }
  }
}

// Category icons mapping
const categoryIcons = {
  "Cosmetics & Personal Care": "fa-spray-can",
  "Alcoholic Drinks": "fa-wine-bottle",
  "Food Products": "fa-apple-alt",
  "Kitchenware & Electronics": "fa-blender",
  "Cleaning & Sanitary": "fa-broom",
  "General": "fa-box",
  "Baby Products": "fa-baby",
  "Sports & Fitness": "fa-dumbbell",
  "Stationery": "fa-pen"
};

// Render categories
function renderCategories(filteredCategories = null) {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  
  const categoriesToShow = filteredCategories || categories;
  
  if (categoriesToShow.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <i class="fas fa-search" style="font-size: 2rem; color: var(--text-light); margin-bottom: 0.5rem;"></i>
        <p style="color: var(--text-light);">No categories found</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = categoriesToShow.map(cat => `
    <a href="#products" class="category-card" onclick="filterByCategory('${cat.name}')">
      <div class="category-icon">
        <i class="fas ${categoryIcons[cat.name] || 'fa-shopping-basket'}"></i>
      </div>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.count} ${translations[currentLanguage].products}</div>
    </a>
  `).join('');
}

// Render products
function renderProducts(filteredProducts = null) {
  const grid = document.getElementById('productsGrid');
  if (!grid) {
    console.error('Products grid element not found');
    return;
  }
  
  const productsToShow = filteredProducts || products;
  const limited = productsToShow.slice(0, displayedProducts);
  
  console.log(`Rendering ${limited.length} products`);
  
  if (limited.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <i class="fas fa-box-open" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
        <h2>No Products Found</h2>
        <p style="color: var(--text-light);">Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = limited.map(product => {
    const isLiked = isProductLiked(product.id);
    return `
    <a href="product.html?id=${product.id}" class="product-card">
      <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(event, ${product.id})" title="${isLiked ? 'Unlike' : 'Like'}">
        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
      </button>
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300/f0f0f0/555?text=No+Image'" />
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-footer">
          <div class="product-price">${formatPrice(product.price)}</div>
          <button class="add-to-cart" onclick="addToCart(event, ${product.id})">
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </a>
  `;
  }).join('');
  
  // Show/hide load more button
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = displayedProducts >= productsToShow.length ? 'none' : 'block';
  }
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
}

// Add to cart
function addToCart(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  
  const product = products.find(p => p.id === productId);
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
  showToast(translations[currentLanguage].addedToCart);
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Filter by category
function filterByCategory(categoryName) {
  const select = document.getElementById('categoryFilter');
  if (select) {
    select.value = categoryName;
    handleCategoryFilter();
  }
}

// Handle category filter
function handleCategoryFilter() {
  const select = document.getElementById('categoryFilter');
  const category = select.value;
  
  displayedProducts = 12;
  
  if (category) {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  } else {
    renderProducts();
  }
}

// Handle sort
function handleSort() {
  const select = document.getElementById('sortSelect');
  const sortValue = select.value;
  
  let sorted = [...products];
  
  switch(sortValue) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  
  renderProducts(sorted);
}

// Handle search
function handleSearch() {
  const input = document.getElementById('searchInput');
  const query = input.value.toLowerCase().trim();
  
  if (!query) {
    renderProducts();
    return;
  }
  
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  
  displayedProducts = 12;
  renderProducts(filtered);
}

// Handle category search
function handleCategorySearch() {
  const input = document.getElementById('categorySearch');
  const query = input.value.toLowerCase().trim();
  
  if (!query) {
    renderCategories();
    return;
  }
  
  const filtered = categories.filter(cat => 
    cat.name.toLowerCase().includes(query)
  );
  
  renderCategories(filtered);
}

// Handle category sort
function handleCategorySort() {
  const select = document.getElementById('categorySort');
  const sortValue = select.value;
  
  let sorted = [...categories];
  
  if (sortValue === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === 'count') {
    sorted.sort((a, b) => b.count - a.count);
  }
  
  renderCategories(sorted);
}

// Like functionality
function getLikedProducts() {
  return JSON.parse(localStorage.getItem('likedProducts') || '[]');
}

function isProductLiked(productId) {
  const liked = getLikedProducts();
  return liked.includes(productId);
}

function toggleLike(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  
  let liked = getLikedProducts();
  const index = liked.indexOf(productId);
  
  if (index > -1) {
    liked.splice(index, 1);
    showToast('Removed from favorites');
  } else {
    liked.push(productId);
    showToast('Added to favorites');
  }
  
  localStorage.setItem('likedProducts', JSON.stringify(liked));
  
  // Update the button
  const btn = event.currentTarget;
  const icon = btn.querySelector('i');
  
  if (index > -1) {
    btn.classList.remove('liked');
    icon.className = 'far fa-heart';
    btn.title = 'Like';
  } else {
    btn.classList.add('liked');
    icon.className = 'fas fa-heart';
    btn.title = 'Unlike';
  }
}

// Load more products
function loadMore() {
  displayedProducts += 12;
  renderProducts();
}

// Populate category filter
function populateCategoryFilter() {
  const select = document.getElementById('categoryFilter');
  if (!select) return;
  
  select.innerHTML = `<option value="">${translations[currentLanguage].allCategories}</option>` +
    categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
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

// Language change
function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  updateTranslations();
  renderCategories();
  populateCategoryFilter();
}

// Update translations
function updateTranslations() {
  const t = translations[currentLanguage];
  
  const elements = {
    heroTitle: 'heroTitle',
    heroSub: 'heroSub',
    heroBtn: 'heroBtn',
    catTitle: 'catTitle',
    productsTitle: 'productsTitle',
    footerRights: 'footerRights'
  };
  
  Object.keys(elements).forEach(key => {
    const el = document.getElementById(elements[key]);
    if (el) el.textContent = t[key];
  });
  
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.textContent = t.loadMore;
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
  
  // Load saved language
  const savedLang = localStorage.getItem('language') || 'en';
  currentLanguage = savedLang;
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
  }
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Category search
  const categorySearch = document.getElementById('categorySearch');
  if (categorySearch) {
    categorySearch.addEventListener('input', handleCategorySearch);
  }
  
  // Category sort
  const categorySort = document.getElementById('categorySort');
  if (categorySort) {
    categorySort.addEventListener('change', handleCategorySort);
  }
  
  // Filters
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryFilter);
  }
  
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSort);
  }
  
  // Load more
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMore);
  }
  
  // Load products
  loadProducts();
  updateTranslations();
});
