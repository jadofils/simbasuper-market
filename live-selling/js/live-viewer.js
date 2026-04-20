// Live Viewer JavaScript
let currentFeaturedProduct = null;
let viewerCount = 1247;
let currentSession = null;

// Session data
const sessions = {
  1: {
    id: 1,
    title: "Fresh Fruits & Vegetables - Live Sale! 🍎🥕",
    host: "Sarah Uwase",
    hostAvatar: "https://ui-avatars.com/api/?name=Sarah+Uwase&background=30364F&color=fff&size=128",
    videoUrl: "../assets/live-buy-and -sell-fruits.mp4",
    viewers: 1247
  },
  2: {
    id: 2,
    title: "Amazing Deals - Everything Must Go! 🔥",
    host: "Jean Claude",
    hostAvatar: "https://ui-avatars.com/api/?name=Jean+Claude&background=E1D9BC&color=30364F&size=128",
    videoUrl: "../assets/selling-live.mp4",
    viewers: 892
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Live Selling Viewer initialized');
  
  // Get session from URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session') || localStorage.getItem('currentLiveSession') || '1';
  currentSession = sessions[sessionId] || sessions[1];
  
  // Update page with session data
  loadSessionData();
  
  // Load theme
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
  
  // Update cart badge
  updateCartBadge();
  
  // Start video
  const video = document.getElementById('liveVideo');
  if (video) {
    // Unmute after user interaction (autoplay policy)
    video.muted = false;
    video.volume = 0.5;
    video.play().catch(err => {
      console.log('Video autoplay prevented:', err);
      // Show play button overlay
      showPlayButton();
    });
  }
  
  // Show demo instructions after 3 seconds (only if not dismissed before)
  setTimeout(() => {
    const dontShowAgain = localStorage.getItem('dontShowInstructions');
    if (dontShowAgain !== 'true') {
      showDemoInstructions();
    }
  }, 3000);
  
  // Simulate viewer count changes
  setInterval(() => {
    viewerCount += Math.floor(Math.random() * 10) - 4;
    viewerCount = Math.max(1000, viewerCount);
    const viewerEl = document.getElementById('viewerCount');
    if (viewerEl) {
      viewerEl.textContent = viewerCount.toLocaleString();
    }
  }, 5000);
  
  // Tab switching
  const tabs = document.querySelectorAll('.sidebar-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
  
  // Chat input
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // Simulate featured product every 30 seconds
  setInterval(() => {
    showRandomFeaturedProduct();
  }, 30000);
  
  // Show first featured product after 5 seconds
  setTimeout(() => {
    showRandomFeaturedProduct();
  }, 5000);
});

// Load session data
function loadSessionData() {
  // Update video source
  const video = document.getElementById('liveVideo');
  if (video && currentSession) {
    const source = video.querySelector('source');
    if (source) {
      source.src = currentSession.videoUrl;
      video.load();
    }
  }
  
  // Update host info
  const hostAvatar = document.querySelector('.host-avatar');
  const hostName = document.querySelector('.host-details h3');
  const viewerCountEl = document.getElementById('viewerCount');
  
  if (hostAvatar) hostAvatar.src = currentSession.hostAvatar;
  if (hostName) hostName.textContent = currentSession.host;
  if (viewerCountEl) {
    viewerCount = currentSession.viewers;
    viewerCountEl.textContent = viewerCount.toLocaleString();
  }
  
  // Update page title
  document.title = currentSession.title + ' — Simba Live';
}

// Switch tabs
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Send reaction
function sendReaction(type) {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('send reactions')) {
    return;
  }
  
  const overlay = document.getElementById('reactionsOverlay');
  const reaction = document.createElement('div');
  reaction.className = 'reaction-float';
  
  const icons = {
    heart: '❤️',
    fire: '🔥',
    clap: '👏',
    laugh: '😂',
    wow: '😮'
  };
  
  reaction.textContent = icons[type] || '❤️';
  reaction.style.left = Math.random() * 80 + 10 + '%';
  
  overlay.appendChild(reaction);
  
  setTimeout(() => {
    reaction.remove();
  }, 3000);
  
  // Haptic feedback on mobile
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Show random featured product
function showRandomFeaturedProduct() {
  // Get products from localStorage or use dummy data
  let products = [];
  try {
    const cachedProducts = localStorage.getItem('cachedProducts');
    if (cachedProducts) {
      products = JSON.parse(cachedProducts);
    }
  } catch (e) {
    console.error('Error loading products:', e);
  }
  
  if (products.length === 0) {
    // Dummy products
    products = [
      { id: 1, name: 'Inyange Milk 1L', price: 1200, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
      { id: 5, name: 'Azam Cooking Oil 2L', price: 8500, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300' },
      { id: 12, name: 'Bralirwa Primus Beer', price: 1500, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300' }
    ];
  }
  
  const randomProduct = products[Math.floor(Math.random() * Math.min(products.length, 20))];
  showFeaturedProduct(randomProduct);
}

// Show featured product
function showFeaturedProduct(product) {
  currentFeaturedProduct = product;
  
  const overlay = document.getElementById('featuredProduct');
  const img = document.getElementById('featuredImg');
  const name = document.getElementById('featuredName');
  const price = document.getElementById('featuredPrice');
  
  img.src = product.image;
  img.alt = product.name;
  name.textContent = product.name;
  price.textContent = formatPrice(product.price);
  
  overlay.style.display = 'block';
  
  // Auto-hide after 15 seconds
  setTimeout(() => {
    closeFeaturedProduct();
  }, 15000);
}

// Close featured product
function closeFeaturedProduct() {
  const overlay = document.getElementById('featuredProduct');
  overlay.style.display = 'none';
  currentFeaturedProduct = null;
}

// Quick buy featured product
function quickBuyFeatured() {
  if (!currentFeaturedProduct) return;
  
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('add to cart')) {
    return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === currentFeaturedProduct.id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...currentFeaturedProduct, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast('Added to cart! 🛒');
  closeFeaturedProduct();
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

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Show play button overlay
function showPlayButton() {
  const video = document.getElementById('liveVideo');
  const player = document.querySelector('.video-player');
  
  const playOverlay = document.createElement('div');
  playOverlay.className = 'play-overlay';
  playOverlay.innerHTML = `
    <button class="play-button" onclick="playVideo()">
      <i class="fas fa-play"></i>
    </button>
    <p style="color: white; margin-top: 1rem; font-size: 1.1rem;">Click to start demo</p>
  `;
  
  player.appendChild(playOverlay);
}

function playVideo() {
  const video = document.getElementById('liveVideo');
  const overlay = document.querySelector('.play-overlay');
  
  video.muted = false;
  video.volume = 0.5;
  video.play();
  
  if (overlay) {
    overlay.remove();
  }
}

// Show demo instructions
function showDemoInstructions() {
  // Remove existing instructions if any
  const existing = document.querySelector('.demo-instructions');
  if (existing) {
    existing.remove();
  }
  
  const instructions = `
    <div class="demo-instructions">
      <div class="demo-instructions-content">
        <button class="close-instructions" onclick="closeDemoInstructions()">
          <i class="fas fa-times"></i>
        </button>
        <h3><i class="fas fa-lightbulb"></i> How to Use Live Selling Demo</h3>
        <div class="instructions-grid">
          <div class="instruction-item">
            <div class="instruction-icon"><i class="fas fa-video"></i></div>
            <h4>Watch the Video</h4>
            <p>This demo video shows how live selling works in real-time</p>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon"><i class="fas fa-comments"></i></div>
            <h4>Try the Chat</h4>
            <p>Send messages and see auto-translation in 3 languages</p>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon"><i class="fas fa-closed-captioning"></i></div>
            <h4>Enable Captions</h4>
            <p>Click [CC] button to see live translated captions</p>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon"><i class="fas fa-heart"></i></div>
            <h4>Send Reactions</h4>
            <p>Click reaction buttons below video to interact</p>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon"><i class="fas fa-shopping-cart"></i></div>
            <h4>Shop Products</h4>
            <p>Browse products tab and add items to cart</p>
          </div>
          <div class="instruction-item">
            <div class="instruction-icon"><i class="fas fa-language"></i></div>
            <h4>Change Language</h4>
            <p>Select 🇬🇧 EN, 🇫🇷 FR, or 🇷🇼 RW for translation</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; padding: 1rem; background: var(--bg); border-radius: 8px;">
          <input type="checkbox" id="dontShowAgainCheckbox" style="width: 20px; height: 20px; cursor: pointer;">
          <label for="dontShowAgainCheckbox" style="cursor: pointer; color: var(--text); font-size: 0.95rem;">Don't show this again</label>
        </div>
        <button class="btn-primary" onclick="closeInstructionsWithPreference()" style="margin-top: 1rem;">
          <i class="fas fa-check"></i> Got it! Let's try
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', instructions);
}

function closeInstructionsWithPreference() {
  const checkbox = document.getElementById('dontShowAgainCheckbox');
  if (checkbox && checkbox.checked) {
    localStorage.setItem('dontShowInstructions', 'true');
  }
  closeDemoInstructions();
}

function closeDemoInstructions() {
  const instructions = document.querySelector('.demo-instructions');
  if (instructions) {
    instructions.remove();
  }
}

// Make functions global
window.playVideo = playVideo;
window.closeDemoInstructions = closeDemoInstructions;
window.closeInstructionsWithPreference = closeInstructionsWithPreference;
