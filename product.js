// Product detail page
let currentProduct = null;
let products = [];
let quantity = 1;
let currentLang = localStorage.getItem('language') || 'en';

const productTranslations = {
  en: {
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    quantity: "Quantity",
    addToCart: "Add to Cart",
    relatedProducts: "Related Products",
    productNotFound: "Product not found"
  },
  fr: {
    inStock: "En Stock",
    outOfStock: "Rupture de Stock",
    quantity: "Quantité",
    addToCart: "Ajouter au Panier",
    relatedProducts: "Produits Similaires",
    productNotFound: "Produit non trouvé"
  },
  rw: {
    inStock: "Birahari",
    outOfStock: "Ntibihari",
    quantity: "Umubare",
    addToCart: "Ongeramo mu Gitebo",
    relatedProducts: "Ibindi Bicuruzwa",
    productNotFound: "Igicuruzwa ntigibonetse"
  }
};

// Product engagement tracking
function getProductLikeCount(productId) {
  const likes = JSON.parse(localStorage.getItem('productLikes') || '{}');
  return likes[productId] || Math.floor(Math.random() * 50) + 10;
}

function getProductViewCount(productId) {
  const views = JSON.parse(localStorage.getItem('productViews') || '{}');
  return views[productId] || 0;
}

function incrementViewCount(productId) {
  const views = JSON.parse(localStorage.getItem('productViews') || '{}');
  views[productId] = (views[productId] || 0) + 1;
  localStorage.setItem('productViews', JSON.stringify(views));
}

function getProductCartCount(productId) {
  const cartCounts = JSON.parse(localStorage.getItem('productCartCounts') || '{}');
  return cartCounts[productId] || Math.floor(Math.random() * 20) + 5;
}

function isProductLiked(productId) {
  const liked = JSON.parse(localStorage.getItem('likedProducts') || '[]');
  return liked.includes(productId);
}

function toggleProductLike() {
  if (!currentProduct) return;
  
  let liked = JSON.parse(localStorage.getItem('likedProducts') || '[]');
  const index = liked.indexOf(currentProduct.id);
  
  if (index > -1) {
    liked.splice(index, 1);
    showToast('Removed from favorites');
  } else {
    liked.push(currentProduct.id);
    showToast('Added to favorites');
  }
  
  localStorage.setItem('likedProducts', JSON.stringify(liked));
  updateFavoritesBadge();
  renderProduct();
}

function buyNow() {
  if (!currentProduct) return;
  addToCartFromDetail();
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 500);
}

function shareProduct(platform) {
  const url = window.location.href;
  const userReferralCode = localStorage.getItem('userReferralCode') || 'SIMBA' + Math.random().toString(36).substr(2, 6).toUpperCase();
  localStorage.setItem('userReferralCode', userReferralCode);
  
  const referralUrl = url.includes('?') ? `${url}&ref=${userReferralCode}` : `${url}?ref=${userReferralCode}`;
  const text = `Check out ${currentProduct.name} at Simba Supermarket! Use my code for 10% off: ${userReferralCode}`;
  
  // Track the share
  if (typeof trackSocialShare === 'function') {
    trackSocialShare(platform, currentProduct.id, currentProduct.name);
  }
  
  switch(platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, '_blank');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + referralUrl)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(referralUrl).then(() => {
        showToast('Referral link copied! Share to earn 500 RWF per friend!');
      });
      break;
  }
}

// Load products
async function loadProducts() {
  try {
    console.log('Loading products from JSON...');
    const response = await fetch('simba_products.json');
    const data = await response.json();
    products = data.products;
    console.log(`Loaded ${products.length} products`);
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    console.log('Product ID from URL:', productId);
    
    if (productId) {
      currentProduct = products.find(p => p.id === productId);
      console.log('Found product:', currentProduct);
      if (currentProduct) {
        renderProduct();
        renderRelatedProducts();
      } else {
        console.error('Product not found with ID:', productId);
        showProductNotFound();
      }
    } else {
      console.error('No product ID in URL');
      showProductNotFound();
    }
  } catch (error) {
    console.error('Error loading product:', error);
    const container = document.getElementById('productDetail');
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;"></i>
          <h2>Error Loading Product</h2>
          <p style="color: var(--text-light);">${error.message}</p>
          <a href="index.html" class="btn-primary" style="margin-top: 1rem;">
            <i class="fas fa-arrow-left"></i> Back to Shop
          </a>
        </div>
      `;
    }
  }
}

// Render product
function renderProduct() {
  const container = document.getElementById('productDetail');
  if (!container || !currentProduct) return;
  
  const t = productTranslations[currentLang];
  const isLiked = isProductLiked(currentProduct.id);
  const likeCount = getProductLikeCount(currentProduct.id);
  const viewCount = getProductViewCount(currentProduct.id);
  const cartCount = getProductCartCount(currentProduct.id);
  
  incrementViewCount(currentProduct.id);
  
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f5f5f5" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="Arial" font-size="80" x="50%25" y="45%25" text-anchor="middle"%3E📦%3C/text%3E%3Ctext fill="%23666" font-family="Arial" font-size="18" x="50%25" y="60%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
  
  container.innerHTML = `
    <div class="product-detail-left">
      <div class="product-image-section">
        <img src="${fallbackImage}" alt="${currentProduct.name}" class="product-detail-img" id="productImage" />
        <button class="product-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleProductLike()">
          <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
          <span>${isLiked ? 'Liked' : 'Like'}</span>
        </button>
      </div>
      
      <div class="product-stats">
        <div class="stat-item">
          <i class="fas fa-heart"></i>
          <div>
            <div class="stat-value">${likeCount}</div>
            <div class="stat-label">Likes</div>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-eye"></i>
          <div>
            <div class="stat-value">${viewCount}</div>
            <div class="stat-label">Views</div>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-shopping-cart"></i>
          <div>
            <div class="stat-value">${cartCount}</div>
            <div class="stat-label">In Carts</div>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-star"></i>
          <div>
            <div class="stat-value">4.5</div>
            <div class="stat-label">Rating</div>
          </div>
        </div>
      </div>
      
      <div class="trust-badges">
        <div class="trust-badge">
          <i class="fas fa-shield-alt"></i>
          <span>Secure Payment</span>
        </div>
        <div class="trust-badge">
          <i class="fas fa-truck"></i>
          <span>Fast Delivery</span>
        </div>
        <div class="trust-badge">
          <i class="fas fa-undo"></i>
          <span>Easy Returns</span>
        </div>
        <div class="trust-badge">
          <i class="fas fa-headset"></i>
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
    
    <div class="product-detail-right">
      <div class="product-breadcrumb">
        <a href="index.html">Home</a>
        <i class="fas fa-chevron-right"></i>
        <span>${currentProduct.category}</span>
        <i class="fas fa-chevron-right"></i>
        <span>${currentProduct.name}</span>
      </div>
      
      <h1>${currentProduct.name}</h1>
      
      <div class="product-meta">
        <span class="product-detail-category">
          <i class="fas fa-tag"></i> ${currentProduct.category}
        </span>
        <span class="product-sku">
          <i class="fas fa-barcode"></i> SKU: ${currentProduct.id}
        </span>
      </div>
      
      <div class="product-rating-section">
        <div class="stars">
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star-half-alt"></i>
        </div>
        <span class="rating-text">4.5 (${Math.floor(viewCount / 10) || 12} reviews)</span>
      </div>
      
      <div class="product-price-section">
        <div class="product-detail-price">${formatPrice(currentProduct.price)}</div>
        <div class="price-info">
          <span class="price-per-unit">Price per ${currentProduct.unit}</span>
          ${currentProduct.price > 5000 ? '<span class="free-shipping"><i class="fas fa-shipping-fast"></i> Free Shipping</span>' : ''}
        </div>
      </div>
      
      <div class="product-detail-stock" style="color: ${currentProduct.inStock ? '#10b981' : '#ef4444'}">
        <i class="fas fa-${currentProduct.inStock ? 'check-circle' : 'times-circle'}"></i>
        ${currentProduct.inStock ? t.inStock : t.outOfStock}
        ${currentProduct.inStock ? '<span class="stock-count">(50+ available)</span>' : ''}
      </div>
      
      <div class="product-highlights">
        <h3><i class="fas fa-check-circle"></i> Product Highlights</h3>
        <ul>
          <li><i class="fas fa-check"></i> 100% Authentic Product</li>
          <li><i class="fas fa-check"></i> Quality Guaranteed</li>
          <li><i class="fas fa-check"></i> Same Day Delivery Available</li>
          <li><i class="fas fa-check"></i> Secure Payment Options</li>
        </ul>
      </div>
      
      <div class="quantity-selector">
        <label>${t.quantity}</label>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQuantity(-1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="qty-display" id="qtyDisplay">${quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      <div class="product-actions">
        <button class="btn-primary btn-large" onclick="addToCartFromDetail()" ${!currentProduct.inStock ? 'disabled' : ''}>
          <i class="fas fa-shopping-cart"></i> ${t.addToCart}
        </button>
        <button class="btn-outline btn-large" onclick="buyNow()" ${!currentProduct.inStock ? 'disabled' : ''}>
          <i class="fas fa-bolt"></i> Buy Now
        </button>
      </div>
      
      <div class="social-proof">
        <div class="proof-item">
          <i class="fas fa-users"></i>
          <span><strong>${Math.floor(viewCount / 5) || 8}</strong> people viewing this now</span>
        </div>
        <div class="proof-item">
          <i class="fas fa-fire"></i>
          <span><strong>${Math.floor(likeCount * 2) || 24}</strong> sold in last 7 days</span>
        </div>
      </div>
      
      <div class="product-share">
        <span>Share:</span>
        <button class="share-btn" onclick="shareProduct('facebook')"><i class="fab fa-facebook"></i></button>
        <button class="share-btn" onclick="shareProduct('twitter')"><i class="fab fa-twitter"></i></button>
        <button class="share-btn" onclick="shareProduct('whatsapp')"><i class="fab fa-whatsapp"></i></button>
        <button class="share-btn" onclick="shareProduct('copy')"><i class="fas fa-link"></i></button>
      </div>
    </div>
  `;
  
  // Load actual image after content is displayed
  setTimeout(() => {
    const img = document.getElementById('productImage');
    if (img && currentProduct.image) {
      const actualImage = new Image();
      const timeout = setTimeout(() => {
        img.src = fallbackImage;
      }, 3000);
      
      actualImage.onload = () => {
        clearTimeout(timeout);
        img.src = currentProduct.image;
      };
      
      actualImage.onerror = () => {
        clearTimeout(timeout);
        img.src = fallbackImage;
      };
      
      actualImage.src = currentProduct.image;
    }
  }, 0);
}

// Render related products
let allRelatedProducts = [];

function renderRelatedProducts(filtered = null) {
  const grid = document.getElementById('relatedGrid');
  if (!grid || !currentProduct) return;
  
  if (!filtered) {
    allRelatedProducts = products
      .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
      .slice(0, 8);
  }
  
  const productsToShow = filtered || allRelatedProducts;
  
  if (productsToShow.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem; grid-column: 1/-1;">No related products found</p>';
    return;
  }
  
  grid.innerHTML = productsToShow.map(product => {
    const fallbackImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23999" font-size="60" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E📦%3C/text%3E%3C/svg%3E';
    return `
      <a href="product.html?id=${product.id}" class="product-card">
        <img src="${product.image || fallbackImg}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='${fallbackImg}'" />
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
}

// Handle related products search
function handleRelatedSearch() {
  const input = document.getElementById('relatedSearch');
  if (!input) return;
  
  const query = input.value.toLowerCase().trim();
  
  if (!query) {
    renderRelatedProducts();
    return;
  }
  
  const filtered = allRelatedProducts.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  
  renderRelatedProducts(filtered);
}

// Show product not found
function showProductNotFound() {
  const container = document.getElementById('productDetail');
  if (!container) return;
  
  const t = productTranslations[currentLang];
  
  container.innerHTML = `
    <div style="text-align: center; padding: 4rem;">
      <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
      <h2>${t.productNotFound}</h2>
      <a href="index.html" class="btn-primary" style="margin-top: 2rem;">
        <i class="fas fa-arrow-left"></i> Back to Shop
      </a>
    </div>
  `;
}

// Change quantity
function changeQuantity(change) {
  quantity = Math.max(1, quantity + change);
  const display = document.getElementById('qtyDisplay');
  if (display) {
    display.textContent = quantity;
  }
}

// Add to cart from detail
function addToCartFromDetail() {
  if (!currentProduct) return;
  
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === currentProduct.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...currentProduct, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast('Added to cart!');
  
  // Reset quantity
  quantity = 1;
  const display = document.getElementById('qtyDisplay');
  if (display) {
    display.textContent = quantity;
  }
}

// Add to cart (for related products)
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
  showToast('Added to cart!');
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
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
  const liked = JSON.parse(localStorage.getItem('likedProducts') || '[]');
  
  if (badge) {
    badge.textContent = liked.length;
    badge.style.display = liked.length > 0 ? 'flex' : 'none';
  }
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  currentLang = localStorage.getItem('language') || 'en';
  
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
  
  loadProducts();
  updateCartBadge();
  updateFavoritesBadge();
  
  // Related products search
  const relatedSearch = document.getElementById('relatedSearch');
  if (relatedSearch) {
    relatedSearch.addEventListener('input', handleRelatedSearch);
  }
  
  // Update related products title
  const relatedTitle = document.querySelector('.related-section .section-title');
  if (relatedTitle) {
    relatedTitle.textContent = productTranslations[currentLang].relatedProducts;
  }
  
  // Language change
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('language', currentLang);
      renderProduct();
      const relatedTitle = document.querySelector('.related-section .section-title');
      if (relatedTitle) {
        relatedTitle.textContent = productTranslations[currentLang].relatedProducts;
      }
    });
  }
});
