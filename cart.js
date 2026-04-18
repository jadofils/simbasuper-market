// Cart translations
const cartTranslations = {
  en: {
    cartTitle: "Your Cart",
    emptyCart: "Your cart is empty",
    emptyCartMsg: "Add some products to get started!",
    continueShopping: "Continue Shopping",
    summary: "Order Summary",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    checkout: "Proceed to Checkout",
    checkoutTitle: "Checkout",
    labelName: "Full Name",
    labelPhone: "Phone Number",
    labelAddress: "Delivery Address",
    labelPayment: "Payment Method",
    proceedBtn: "Proceed to Pay",
    momoTitle: "MTN Mobile Money",
    momoInstructions: "Enter your MoMo PIN to confirm payment",
    momoAmount: "Amount to pay:",
    successTitle: "Order Confirmed!",
    successMsg: "Your order has been placed successfully.",
    orderRef: "Order Reference:",
    backShopBtn: "Back to Shop",
    remove: "Remove"
  },
  fr: {
    cartTitle: "Votre Panier",
    emptyCart: "Votre panier est vide",
    emptyCartMsg: "Ajoutez des produits pour commencer!",
    continueShopping: "Continuer les Achats",
    summary: "Résumé de la Commande",
    subtotal: "Sous-total",
    delivery: "Livraison",
    total: "Total",
    checkout: "Passer à la Caisse",
    checkoutTitle: "Paiement",
    labelName: "Nom Complet",
    labelPhone: "Numéro de Téléphone",
    labelAddress: "Adresse de Livraison",
    labelPayment: "Mode de Paiement",
    proceedBtn: "Procéder au Paiement",
    momoTitle: "MTN Mobile Money",
    momoInstructions: "Entrez votre PIN MoMo pour confirmer le paiement",
    momoAmount: "Montant à payer:",
    successTitle: "Commande Confirmée!",
    successMsg: "Votre commande a été passée avec succès.",
    orderRef: "Référence de Commande:",
    backShopBtn: "Retour à la Boutique",
    remove: "Supprimer"
  },
  rw: {
    cartTitle: "Igitebo Cyawe",
    emptyCart: "Igitebo cyawe kirimo ubusa",
    emptyCartMsg: "Ongeramo ibicuruzwa kugirango utangire!",
    continueShopping: "Komeza Kugura",
    summary: "Incamake y'Itumiza",
    subtotal: "Igiteranyo",
    delivery: "Gutanga",
    total: "Igiteranyo",
    checkout: "Kwishyura",
    checkoutTitle: "Kwishyura",
    labelName: "Amazina Yombi",
    labelPhone: "Nimero ya Telefoni",
    labelAddress: "Aho Uzatwarirwa",
    labelPayment: "Uburyo bwo Kwishyura",
    proceedBtn: "Komeza Kwishyura",
    momoTitle: "MTN Mobile Money",
    momoInstructions: "Injiza PIN ya MoMo kugirango wemeze kwishyura",
    momoAmount: "Amafaranga yo kwishyura:",
    successTitle: "Itumiza Ryemejwe!",
    successMsg: "Itumiza ryawe ryashyizwe neza.",
    orderRef: "Nimero y'Itumiza:",
    backShopBtn: "Subira ku Iduka",
    remove: "Kuraho"
  }
};

let currentLang = localStorage.getItem('language') || 'en';
let cart = [];
let pin = '';

// Load cart
function loadCart() {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  renderCart();
}

// Render cart
function renderCart() {
  const layout = document.getElementById('cartLayout');
  if (!layout) return;
  
  if (cart.length === 0) {
    layout.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon"><i class="fas fa-shopping-cart"></i></div>
        <h2>${cartTranslations[currentLang].emptyCart}</h2>
        <p>${cartTranslations[currentLang].emptyCartMsg}</p>
        <a href="index.html" class="btn-primary">${cartTranslations[currentLang].continueShopping}</a>
      </div>
    `;
    return;
  }
  
  const referralDiscount = parseInt(localStorage.getItem('referralDiscount') || '0');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (referralDiscount / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const delivery = 2000;
  const total = subtotalAfterDiscount + delivery;
  
  layout.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-actions">
              <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, -1)">
                <i class="fas fa-minus"></i>
              </button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, 1)">
                <i class="fas fa-plus"></i>
              </button>
              <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i> ${cartTranslations[currentLang].remove}
              </button>
            </div>
          </div>
          <div class="cart-item-total">
            ${formatPrice(item.price * item.quantity)}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="cart-summary">
      <h2>${cartTranslations[currentLang].summary}</h2>
      <div class="summary-row">
        <span>${cartTranslations[currentLang].subtotal}</span>
        <span>${formatPrice(subtotal)}</span>
      </div>
      ${referralDiscount > 0 ? `
      <div class="summary-row" style="color: var(--success);">
        <span><i class="fas fa-gift"></i> Referral Discount (${referralDiscount}%)</span>
        <span>-${formatPrice(discountAmount)}</span>
      </div>
      ` : ''}
      <div class="summary-row">
        <span>${cartTranslations[currentLang].delivery}</span>
        <span>${formatPrice(delivery)}</span>
      </div>
      <div class="summary-row total">
        <span>${cartTranslations[currentLang].total}</span>
        <span>${formatPrice(total)}</span>
      </div>
      <button class="btn-primary full-width" onclick="openCheckout()">
        ${cartTranslations[currentLang].checkout}
      </button>
    </div>
  `;
}

// Format price
function formatPrice(price) {
  return `${price.toLocaleString()} RWF`;
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
}

// Open checkout modal
function openCheckout() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.style.display = 'flex';
    updateCheckoutTranslations();
  }
}

// Close checkout modal
function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.style.display = 'none';
    resetCheckout();
  }
}

// Reset checkout
function resetCheckout() {
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'none';
  pin = '';
  updatePinDisplay();
}

// Proceed to payment
function proceedToPayment() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  
  if (!name || !phone || !address) {
    alert('Please fill in all fields');
    return;
  }
  
  if (payment === 'cash') {
    completeOrder();
    return;
  }
  
  // Show MoMo screen
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2000;
  document.getElementById('momoAmount').textContent = 
    `${cartTranslations[currentLang].momoAmount} ${formatPrice(total)}`;
}

// Handle PIN input
function handlePinInput(value) {
  if (value === 'clear') {
    pin = pin.slice(0, -1);
  } else if (pin.length < 5) {
    pin += value;
  }
  
  updatePinDisplay();
}

// Update PIN display
function updatePinDisplay() {
  const display = document.getElementById('pinDisplay');
  if (!display) return;
  
  let displayText = '';
  for (let i = 0; i < 5; i++) {
    displayText += i < pin.length ? '●' : '○';
    if (i < 4) displayText += ' ';
  }
  
  display.textContent = displayText;
}

// Confirm PIN
function confirmPin() {
  if (pin.length !== 5) {
    alert('Please enter a 5-digit PIN');
    return;
  }
  
  // Simulate payment processing
  setTimeout(() => {
    completeOrder();
  }, 1000);
}

// Complete order
function completeOrder() {
  const orderRef = 'ORD-' + Date.now().toString(36).toUpperCase();
  
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
  
  document.getElementById('orderRef').textContent = 
    `${cartTranslations[currentLang].orderRef} ${orderRef}`;
  
  // Mark referral as converted
  const referralCode = localStorage.getItem('referralCode');
  if (referralCode) {
    let referrals = JSON.parse(localStorage.getItem('referralTracking') || '{}');
    if (referrals[referralCode]) {
      const lastReferral = referrals[referralCode][referrals[referralCode].length - 1];
      if (lastReferral && !lastReferral.converted) {
        lastReferral.converted = true;
        lastReferral.conversionDate = new Date().toISOString();
        localStorage.setItem('referralTracking', JSON.stringify(referrals));
        
        let credits = JSON.parse(localStorage.getItem('referralCredits') || '{}');
        credits[referralCode] = (credits[referralCode] || 0) + 500;
        localStorage.setItem('referralCredits', JSON.stringify(credits));
      }
    }
    localStorage.removeItem('referralDiscount');
  }
  
  // Mark user as having purchased
  localStorage.setItem('hasPurchased', 'true');
  
  // Clear cart
  localStorage.removeItem('cart');
  cart = [];
  updateCartBadge();
}

// Update checkout translations
function updateCheckoutTranslations() {
  const t = cartTranslations[currentLang];
  
  document.getElementById('checkoutTitle').textContent = t.checkoutTitle;
  document.getElementById('labelName').textContent = t.labelName;
  document.getElementById('labelPhone').textContent = t.labelPhone;
  document.getElementById('labelAddress').textContent = t.labelAddress;
  document.getElementById('labelPayment').textContent = t.labelPayment;
  document.getElementById('proceedBtn').textContent = t.proceedBtn;
  document.getElementById('momoTitle').textContent = t.momoTitle;
  document.getElementById('momoInstructions').textContent = t.momoInstructions;
  document.getElementById('successTitle').textContent = t.successTitle;
  document.getElementById('successMsg').textContent = t.successMsg;
  document.getElementById('backShopBtn').textContent = t.backShopBtn;
  document.getElementById('cartTitle').textContent = t.cartTitle;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  currentLang = localStorage.getItem('language') || 'en';
  
  loadCart();
  updateCheckoutTranslations();
  
  // Close modal
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCheckout);
  }
  
  // Proceed button
  const proceedBtn = document.getElementById('proceedBtn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', proceedToPayment);
  }
  
  // PIN pad
  const pinButtons = document.querySelectorAll('.pin-btn');
  pinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-val');
      if (value) {
        handlePinInput(value);
      }
    });
  });
  
  // Confirm PIN
  const confirmPinBtn = document.getElementById('confirmPin');
  if (confirmPinBtn) {
    confirmPinBtn.addEventListener('click', confirmPin);
  }
  
  // Language change
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('language', currentLang);
      loadCart();
      updateCheckoutTranslations();
    });
  }
});
