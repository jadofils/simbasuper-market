// Authentication System for Live Selling
// Integrates with main app login system

// Check if user is authenticated
function isAuthenticated() {
  // Check sessionStorage (main app)
  const sessionUser = sessionStorage.getItem('currentUser');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  return sessionUser && isLoggedIn === 'true';
}

// Get current user info
function getCurrentUser() {
  const sessionUser = sessionStorage.getItem('currentUser');
  if (!sessionUser) return null;
  
  try {
    return JSON.parse(sessionUser);
  } catch (e) {
    return null;
  }
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Check if user is logged in for interactive actions
function requireLoginForAction(actionName) {
  if (!isAuthenticated()) {
    const currentPage = window.location.pathname;
    showToast(`Please login to ${actionName}`);
    
    // Redirect to main login page
    setTimeout(() => {
      window.location.href = `../login.html?return=${encodeURIComponent(currentPage)}`;
    }, 1500);
    
    return false;
  }
  return true;
}

// Logout handler
function logout() {
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  showToast('Logged out successfully');
  setTimeout(() => {
    window.location.href = '../login.html';
  }, 1000);
}

// Protect admin pages
function requireAuth() {
  if (!isAuthenticated()) {
    const currentPage = window.location.pathname;
    window.location.href = `../login.html?return=${encodeURIComponent(currentPage)}`;
    return;
  }
  
  // Check if page requires admin role
  const adminPages = ['admin-dashboard.html', 'studio.html'];
  const currentPageName = window.location.pathname.split('/').pop();
  
  if (adminPages.includes(currentPageName) && !isAdmin()) {
    showToast('Access denied. Admin only.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

// Show toast message
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}
