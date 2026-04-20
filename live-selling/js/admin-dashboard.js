// Admin Dashboard JavaScript

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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
  
  // Setup menu navigation
  setupMenuNavigation();
  
  // Setup settings tabs
  setupSettingsTabs();
  
  // Load dashboard data
  loadDashboardData();
  
  // Load settings
  loadSettings();
});

// Setup menu navigation
function setupMenuNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      switchSection(section);
    });
  });
}

// Switch section
function switchSection(sectionName) {
  // Update menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
  
  // Update sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(`${sectionName}Section`).classList.add('active');
  
  // Load section data
  loadSectionData(sectionName);
}

// Load section data
function loadSectionData(section) {
  switch(section) {
    case 'overview':
      loadOverviewData();
      break;
    case 'sessions':
      loadSessionsData();
      break;
    case 'ads':
      loadAdsData();
      break;
    case 'hosts':
      loadHostsData();
      break;
    case 'analytics':
      loadAnalyticsData();
      break;
    case 'archive':
      loadArchivesData();
      break;
  }
}

// Load dashboard data
function loadDashboardData() {
  loadOverviewData();
}

// Load overview data
function loadOverviewData() {
  // Get data from localStorage
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  const activeAds = adRequests.filter(ad => ad.status === 'active');
  const adRevenue = activeAds.reduce((sum, ad) => sum + ad.price, 0);
  
  // Update stats
  document.getElementById('totalSessions').textContent = '2';
  document.getElementById('totalViewers').textContent = '2,139';
  document.getElementById('activeAds').textContent = activeAds.length;
  document.getElementById('adRevenue').textContent = formatPrice(adRevenue);
  
  // Load recent activity
  loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
  const activityList = document.getElementById('activityList');
  
  const activities = [
    {
      icon: 'fa-video',
      text: 'New live session started',
      time: '5 minutes ago',
      color: '#667eea'
    },
    {
      icon: 'fa-ad',
      text: 'Ad request approved: MTN Rwanda',
      time: '1 hour ago',
      color: '#4facfe'
    },
    {
      icon: 'fa-users',
      text: 'Peak viewers: 1,247',
      time: '2 hours ago',
      color: '#f093fb'
    },
    {
      icon: 'fa-dollar-sign',
      text: 'Revenue milestone: 100K RWF',
      time: '3 hours ago',
      color: '#43e97b'
    }
  ];
  
  activityList.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon" style="background: ${activity.color};">
        <i class="fas ${activity.icon}"></i>
      </div>
      <div class="activity-info">
        <p>${activity.text}</p>
        <span>${activity.time}</span>
      </div>
    </div>
  `).join('');
}

// Load sessions data
function loadSessionsData() {
  const tbody = document.getElementById('sessionsTableBody');
  
  const sessions = [
    {
      id: 1,
      title: 'Fresh Fruits & Vegetables',
      host: 'Sarah Uwase',
      status: 'live',
      viewers: 1247,
      date: 'Today, 10:00 AM'
    },
    {
      id: 2,
      title: 'Amazing Deals',
      host: 'Jean Claude',
      status: 'live',
      viewers: 892,
      date: 'Today, 11:30 AM'
    }
  ];
  
  tbody.innerHTML = sessions.map(session => `
    <tr>
      <td>#${session.id}</td>
      <td>${session.title}</td>
      <td>${session.host}</td>
      <td><span class="status-badge ${session.status}">${session.status}</span></td>
      <td>${session.viewers.toLocaleString()}</td>
      <td>${session.date}</td>
      <td>
        <button class="btn-sm btn-outline" onclick="editSession(${session.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-sm btn-danger" onclick="endSession(${session.id})">
          <i class="fas fa-stop"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Load ads data
function loadAdsData() {
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  const adImpressions = JSON.parse(localStorage.getItem('adImpressions') || '{}');
  
  // Update stats
  const activeAds = adRequests.filter(ad => ad.status === 'active');
  const pendingAds = adRequests.filter(ad => ad.status === 'pending');
  const totalRevenue = activeAds.reduce((sum, ad) => sum + ad.price, 0);
  const totalImpressions = Object.values(adImpressions).reduce((sum, imp) => sum + imp.count, 0);
  
  document.getElementById('adsActive').textContent = activeAds.length;
  document.getElementById('adsPending').textContent = pendingAds.length;
  document.getElementById('adsRevenue').textContent = formatPrice(totalRevenue);
  document.getElementById('adsImpressions').textContent = totalImpressions.toLocaleString();
  
  // Load ads table
  const tbody = document.getElementById('adsTableBody');
  
  tbody.innerHTML = adRequests.map(ad => {
    const impressions = adImpressions[ad.id] || { count: 0 };
    return `
      <tr>
        <td>${ad.company}</td>
        <td>${ad.adTitle}</td>
        <td>${ad.duration}s</td>
        <td>${formatPrice(ad.price)}</td>
        <td><span class="status-badge ${ad.status}">${ad.status}</span></td>
        <td>${impressions.count.toLocaleString()}</td>
        <td>
          ${ad.status === 'pending' ? `
            <button class="btn-sm btn-primary" onclick="approveAdFromDashboard(${ad.id})">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn-sm btn-danger" onclick="rejectAdFromDashboard(${ad.id})">
              <i class="fas fa-times"></i>
            </button>
          ` : `
            <button class="btn-sm btn-outline" onclick="viewAdDetails(${ad.id})">
              <i class="fas fa-eye"></i>
            </button>
            ${ad.status === 'active' ? `
              <button class="btn-sm btn-danger" onclick="pauseAdFromDashboard(${ad.id})">
                <i class="fas fa-pause"></i>
              </button>
            ` : ''}
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// Load hosts data
function loadHostsData() {
  const hostsGrid = document.getElementById('hostsGrid');
  
  const hosts = [
    {
      name: 'Sarah Uwase',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Uwase&background=30364F&color=fff&size=128',
      followers: '15.2K',
      sessions: 45,
      revenue: '2.3M RWF'
    },
    {
      name: 'Jean Claude',
      avatar: 'https://ui-avatars.com/api/?name=Jean+Claude&background=E1D9BC&color=30364F&size=128',
      followers: '12.8K',
      sessions: 38,
      revenue: '1.9M RWF'
    },
    {
      name: 'Grace Mutesi',
      avatar: 'https://ui-avatars.com/api/?name=Grace+Mutesi&background=ACBAC4&color=30364F&size=128',
      followers: '10.5K',
      sessions: 32,
      revenue: '1.5M RWF'
    },
    {
      name: 'Patrick Nkusi',
      avatar: 'https://ui-avatars.com/api/?name=Patrick+Nkusi&background=30364F&color=fff&size=128',
      followers: '9.2K',
      sessions: 28,
      revenue: '1.2M RWF'
    }
  ];
  
  hostsGrid.innerHTML = hosts.map(host => `
    <div class="host-card">
      <img src="${host.avatar}" alt="${host.name}" class="host-avatar">
      <h3>${host.name}</h3>
      <div class="host-stats">
        <span><i class="fas fa-users"></i> ${host.followers}</span>
        <span><i class="fas fa-video"></i> ${host.sessions}</span>
      </div>
      <p style="color: var(--accent); font-weight: 700; margin: 0.5rem 0;">${host.revenue}</p>
      <button class="btn-outline full-width">
        <i class="fas fa-edit"></i> Manage
      </button>
    </div>
  `).join('');
}

// Load analytics data
function loadAnalyticsData() {
  // Placeholder for charts
  const sections = ['sessionPerformance', 'adPerformance', 'viewerEngagement', 'revenueBreakdown'];
  
  sections.forEach(section => {
    const el = document.getElementById(section);
    el.innerHTML = `
      <div style="text-align: center; color: var(--text-light);">
        <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>Analytics data will be displayed here</p>
        <p style="font-size: 0.85rem;">Connect analytics service to view detailed reports</p>
      </div>
    `;
  });
}

// Load archives data
function loadArchivesData() {
  const archivesGrid = document.getElementById('archivesGrid');
  
  const archives = [
    {
      id: 1,
      title: 'Fresh Fruits & Vegetables',
      host: 'Sarah Uwase',
      views: 3421,
      duration: '1h 23m',
      date: 'Yesterday',
      thumbnail: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Amazing Deals',
      host: 'Jean Claude',
      views: 2156,
      duration: '58m',
      date: '2 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop'
    }
  ];
  
  archivesGrid.innerHTML = archives.map(archive => `
    <div class="archive-card" onclick="viewArchive(${archive.id})">
      <img src="${archive.thumbnail}" alt="${archive.title}" class="archive-thumbnail">
      <div class="archive-info">
        <h4>${archive.title}</h4>
        <p style="color: var(--text-light); font-size: 0.9rem; margin: 0.5rem 0;">
          ${archive.host}
        </p>
        <div class="archive-meta">
          <span><i class="fas fa-eye"></i> ${archive.views.toLocaleString()}</span>
          <span><i class="fas fa-clock"></i> ${archive.duration}</span>
        </div>
        <p style="color: var(--text-light); font-size: 0.85rem; margin: 0.5rem 0 0 0;">
          ${archive.date}
        </p>
      </div>
    </div>
  `).join('');
}

// Setup settings tabs
function setupSettingsTabs() {
  const tabs = document.querySelectorAll('.settings-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      
      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update content
      document.querySelectorAll('.settings-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tabName}Settings`).classList.add('active');
    });
  });
}

// Load settings
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
  
  // Apply saved settings
  if (settings.platformName) document.getElementById('platformName').value = settings.platformName;
  if (settings.defaultLanguage) document.getElementById('defaultLanguage').value = settings.defaultLanguage;
  if (settings.maxViewers) document.getElementById('maxViewers').value = settings.maxViewers;
  if (settings.sessionDuration) document.getElementById('sessionDuration').value = settings.sessionDuration;
  if (settings.videoQuality) document.getElementById('videoQuality').value = settings.videoQuality;
  if (settings.adInterval) document.getElementById('adInterval').value = settings.adInterval;
  if (settings.maxAdDuration) document.getElementById('maxAdDuration').value = settings.maxAdDuration;
  if (settings.minAdPrice) document.getElementById('minAdPrice').value = settings.minAdPrice;
  if (settings.notificationEmail) document.getElementById('notificationEmail').value = settings.notificationEmail;
  
  // Checkboxes
  document.getElementById('enableComments').checked = settings.enableComments !== false;
  document.getElementById('enableReactions').checked = settings.enableReactions !== false;
  document.getElementById('autoArchive').checked = settings.autoArchive !== false;
  document.getElementById('enableSubtitles').checked = settings.enableSubtitles !== false;
  document.getElementById('autoApproveAds').checked = settings.autoApproveAds === true;
  document.getElementById('showAdBadge').checked = settings.showAdBadge !== false;
  document.getElementById('notifyNewSession').checked = settings.notifyNewSession !== false;
  document.getElementById('notifyAdRequest').checked = settings.notifyAdRequest !== false;
  document.getElementById('notifyHighViewers').checked = settings.notifyHighViewers !== false;
  document.getElementById('notifyRevenue').checked = settings.notifyRevenue !== false;
}

// Save settings
function saveSettings() {
  const settings = {
    platformName: document.getElementById('platformName').value,
    defaultLanguage: document.getElementById('defaultLanguage').value,
    maxViewers: parseInt(document.getElementById('maxViewers').value),
    sessionDuration: parseInt(document.getElementById('sessionDuration').value),
    videoQuality: document.getElementById('videoQuality').value,
    adInterval: parseInt(document.getElementById('adInterval').value),
    maxAdDuration: parseInt(document.getElementById('maxAdDuration').value),
    minAdPrice: parseInt(document.getElementById('minAdPrice').value),
    notificationEmail: document.getElementById('notificationEmail').value,
    enableComments: document.getElementById('enableComments').checked,
    enableReactions: document.getElementById('enableReactions').checked,
    autoArchive: document.getElementById('autoArchive').checked,
    enableSubtitles: document.getElementById('enableSubtitles').checked,
    autoApproveAds: document.getElementById('autoApproveAds').checked,
    showAdBadge: document.getElementById('showAdBadge').checked,
    notifyNewSession: document.getElementById('notifyNewSession').checked,
    notifyAdRequest: document.getElementById('notifyAdRequest').checked,
    notifyHighViewers: document.getElementById('notifyHighViewers').checked,
    notifyRevenue: document.getElementById('notifyRevenue').checked
  };
  
  localStorage.setItem('adminSettings', JSON.stringify(settings));
  showToast('✅ Settings saved successfully!');
}

// Action functions
function refreshDashboard() {
  loadDashboardData();
  showToast('Dashboard refreshed');
}

function createNewSession() {
  window.location.href = 'studio.html';
}

function exportData() {
  const data = {
    adRequests: JSON.parse(localStorage.getItem('adRequests') || '[]'),
    adImpressions: JSON.parse(localStorage.getItem('adImpressions') || '{}'),
    settings: JSON.parse(localStorage.getItem('adminSettings') || '{}')
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `simba-live-data-${Date.now()}.json`;
  a.click();
  
  showToast('Data exported successfully');
}

function exportAnalytics() {
  showToast('Analytics export started...');
}

function filterAds() {
  loadAdsData();
}

function approveAdFromDashboard(adId) {
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  const ad = adRequests.find(a => a.id === adId);
  if (ad) {
    ad.status = 'active';
    ad.approvedDate = new Date();
    localStorage.setItem('adRequests', JSON.stringify(adRequests));
    loadAdsData();
    showToast(`✅ Ad "${ad.adTitle}" approved!`);
  }
}

function rejectAdFromDashboard(adId) {
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  const ad = adRequests.find(a => a.id === adId);
  if (ad) {
    ad.status = 'rejected';
    ad.rejectedDate = new Date();
    localStorage.setItem('adRequests', JSON.stringify(adRequests));
    loadAdsData();
    showToast(`❌ Ad "${ad.adTitle}" rejected`);
  }
}

function pauseAdFromDashboard(adId) {
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  const ad = adRequests.find(a => a.id === adId);
  if (ad) {
    ad.status = 'paused';
    localStorage.setItem('adRequests', JSON.stringify(adRequests));
    loadAdsData();
    showToast(`⏸️ Ad "${ad.adTitle}" paused`);
  }
}

function viewAdDetails(adId) {
  showToast('Opening ad details...');
}

function editSession(sessionId) {
  showToast('Opening session editor...');
}

function endSession(sessionId) {
  if (confirm('Are you sure you want to end this session?')) {
    showToast('Session ended');
  }
}

function addNewHost() {
  showToast('Opening host registration form...');
}

function viewArchive(archiveId) {
  window.location.href = `archive.html?id=${archiveId}`;
}

function clearArchives() {
  if (confirm('Clear archives older than 30 days?')) {
    showToast('Old archives cleared');
  }
}

// Utility functions
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Make functions global
window.switchSection = switchSection;
window.refreshDashboard = refreshDashboard;
window.createNewSession = createNewSession;
window.exportData = exportData;
window.exportAnalytics = exportAnalytics;
window.filterAds = filterAds;
window.approveAdFromDashboard = approveAdFromDashboard;
window.rejectAdFromDashboard = rejectAdFromDashboard;
window.pauseAdFromDashboard = pauseAdFromDashboard;
window.viewAdDetails = viewAdDetails;
window.editSession = editSession;
window.endSession = endSession;
window.addNewHost = addNewHost;
window.viewArchive = viewArchive;
window.clearArchives = clearArchives;
window.saveSettings = saveSettings;
