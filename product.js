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

// Load products
async function loadProducts() {
  try {
    const response = await fetch('simba_products.json');
    const data = await response.json();
    products = data.products;
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
      currentProduct = products.find(p => p.id === productId);
      if (currentProduct) {
        renderProduct();
        renderRelatedProducts();
      } else {
        showProductNotFound();
      }
    } else {
      showProductNotFound();
    }
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

// Render product
function renderProduct() {
  const container = document.getElementById('productDetail');
  if (!container || !currentProduct) return;
  
  const t = productTranslations[currentLang];
  
  container.innerHTML = `
    <div>
      <img src="${currentProduct.image}" alt="${currentProduct.name}" class="product-detail-img" />
    </div>
    <div class="product-detail-info">
      <h1>${currentProduct.name}</h1>
      <span class="product-detail-category">${currentProduct.category}</span>
      <div class="product-detail-price">${formatPrice(currentProduct.price)}</div>
      <div class="product-detail-stock" style="color: ${currentProduct.inStock ? '#22c55e' : '#ef4444'}">
        <i class="fas fa-${currentProduct.inStock ? 'check-circle' : 'times-circle'}"></i>
        ${currentProduct.inStock ? t.inStock : t.outOfStock}
      </div>
      
      <div class="quantity-selector">
        <button class="qty-btn" onclick="changeQuantity(-1)">
          <i class="fas fa-minus"></i>
        </button>
        <span class="qty-display" id="qtyDisplay">${quantity}</span>
        <button class="qty-btn" onclick="changeQuantity(1)">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      
      <button class="btn-primary full-width" onclick="addToCartFromDetail()" ${!currentProduct.inStock ? 'disabled' : ''}>
        <i class="fas fa-shopping-cart"></i> ${t.addToCart}
      </button>
    </div>
  `;
}

// Render related products
function renderRelatedProducts() {
  const grid = document.getElementById('relatedGrid');
  if (!grid || !currentProduct) return;
  
  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);
  
  grid.innerHTML = related.map(product => `
    <a href="product.html?id=${product.id}" class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
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
  `).join('');
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
  if (!badge) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
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
  
  loadProducts();
  updateCartBadge();
  
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
