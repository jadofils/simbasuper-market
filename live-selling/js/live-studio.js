// Live Studio JavaScript
let isStreaming = false;
let isCameraOn = false;
let isMicOn = false;
let isScreenSharing = false;
let streamDuration = 0;
let streamInterval = null;
let featuredProducts = [];
let allProducts = [];
let analytics = {
  viewers: 0,
  orders: 0,
  revenue: 0,
  reactions: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Live Studio initialized');
  
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
  
  // Tab switching
  const tabs = document.querySelectorAll('.sidebar-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
  
  // Load products
  loadProducts();
  
  // Simulate analytics updates
  setInterval(updateAnalytics, 3000);
});

// Toggle stream
function toggleStream() {
  if (!isStreaming) {
    startStream();
  } else {
    stopStream();
  }
}

// Start stream
function startStream() {
  isStreaming = true;
  
  // Update UI
  const statusIndicator = document.querySelector('.status-indicator');
  statusIndicator.classList.remove('offline');
  statusIndicator.classList.add('live');
  statusIndicator.querySelector('.status-text').textContent = 'LIVE';
  
  const startBtn = document.getElementById('startStreamBtn');
  startBtn.classList.add('streaming');
  startBtn.innerHTML = '<i class="fas fa-circle"></i><span>Streaming...</span>';
  
  const endBtn = document.getElementById('endBtn');
  endBtn.disabled = false;
  
  // Start duration counter
  streamDuration = 0;
  streamInterval = setInterval(() => {
    streamDuration++;
    updateStreamDuration();
  }, 1000);
  
  // Start camera if not on
  if (!isCameraOn) {
    toggleCamera();
  }
  
  showToast('🎥 You are now LIVE!');
  
  // Simulate viewers joining
  analytics.viewers = Math.floor(Math.random() * 500) + 500;
  updateAnalyticsDisplay();
  
  // Start chat simulation
  startChatSimulation();
}

// Stop stream
function stopStream() {
  if (!confirm('Are you sure you want to end the stream?')) {
    return;
  }
  
  isStreaming = false;
  
  // Update UI
  const statusIndicator = document.querySelector('.status-indicator');
  statusIndicator.classList.remove('live');
  statusIndicator.classList.add('offline');
  statusIndicator.querySelector('.status-text').textContent = 'Offline';
  
  const startBtn = document.getElementById('startStreamBtn');
  startBtn.classList.remove('streaming');
  startBtn.innerHTML = '<i class="fas fa-circle"></i><span>Start Live Stream</span>';
  
  const endBtn = document.getElementById('endBtn');
  endBtn.disabled = true;
  
  // Stop duration counter
  if (streamInterval) {
    clearInterval(streamInterval);
  }
  
  showToast('Stream ended. Great job! 👏');
}

// End stream
function endStream() {
  stopStream();
}

// Update stream duration
function updateStreamDuration() {
  const hours = Math.floor(streamDuration / 3600);
  const minutes = Math.floor((streamDuration % 3600) / 60);
  const seconds = streamDuration % 60;
  
  const durationEl = document.getElementById('streamDuration');
  if (durationEl) {
    durationEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Toggle camera
function toggleCamera() {
  isCameraOn = !isCameraOn;
  const btn = document.getElementById('cameraBtn');
  const overlay = document.querySelector('.preview-overlay');
  
  if (isCameraOn) {
    btn.classList.add('active');
    overlay.classList.add('hidden');
    
    // Request camera access (demo - would use real WebRTC)
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.getElementById('previewVideo');
        video.srcObject = stream;
      })
      .catch(err => {
        console.log('Camera access denied:', err);
        showToast('Camera access denied. Using demo mode.');
      });
  } else {
    btn.classList.remove('active');
    overlay.classList.remove('hidden');
    
    // Stop camera
    const video = document.getElementById('previewVideo');
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  }
}

// Toggle mic
function toggleMic() {
  isMicOn = !isMicOn;
  const btn = document.getElementById('micBtn');
  
  if (isMicOn) {
    btn.classList.add('active');
    btn.querySelector('i').className = 'fas fa-microphone';
  } else {
    btn.classList.remove('active');
    btn.querySelector('i').className = 'fas fa-microphone-slash';
  }
}

// Toggle screen share
function toggleScreen() {
  isScreenSharing = !isScreenSharing;
  const btn = document.getElementById('screenBtn');
  
  if (isScreenSharing) {
    btn.classList.add('active');
    showToast('Screen sharing started');
  } else {
    btn.classList.remove('active');
    showToast('Screen sharing stopped');
  }
}

// Open settings
function openSettings() {
  showToast('Settings panel coming soon!');
}

// Switch tabs
function switchTab(tabName) {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Load products
async function loadProducts() {
  try {
    const cachedProducts = localStorage.getItem('cachedProducts');
    if (cachedProducts) {
      allProducts = JSON.parse(cachedProducts);
    } else {
      const response = await fetch('../simba_products.json');
      const data = await response.json();
      allProducts = Array.isArray(data) ? data : (data.products || []);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    allProducts = [];
  }
  
  renderProductsList();
}

// Render products list
function renderProductsList() {
  const list = document.getElementById('studioProductsList');
  if (!list) return;
  
  const productsToShow = allProducts.slice(0, 20);
  
  list.innerHTML = productsToShow.map(product => `
    <div class="studio-product-item" onclick="addToFeatured(${product.id})">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'">
      <div class="info">
        <h4>${product.name}</h4>
        <p>${product.category}</p>
      </div>
      <div class="price">${formatPrice(product.price)}</div>
    </div>
  `).join('');
}

// Search products
function searchProducts() {
  const input = document.getElementById('productSearch');
  const query = input.value.toLowerCase();
  
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  
  const list = document.getElementById('studioProductsList');
  if (!list) return;
  
  list.innerHTML = filtered.slice(0, 20).map(product => `
    <div class="studio-product-item" onclick="addToFeatured(${product.id})">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'">
      <div class="info">
        <h4>${product.name}</h4>
        <p>${product.category}</p>
      </div>
      <div class="price">${formatPrice(product.price)}</div>
    </div>
  `).join('');
}

// Add to featured
function addToFeatured(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  if (featuredProducts.find(p => p.id === productId)) {
    showToast('Product already featured');
    return;
  }
  
  featuredProducts.push(product);
  renderFeaturedProducts();
  showToast(`${product.name} added to featured products`);
}

// Render featured products
function renderFeaturedProducts() {
  const list = document.getElementById('featuredProductsList');
  if (!list) return;
  
  if (featuredProducts.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 1rem;">No featured products yet</p>';
    return;
  }
  
  list.innerHTML = featuredProducts.map(product => `
    <div class="featured-product-item">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'">
      <div class="info">
        <h4>${product.name}</h4>
        <p>${formatPrice(product.price)}</p>
      </div>
      <div class="actions">
        <button class="pin-btn" onclick="pinProduct(${product.id})" title="Show on stream">
          <i class="fas fa-thumbtack"></i>
        </button>
        <button class="remove-btn" onclick="removeFromFeatured(${product.id})" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Pin product (show on stream)
function pinProduct(productId) {
  const product = featuredProducts.find(p => p.id === productId);
  if (!product) return;
  
  showToast(`📌 ${product.name} is now showing on stream!`);
}

// Remove from featured
function removeFromFeatured(productId) {
  featuredProducts = featuredProducts.filter(p => p.id !== productId);
  renderFeaturedProducts();
  showToast('Product removed from featured');
}

// Open product picker modal
function openProductPicker() {
  const modal = document.getElementById('productPickerModal');
  modal.style.display = 'flex';
  
  const grid = document.getElementById('modalProductsGrid');
  grid.innerHTML = allProducts.slice(0, 50).map(product => `
    <div class="modal-product-card ${featuredProducts.find(p => p.id === product.id) ? 'selected' : ''}" onclick="toggleProductSelection(${product.id})">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
      <h4>${product.name}</h4>
      <p>${formatPrice(product.price)}</p>
    </div>
  `).join('');
}

// Close product picker
function closeProductPicker() {
  const modal = document.getElementById('productPickerModal');
  modal.style.display = 'none';
}

// Toggle product selection
function toggleProductSelection(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  
  const index = featuredProducts.findIndex(p => p.id === productId);
  
  if (index > -1) {
    featuredProducts.splice(index, 1);
  } else {
    featuredProducts.push(product);
  }
  
  renderFeaturedProducts();
  
  // Update modal card
  const card = event.target.closest('.modal-product-card');
  if (card) {
    card.classList.toggle('selected');
  }
}

// Filter modal products
function filterModalProducts() {
  const input = document.getElementById('modalProductSearch');
  const query = input.value.toLowerCase();
  
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  
  const grid = document.getElementById('modalProductsGrid');
  grid.innerHTML = filtered.slice(0, 50).map(product => `
    <div class="modal-product-card ${featuredProducts.find(p => p.id === product.id) ? 'selected' : ''}" onclick="toggleProductSelection(${product.id})">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
      <h4>${product.name}</h4>
      <p>${formatPrice(product.price)}</p>
    </div>
  `).join('');
}

// Update analytics
function updateAnalytics() {
  if (!isStreaming) return;
  
  analytics.viewers += Math.floor(Math.random() * 20) - 8;
  analytics.viewers = Math.max(100, analytics.viewers);
  
  if (Math.random() > 0.7) {
    analytics.orders++;
    analytics.revenue += Math.floor(Math.random() * 50000) + 5000;
  }
  
  if (Math.random() > 0.5) {
    analytics.reactions += Math.floor(Math.random() * 10) + 1;
  }
  
  updateAnalyticsDisplay();
}

// Update analytics display
function updateAnalyticsDisplay() {
  const viewersEl = document.getElementById('studioViewers');
  if (viewersEl) viewersEl.textContent = analytics.viewers;
  
  const totalViewersEl = document.getElementById('totalViewers');
  if (totalViewersEl) totalViewersEl.textContent = analytics.viewers.toLocaleString();
  
  const ordersEl = document.getElementById('totalOrders');
  if (ordersEl) ordersEl.textContent = analytics.orders;
  
  const revenueEl = document.getElementById('totalRevenue');
  if (revenueEl) revenueEl.textContent = analytics.revenue.toLocaleString() + ' RWF';
  
  const reactionsEl = document.getElementById('totalReactions');
  if (reactionsEl) reactionsEl.textContent = analytics.reactions.toLocaleString();
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
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

// ========== CHAT SIMULATION ==========
let chatInterval = null;

const chatMessages = [
  { user: 'Sarah K.', text: 'This looks amazing!', emoji: '😍' },
  { user: 'Patrick N.', text: 'Do you have more colors?', emoji: '🎨' },
  { user: 'David K.', text: 'Can I pay with MoMo?', emoji: '💳' },
  { user: 'Emma W.', text: 'Great deals today!', emoji: '🔥' },
  { user: 'Peter K.', text: 'How much discount?', emoji: '💰' },
  { user: 'Grace M.', text: 'Just ordered 3 items!', emoji: '🛒' },
  { user: 'John D.', text: 'When is the next live?', emoji: '⏰' },
  { user: 'Alice R.', text: 'Added to cart!', emoji: '✅' },
  { user: 'Frank L.', text: 'Delivery to Huye available?', emoji: '🚚' },
  { user: 'Marie T.', text: 'Love this product!', emoji: '❤️' },
  { user: 'Bob M.', text: 'What\'s the price?', emoji: '👀' },
  { user: 'Sophie D.', text: 'Shipping cost?', emoji: '📦' },
  { user: 'Claire B.', text: 'I want to buy now!', emoji: '👍' },
  { user: 'James K.', text: 'Quality looks good', emoji: '⭐' },
  { user: 'Linda M.', text: 'Can you show more?', emoji: '👁️' }
];

function startChatSimulation() {
  const chatContainer = document.getElementById('studioChatMessages');
  if (!chatContainer) return;
  
  // Clear empty state
  chatContainer.innerHTML = '';
  
  // Add initial message
  addStudioChatMessage('System', 'Stream started! Viewers are joining...', '📹', true);
  
  // Simulate chat messages
  chatInterval = setInterval(() => {
    if (!isStreaming) {
      clearInterval(chatInterval);
      return;
    }
    
    if (Math.random() > 0.3) { // 70% chance to add message
      const randomMsg = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      addStudioChatMessage(randomMsg.user, randomMsg.text, randomMsg.emoji);
    }
  }, 4000); // New message every 4 seconds
}

function addStudioChatMessage(user, text, emoji = '', isSystem = false) {
  const chatContainer = document.getElementById('studioChatMessages');
  if (!chatContainer) return;
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message';
  messageDiv.style.cssText = `
    padding: 0.75rem;
    background: var(--bg);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    border-left: 3px solid ${isSystem ? 'var(--accent)' : 'var(--primary)'};
  `;
  
  messageDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
      <span style="font-weight: 600; color: ${isSystem ? 'var(--accent)' : 'var(--text)'}; font-size: 0.9rem;">
        ${emoji} ${user}
      </span>
      <span style="font-size: 0.75rem; color: var(--text-light);">${timeStr}</span>
    </div>
    <div style="color: var(--text-body); font-size: 0.9rem;">${text}</div>
  `;
  
  chatContainer.appendChild(messageDiv);
  
  // Auto-scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Keep only last 50 messages
  const messages = chatContainer.querySelectorAll('.chat-message');
  if (messages.length > 50) {
    messages[0].remove();
  }
}
