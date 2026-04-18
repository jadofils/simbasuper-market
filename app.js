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
    const hasDiscount = hasReferralDiscount();
    const discountPercent = getReferralDiscount();
    const originalPrice = product.price;
    const discountedPrice = applyReferralDiscount(originalPrice);
    
    return `
    <a href="product.html?id=${product.id}" class="product-card">
      ${hasDiscount ? `<div class="discount-badge">-${discountPercent}% OFF</div>` : ''}
      <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(event, ${product.id})" title="${isLiked ? 'Unlike' : 'Like'}">
        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
      </button>
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300/f0f0f0/555?text=No+Image'" />
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-footer">
          <div class="product-price">
            ${hasDiscount ? `<span class="original-price">${formatPrice(originalPrice)}</span>` : ''}
            ${formatPrice(Math.round(discountedPrice))}
          </div>
          <button class="add-to-cart" onclick="addToCart(event, ${product.id})">
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </a>
  `;
  }).join('');;
  
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
  const mobileBadge = document.getElementById('mobileCartBadge');
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (badge) badge.textContent = totalItems;
  if (mobileBadge) mobileBadge.textContent = totalItems;
}

// Update favorites badge
function updateFavoritesBadge() {
  const badge = document.getElementById('favoritesBadge');
  const liked = getLikedProducts();
  
  if (badge) {
    badge.textContent = liked.length;
    badge.style.display = liked.length > 0 ? 'flex' : 'none';
  }
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
  
  console.log('Toggle like for product:', productId);
  console.log('Current liked products:', liked);
  
  if (index > -1) {
    liked.splice(index, 1);
    showToast('Removed from favorites');
  } else {
    liked.push(productId);
    showToast('Added to favorites');
  }
  
  localStorage.setItem('likedProducts', JSON.stringify(liked));
  console.log('Updated liked products:', liked);
  
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
  
  updateFavoritesBadge();
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
  updateFavoritesBadge();
  
  // Initialize contact form validation
  validateContactForm();
  
  // Initialize referral system
  initReferralSystem();
});


// ========== CONTACT FORM VALIDATION ==========
function validateContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('contactName');
    const nameError = document.getElementById('nameError');
    if (name.value.trim().length < 3) {
      nameError.textContent = 'Name must be at least 3 characters';
      name.classList.add('error');
      isValid = false;
    } else {
      nameError.textContent = '';
      name.classList.remove('error');
    }
    
    // Email validation
    const email = document.getElementById('contactEmail');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      emailError.textContent = 'Please enter a valid email address';
      email.classList.add('error');
      isValid = false;
    } else {
      emailError.textContent = '';
      email.classList.remove('error');
    }
    
    // Phone validation (Rwanda format)
    const phone = document.getElementById('contactPhone');
    const phoneError = document.getElementById('phoneError');
    const phoneRegex = /^(\+250|0)?[7][0-9]{8}$/;
    if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
      phoneError.textContent = 'Please enter a valid Rwandan phone number';
      phone.classList.add('error');
      isValid = false;
    } else {
      phoneError.textContent = '';
      phone.classList.remove('error');
    }
    
    // Subject validation
    const subject = document.getElementById('contactSubject');
    const subjectError = document.getElementById('subjectError');
    if (!subject.value) {
      subjectError.textContent = 'Please select a subject';
      subject.classList.add('error');
      isValid = false;
    } else {
      subjectError.textContent = '';
      subject.classList.remove('error');
    }
    
    // Message validation
    const message = document.getElementById('contactMessage');
    const messageError = document.getElementById('messageError');
    if (message.value.trim().length < 10) {
      messageError.textContent = 'Message must be at least 10 characters';
      message.classList.add('error');
      isValid = false;
    } else {
      messageError.textContent = '';
      message.classList.remove('error');
    }
    
    if (isValid) {
      // Save to localStorage
      const contactData = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        subject: subject.value,
        message: message.value,
        timestamp: new Date().toISOString()
      };
      
      let contacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      contacts.push(contactData);
      localStorage.setItem('contactSubmissions', JSON.stringify(contacts));
      
      showToast('Message sent successfully! We\'ll get back to you soon.');
      form.reset();
    }
  });
}

// ========== REFERRAL SYSTEM ==========
function initReferralSystem() {
  // Check if user came from a referral link
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('ref');
  
  if (referralCode) {
    localStorage.setItem('referralCode', referralCode);
    localStorage.setItem('referralDiscount', '10'); // 10% discount
    showToast('🎉 Referral applied! You get 10% off your first order!');
    
    // Track referral
    let referrals = JSON.parse(localStorage.getItem('referralTracking') || '{}');
    if (!referrals[referralCode]) {
      referrals[referralCode] = [];
    }
    referrals[referralCode].push({
      timestamp: new Date().toISOString(),
      converted: false
    });
    localStorage.setItem('referralTracking', JSON.stringify(referrals));
  }
  
  // Generate user's own referral code
  let userReferralCode = localStorage.getItem('userReferralCode');
  if (!userReferralCode) {
    userReferralCode = 'SIMBA' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('userReferralCode', userReferralCode);
  }
  
  // Display referral banner if user has made a purchase
  const hasPurchased = localStorage.getItem('hasPurchased');
  if (hasPurchased) {
    displayReferralBanner(userReferralCode);
  }
}

function displayReferralBanner(code) {
  const productsSection = document.getElementById('products');
  if (!productsSection) return;
  
  const banner = document.createElement('div');
  banner.className = 'referral-banner';
  banner.innerHTML = `
    <div class="referral-content">
      <h3><i class="fas fa-gift"></i> Share & Earn Rewards!</h3>
      <p>Share your referral code with friends. They get 10% off, you get 500 RWF credit per referral!</p>
    </div>
    <div class="referral-code">
      <div>
        <div style="font-size: 0.8rem; opacity: 0.9; margin-bottom: 0.25rem;">Your Referral Code</div>
        <div class="referral-code-text" id="userReferralCode">${code}</div>
      </div>
      <button class="copy-referral-btn" onclick="copyReferralCode()">
        <i class="fas fa-copy"></i> Copy
      </button>
    </div>
  `;
  
  productsSection.insertBefore(banner, productsSection.firstChild);
}

function copyReferralCode() {
  const code = document.getElementById('userReferralCode').textContent;
  const url = window.location.origin + window.location.pathname + '?ref=' + code;
  
  navigator.clipboard.writeText(url).then(() => {
    showToast('Referral link copied! Share it to earn rewards!');
  });
}

function getReferralDiscount() {
  const discount = localStorage.getItem('referralDiscount');
  return discount ? parseInt(discount) : 0;
}

function applyReferralDiscount(price) {
  const discount = getReferralDiscount();
  if (discount > 0) {
    return price * (1 - discount / 100);
  }
  return price;
}

function hasReferralDiscount() {
  return getReferralDiscount() > 0;
}

// Mark referral as converted when purchase is made
function markReferralConverted() {
  const referralCode = localStorage.getItem('referralCode');
  if (referralCode) {
    let referrals = JSON.parse(localStorage.getItem('referralTracking') || '{}');
    if (referrals[referralCode]) {
      const lastReferral = referrals[referralCode][referrals[referralCode].length - 1];
      if (lastReferral && !lastReferral.converted) {
        lastReferral.converted = true;
        lastReferral.conversionDate = new Date().toISOString();
        localStorage.setItem('referralTracking', JSON.stringify(referrals));
        
        // Award credit to referrer
        let credits = JSON.parse(localStorage.getItem('referralCredits') || '{}');
        credits[referralCode] = (credits[referralCode] || 0) + 500;
        localStorage.setItem('referralCredits', JSON.stringify(credits));
      }
    }
    
    // Remove discount after first use
    localStorage.removeItem('referralDiscount');
  }
}

// Get user's referral stats
function getReferralStats() {
  const userCode = localStorage.getItem('userReferralCode');
  const tracking = JSON.parse(localStorage.getItem('referralTracking') || '{}');
  const credits = JSON.parse(localStorage.getItem('referralCredits') || '{}');
  
  const referrals = tracking[userCode] || [];
  const converted = referrals.filter(r => r.converted).length;
  const totalCredits = credits[userCode] || 0;
  
  return {
    totalReferrals: referrals.length,
    convertedReferrals: converted,
    totalCredits: totalCredits
  };
}


// ========== SMOOTH SCROLL ==========
document.addEventListener('DOMContentLoaded', () => {
  const contactLink = document.getElementById('contactLink');
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
