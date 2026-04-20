// Advertisement Request JavaScript

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
  
  // Update cart badge
  updateCartBadge();
});

// Select package
function selectPackage(packageType) {
  const packageSelect = document.getElementById('package');
  const budgetInput = document.getElementById('budget');
  
  if (packageSelect) {
    packageSelect.value = packageType;
    updatePackageDetails();
  }
  
  // Scroll to form
  const formSection = document.getElementById('requestFormSection');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Update package details
function updatePackageDetails() {
  const packageSelect = document.getElementById('package');
  const budgetInput = document.getElementById('budget');
  
  if (!packageSelect || !budgetInput) return;
  
  const packagePrices = {
    'basic': 10000,
    'standard': 35000,
    'premium': 75000,
    'custom': 0
  };
  
  const selectedPackage = packageSelect.value;
  if (selectedPackage && selectedPackage !== 'custom') {
    budgetInput.value = packagePrices[selectedPackage];
  } else if (selectedPackage === 'custom') {
    budgetInput.value = '';
    budgetInput.focus();
  }
}

// Submit ad request
function submitAdRequest(event) {
  event.preventDefault();
  
  // Get form data
  const formData = {
    id: Date.now(),
    company: document.getElementById('companyName').value.trim(),
    contactPerson: document.getElementById('contactPerson').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    adTitle: document.getElementById('adTitle').value.trim(),
    adContent: document.getElementById('adContent').value.trim(),
    description: document.getElementById('description').value.trim(),
    package: document.getElementById('package').value,
    budget: parseInt(document.getElementById('budget').value) || 0,
    position: document.getElementById('position').value,
    targetAudience: document.getElementById('targetAudience').value.trim() || 'All viewers',
    status: 'pending',
    submittedDate: new Date()
  };
  
  // Validate
  if (!formData.company || !formData.contactPerson || !formData.email || !formData.phone) {
    showToast('Please fill in all required fields');
    return;
  }
  
  if (!formData.adTitle || !formData.adContent) {
    showToast('Please provide ad title and content');
    return;
  }
  
  if (!formData.package) {
    showToast('Please select a package');
    return;
  }
  
  if (formData.budget < 10000) {
    showToast('Minimum budget is 10,000 RWF');
    return;
  }
  
  // Calculate duration and price based on package
  const packageDetails = {
    'basic': { duration: 15, price: 10000 },
    'standard': { duration: 30, price: 35000 },
    'premium': { duration: 60, price: 75000 },
    'custom': { duration: 20, price: formData.budget }
  };
  
  const details = packageDetails[formData.package];
  formData.duration = details.duration;
  formData.price = details.price;
  
  // Save to localStorage
  let adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  adRequests.push(formData);
  localStorage.setItem('adRequests', JSON.stringify(adRequests));
  
  // Generate reference number
  const referenceNumber = 'AD' + Date.now().toString().slice(-8);
  
  // Show success modal
  showSuccessModal(referenceNumber);
  
  // Reset form
  document.getElementById('adRequestForm').reset();
}

// Show success modal
function showSuccessModal(referenceNumber) {
  const modal = document.getElementById('successModal');
  const refEl = document.getElementById('referenceNumber');
  
  if (modal && refEl) {
    refEl.textContent = referenceNumber;
    modal.style.display = 'flex';
  }
}

// Close success modal
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle theme
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const icon = document.querySelector('#themeToggle i');
  if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
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

// Make functions global
window.selectPackage = selectPackage;
window.updatePackageDetails = updatePackageDetails;
window.submitAdRequest = submitAdRequest;
window.closeSuccessModal = closeSuccessModal;
