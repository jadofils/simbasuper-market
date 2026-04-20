// Advertisement Management JavaScript

let adSlots = [];
let adRequests = [];
let currentAdId = null;

// Initialize ad management
document.addEventListener('DOMContentLoaded', () => {
  loadAdData();
  renderAds();
  
  // Load sample ad requests
  if (adRequests.length === 0) {
    loadSampleAdRequests();
  }
});

// Load ad data from localStorage
function loadAdData() {
  const savedSlots = localStorage.getItem('adSlots');
  const savedRequests = localStorage.getItem('adRequests');
  
  if (savedSlots) {
    adSlots = JSON.parse(savedSlots);
  }
  
  if (savedRequests) {
    adRequests = JSON.parse(savedRequests);
  }
}

// Save ad data to localStorage
function saveAdData() {
  localStorage.setItem('adSlots', JSON.stringify(adSlots));
  localStorage.setItem('adRequests', JSON.stringify(adRequests));
}

// Load sample ad requests
function loadSampleAdRequests() {
  adRequests = [
    {
      id: 1,
      company: 'MTN Rwanda',
      contactPerson: 'John Doe',
      email: 'john@mtn.rw',
      phone: '+250788123456',
      adTitle: 'MTN Mobile Money - Send & Receive',
      description: 'Promote MTN Mobile Money services with special cashback offer',
      duration: 20,
      price: 50000,
      position: 'middle',
      status: 'pending',
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      budget: 200000,
      targetAudience: 'All viewers',
      adContent: 'Get 5% cashback on all MoMo transactions this week!'
    },
    {
      id: 2,
      company: 'Airtel Rwanda',
      contactPerson: 'Jane Smith',
      email: 'jane@airtel.rw',
      phone: '+250788654321',
      adTitle: 'Airtel Money - Fast & Secure',
      description: 'Showcase Airtel Money payment solutions',
      duration: 15,
      price: 35000,
      position: 'top',
      status: 'pending',
      submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      budget: 150000,
      targetAudience: 'Mobile users',
      adContent: 'Transfer money instantly with Airtel Money. Zero fees!'
    },
    {
      id: 3,
      company: 'Bank of Kigali',
      contactPerson: 'Peter Mugisha',
      email: 'peter@bk.rw',
      phone: '+250788999888',
      adTitle: 'BK Mobile Banking',
      description: 'Promote BK mobile banking app and services',
      duration: 25,
      price: 75000,
      position: 'sidebar',
      status: 'active',
      submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      approvedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      budget: 300000,
      targetAudience: 'Banking customers',
      adContent: 'Open your BK account in 5 minutes. Download the app now!'
    }
  ];
  
  saveAdData();
  renderAds();
}

// Render ads
function renderAds() {
  renderActiveAds();
  renderPendingAds();
  updateAdRevenue();
}

// Render active ads
function renderActiveAds() {
  const container = document.getElementById('activeAdsList');
  const countEl = document.getElementById('activeAdsCount');
  
  if (!container) return;
  
  const activeAds = adRequests.filter(ad => ad.status === 'active');
  const pausedAds = adRequests.filter(ad => ad.status === 'paused');
  const allAds = [...activeAds, ...pausedAds];
  
  if (countEl) {
    countEl.textContent = activeAds.length;
  }
  
  if (allAds.length === 0) {
    container.innerHTML = `
      <div class="ads-empty">
        <i class="fas fa-ad"></i>
        <p>No active ads. Approve pending requests to activate.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = allAds.map(ad => `
    <div class="ad-item">
      <div class="ad-item-header">
        <div>
          <div class="ad-item-title">${ad.adTitle}</div>
          <div class="ad-item-company">
            <i class="fas fa-building"></i>
            ${ad.company}
          </div>
        </div>
        <span class="ad-status-badge ${ad.status}">${capitalizeFirst(ad.status)}</span>
      </div>
      
      <div class="ad-item-details">
        <div class="ad-detail">
          <span class="ad-detail-label">Duration</span>
          <span class="ad-detail-value">${ad.duration}s</span>
        </div>
        <div class="ad-detail">
          <span class="ad-detail-label">Price</span>
          <span class="ad-detail-value">${formatPrice(ad.price)}</span>
        </div>
        <div class="ad-detail">
          <span class="ad-detail-label">Position</span>
          <span class="ad-detail-value">${capitalizeFirst(ad.position)}</span>
        </div>
      </div>
      
      <div class="ad-item-actions">
        <button class="ad-action-btn view" onclick="viewAdDetails(${ad.id})">
          <i class="fas fa-eye"></i> View
        </button>
        <button class="ad-action-btn approve" onclick="editAd(${ad.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        ${ad.status === 'active' ? `
          <button class="ad-action-btn pause" onclick="pauseAd(${ad.id})">
            <i class="fas fa-pause"></i> Pause
          </button>
        ` : `
          <button class="ad-action-btn approve" onclick="unpauseAd(${ad.id})">
            <i class="fas fa-play"></i> Resume
          </button>
        `}
      </div>
    </div>
  `).join('');
}

// Render pending ads
function renderPendingAds() {
  const container = document.getElementById('pendingAdsList');
  const countEl = document.getElementById('pendingAdsCount');
  
  if (!container) return;
  
  const pendingAds = adRequests.filter(ad => ad.status === 'pending');
  
  if (countEl) {
    countEl.textContent = pendingAds.length;
  }
  
  if (pendingAds.length === 0) {
    container.innerHTML = `
      <div class="ads-empty">
        <i class="fas fa-clock"></i>
        <p>No pending requests. All caught up!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = pendingAds.map(ad => `
    <div class="ad-item">
      <div class="ad-item-header">
        <div>
          <div class="ad-item-title">${ad.adTitle}</div>
          <div class="ad-item-company">
            <i class="fas fa-building"></i>
            ${ad.company}
          </div>
        </div>
        <span class="ad-status-badge pending">Pending</span>
      </div>
      
      <div class="ad-item-details">
        <div class="ad-detail">
          <span class="ad-detail-label">Duration</span>
          <span class="ad-detail-value">${ad.duration}s</span>
        </div>
        <div class="ad-detail">
          <span class="ad-detail-label">Price</span>
          <span class="ad-detail-value">${formatPrice(ad.price)}</span>
        </div>
        <div class="ad-detail">
          <span class="ad-detail-label">Submitted</span>
          <span class="ad-detail-value">${formatDate(ad.submittedDate)}</span>
        </div>
      </div>
      
      <div class="ad-item-actions">
        <button class="ad-action-btn view" onclick="viewAdDetails(${ad.id})">
          <i class="fas fa-eye"></i> Review
        </button>
        <button class="ad-action-btn approve" onclick="quickApproveAd(${ad.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="ad-action-btn reject" onclick="quickRejectAd(${ad.id})">
          <i class="fas fa-times"></i> Reject
        </button>
      </div>
    </div>
  `).join('');
}

// Update ad revenue
function updateAdRevenue() {
  const revenueEl = document.getElementById('adRevenue');
  if (!revenueEl) return;
  
  const totalRevenue = adRequests
    .filter(ad => ad.status === 'active')
    .reduce((sum, ad) => sum + ad.price, 0);
  
  revenueEl.textContent = formatPrice(totalRevenue);
}

// Open ad request modal
function openAdRequestModal() {
  const modal = document.getElementById('adRequestModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Close ad request modal
function closeAdRequestModal() {
  const modal = document.getElementById('adRequestModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Create ad slot
function createAdSlot() {
  const name = document.getElementById('adSlotName').value.trim();
  const duration = parseInt(document.getElementById('adDuration').value);
  const price = parseInt(document.getElementById('adPrice').value);
  const position = document.getElementById('adPosition').value;
  const description = document.getElementById('adDescription').value.trim();
  
  if (!name) {
    showToast('Please enter ad slot name');
    return;
  }
  
  if (!duration || duration < 5 || duration > 60) {
    showToast('Duration must be between 5 and 60 seconds');
    return;
  }
  
  if (!price || price < 1000) {
    showToast('Price must be at least 1,000 RWF');
    return;
  }
  
  const adSlot = {
    id: Date.now(),
    name,
    duration,
    price,
    position,
    description,
    status: 'available',
    createdDate: new Date()
  };
  
  adSlots.push(adSlot);
  saveAdData();
  
  showToast('✅ Ad slot created successfully!');
  closeAdRequestModal();
  
  // Clear form
  document.getElementById('adSlotName').value = '';
  document.getElementById('adDuration').value = '15';
  document.getElementById('adPrice').value = '10000';
  document.getElementById('adDescription').value = '';
}

// View ad details
function viewAdDetails(adId) {
  currentAdId = adId;
  const ad = adRequests.find(a => a.id === adId);
  if (!ad) return;
  
  const modal = document.getElementById('adDetailsModal');
  const content = document.getElementById('adDetailsContent');
  
  if (!modal || !content) return;
  
  content.innerHTML = `
    <div class="ad-details-grid">
      <div class="ad-detail-item">
        <label>Company</label>
        <div class="value">${ad.company}</div>
      </div>
      <div class="ad-detail-item">
        <label>Contact Person</label>
        <div class="value">${ad.contactPerson}</div>
      </div>
      <div class="ad-detail-item">
        <label>Email</label>
        <div class="value">${ad.email}</div>
      </div>
      <div class="ad-detail-item">
        <label>Phone</label>
        <div class="value">${ad.phone}</div>
      </div>
      <div class="ad-detail-item">
        <label>Duration</label>
        <div class="value">${ad.duration} seconds</div>
      </div>
      <div class="ad-detail-item">
        <label>Price</label>
        <div class="value">${formatPrice(ad.price)}</div>
      </div>
      <div class="ad-detail-item">
        <label>Position</label>
        <div class="value">${capitalizeFirst(ad.position)}</div>
      </div>
      <div class="ad-detail-item">
        <label>Budget</label>
        <div class="value">${formatPrice(ad.budget)}</div>
      </div>
    </div>
    
    <div class="ad-preview">
      <h4>Ad Preview</h4>
      <div class="ad-preview-content">
        <h3>${ad.adTitle}</h3>
        <p>${ad.adContent}</p>
      </div>
    </div>
    
    <div class="ad-detail-item" style="grid-column: 1 / -1;">
      <label>Description</label>
      <div class="value">${ad.description}</div>
    </div>
    
    <div class="ad-detail-item" style="grid-column: 1 / -1;">
      <label>Target Audience</label>
      <div class="value">${ad.targetAudience}</div>
    </div>
  `;
  
  modal.style.display = 'flex';
}

// Close ad details modal
function closeAdDetailsModal() {
  const modal = document.getElementById('adDetailsModal');
  if (modal) {
    modal.style.display = 'none';
  }
  currentAdId = null;
}

// Approve ad
function approveAd() {
  if (!currentAdId) return;
  
  const ad = adRequests.find(a => a.id === currentAdId);
  if (!ad) return;
  
  ad.status = 'active';
  ad.approvedDate = new Date();
  
  saveAdData();
  renderAds();
  closeAdDetailsModal();
  
  showToast(`✅ Ad "${ad.adTitle}" approved!`);
}

// Quick approve ad
function quickApproveAd(adId) {
  const ad = adRequests.find(a => a.id === adId);
  if (!ad) return;
  
  ad.status = 'active';
  ad.approvedDate = new Date();
  
  saveAdData();
  renderAds();
  
  showToast(`✅ Ad "${ad.adTitle}" approved!`);
}

// Reject ad
function rejectAd() {
  if (!currentAdId) return;
  
  const ad = adRequests.find(a => a.id === currentAdId);
  if (!ad) return;
  
  ad.status = 'rejected';
  ad.rejectedDate = new Date();
  
  saveAdData();
  renderAds();
  closeAdDetailsModal();
  
  showToast(`❌ Ad "${ad.adTitle}" rejected`);
}

// Quick reject ad
function quickRejectAd(adId) {
  const ad = adRequests.find(a => a.id === adId);
  if (!ad) return;
  
  if (!confirm(`Reject ad "${ad.adTitle}"?`)) return;
  
  ad.status = 'rejected';
  ad.rejectedDate = new Date();
  
  saveAdData();
  renderAds();
  
  showToast(`❌ Ad "${ad.adTitle}" rejected`);
}

// Pause ad
function pauseAd(adId) {
  const ad = adRequests.find(a => a.id === adId);
  if (!ad) return;
  
  ad.status = 'paused';
  ad.pausedDate = new Date();
  
  saveAdData();
  renderAds();
  
  showToast(`⏸️ Ad "${ad.adTitle}" paused`);
}

// Unpause ad
function unpauseAd(adId) {
  const ad = adRequests.find(a => a.id === adId);
  if (!ad) return;
  
  ad.status = 'active';
  ad.unpausedDate = new Date();
  
  saveAdData();
  renderAds();
  
  showToast(`▶️ Ad "${ad.adTitle}" resumed`);
}

// Edit ad
function editAd(adId) {
  const ad = adRequests.find(a => a.id === adId);
  if (!ad) return;
  
  currentAdId = adId;
  
  // Open edit modal
  const modal = document.getElementById('editAdModal');
  if (!modal) return;
  
  // Populate form
  document.getElementById('editAdTitle').value = ad.adTitle;
  document.getElementById('editAdContent').value = ad.adContent;
  document.getElementById('editDuration').value = ad.duration;
  document.getElementById('editPrice').value = ad.price;
  document.getElementById('editPosition').value = ad.position;
  document.getElementById('editDescription').value = ad.description;
  
  modal.style.display = 'flex';
}

// Close edit modal
function closeEditAdModal() {
  const modal = document.getElementById('editAdModal');
  if (modal) {
    modal.style.display = 'none';
  }
  currentAdId = null;
}

// Save edited ad
function saveEditedAd() {
  if (!currentAdId) return;
  
  const ad = adRequests.find(a => a.id === currentAdId);
  if (!ad) return;
  
  // Get values
  const adTitle = document.getElementById('editAdTitle').value.trim();
  const adContent = document.getElementById('editAdContent').value.trim();
  const duration = parseInt(document.getElementById('editDuration').value);
  const price = parseInt(document.getElementById('editPrice').value);
  const position = document.getElementById('editPosition').value;
  const description = document.getElementById('editDescription').value.trim();
  
  // Validate
  if (!adTitle || !adContent) {
    showToast('Please fill in all required fields');
    return;
  }
  
  if (duration < 5 || duration > 60) {
    showToast('Duration must be between 5 and 60 seconds');
    return;
  }
  
  if (price < 1000) {
    showToast('Price must be at least 1,000 RWF');
    return;
  }
  
  // Update ad
  ad.adTitle = adTitle;
  ad.adContent = adContent;
  ad.duration = duration;
  ad.price = price;
  ad.position = position;
  ad.description = description;
  ad.lastEditedDate = new Date();
  
  saveAdData();
  renderAds();
  closeEditAdModal();
  
  showToast(`✅ Ad "${ad.adTitle}" updated successfully!`);
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
}

// Format date
function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Make functions global
window.openAdRequestModal = openAdRequestModal;
window.closeAdRequestModal = closeAdRequestModal;
window.createAdSlot = createAdSlot;
window.viewAdDetails = viewAdDetails;
window.closeAdDetailsModal = closeAdDetailsModal;
window.approveAd = approveAd;
window.quickApproveAd = quickApproveAd;
window.rejectAd = rejectAd;
window.quickRejectAd = quickRejectAd;
window.pauseAd = pauseAd;
window.unpauseAd = unpauseAd;
window.editAd = editAd;
window.closeEditAdModal = closeEditAdModal;
window.saveEditedAd = saveEditedAd;
