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
  const payment = document.querySelector('input[name="payment"]:checked');
  
  if (!name || !phone || !address) {
    alert('Please fill in all fields');
    return;
  }
  
  if (!payment) {
    alert('Please select a payment method');
    return;
  }
  
  // Generate and show invoice first
  showInvoice({
    name: name,
    phone: phone,
    address: address,
    paymentMethod: payment.value
  });
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
  const customerData = JSON.parse(sessionStorage.getItem('pendingCustomerData'));
  
  const referralDiscount = parseInt(localStorage.getItem('referralDiscount') || '0');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (referralDiscount / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const delivery = 2000;
  const total = subtotalAfterDiscount + delivery;
  
  // Create order data
  const orderData = {
    orderRef: orderRef,
    customer: { 
      name: customerData.name, 
      phone: customerData.phone, 
      address: customerData.address 
    },
    items: cart,
    subtotal: subtotal,
    discount: discountAmount,
    discountPercent: referralDiscount,
    delivery: delivery,
    total: total,
    paymentMethod: customerData.paymentMethod,
    orderDate: new Date().toISOString(),
    status: 'Confirmed'
  };
  
  // Save order to localStorage
  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Track customer
  if (typeof trackCustomer === 'function') {
    trackCustomer({
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      orderTotal: total
    });
  }
  
  // Generate receipt
  generateReceipt(orderData);
  
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'none';
  const invoiceStep = document.getElementById('invoiceStep');
  if (invoiceStep) invoiceStep.style.display = 'none';
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
  
  // Clear session data
  sessionStorage.removeItem('pendingCustomerData');
  
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


// ========== RECEIPT/INVOICE GENERATION ==========

// Show invoice before payment
function showInvoice(customerData) {
  const referralDiscount = parseInt(localStorage.getItem('referralDiscount') || '0');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (referralDiscount / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const delivery = 2000;
  const total = subtotalAfterDiscount + delivery;
  
  const invoiceHTML = `
    <div style="max-height: 70vh; overflow-y: auto; padding: 1rem;">
      <div style="text-align: center; border-bottom: 2px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
        <h2 style="color: var(--primary); margin: 0;">🛒 SIMBA SUPERMARKET</h2>
        <p style="color: var(--text-light); margin: 0.5rem 0;">INVOICE</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: var(--bg); padding: 1rem; border-radius: 8px;">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--primary);">Customer Details</h4>
          <p style="margin: 0.25rem 0;"><strong>Name:</strong> ${customerData.name}</p>
          <p style="margin: 0.25rem 0;"><strong>Phone:</strong> ${customerData.phone}</p>
          <p style="margin: 0.25rem 0;"><strong>Address:</strong> ${customerData.address}</p>
        </div>
        <div style="background: var(--bg); padding: 1rem; border-radius: 8px;">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--primary);">Payment Method</h4>
          <p style="margin: 0.25rem 0;">${customerData.paymentMethod === 'momo' ? '📱 MTN Mobile Money' : customerData.paymentMethod === 'airtel' ? '📱 Airtel Money' : '💵 Cash on Delivery'}</p>
        </div>
      </div>
      
      <h4 style="margin: 1rem 0 0.5rem 0; color: var(--text);">Order Items</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr style="background: var(--surface);">
            <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid var(--border);">Item</th>
            <th style="padding: 0.5rem; text-align: center; border-bottom: 2px solid var(--border);">Qty</th>
            <th style="padding: 0.5rem; text-align: right; border-bottom: 2px solid var(--border);">Price</th>
            <th style="padding: 0.5rem; text-align: right; border-bottom: 2px solid var(--border);">Total</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => `
            <tr>
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border);">${item.name}</td>
              <td style="padding: 0.5rem; text-align: center; border-bottom: 1px solid var(--border);">${item.quantity}</td>
              <td style="padding: 0.5rem; text-align: right; border-bottom: 1px solid var(--border);">${formatPrice(item.price)}</td>
              <td style="padding: 0.5rem; text-align: right; border-bottom: 1px solid var(--border);">${formatPrice(item.price * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: right; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
          <span>Subtotal:</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        ${referralDiscount > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; color: var(--success);">
          <span>Discount (${referralDiscount}%):</span>
          <span>-${formatPrice(discountAmount)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
          <span>Delivery:</span>
          <span>${formatPrice(delivery)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border); font-size: 1.25rem; font-weight: bold; color: var(--primary);">
          <span>TOTAL:</span>
          <span>${formatPrice(total)}</span>
        </div>
      </div>
      
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
        <button class="btn-outline" onclick="closeInvoice()" style="flex: 1;">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button class="btn-primary" onclick="proceedToPaymentFromInvoice()" style="flex: 2;">
          <i class="fas fa-check"></i> Confirm & Pay
        </button>
      </div>
    </div>
  `;
  
  // Store customer data for later
  sessionStorage.setItem('pendingCustomerData', JSON.stringify(customerData));
  
  // Hide step 1, show invoice
  document.getElementById('step1').style.display = 'none';
  const invoiceStep = document.getElementById('invoiceStep');
  if (invoiceStep) {
    invoiceStep.innerHTML = invoiceHTML;
    invoiceStep.style.display = 'block';
  }
}

function closeInvoice() {
  document.getElementById('invoiceStep').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
}

function proceedToPaymentFromInvoice() {
  const customerData = JSON.parse(sessionStorage.getItem('pendingCustomerData'));
  const paymentMethod = customerData.paymentMethod;
  
  document.getElementById('invoiceStep').style.display = 'none';
  
  if (paymentMethod === 'cash') {
    completeOrder();
    return;
  }
  
  // Show MoMo/Airtel payment screen
  document.getElementById('step2').style.display = 'block';
  
  const referralDiscount = parseInt(localStorage.getItem('referralDiscount') || '0');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (referralDiscount / 100));
  const total = subtotal - discountAmount + 2000;
  
  document.getElementById('momoAmount').textContent = 
    `${cartTranslations[currentLang].momoAmount} ${formatPrice(total)}`;
}

function generateReceipt(orderData) {
  const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${orderData.orderRef}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
    .invoice-header { text-align: center; border-bottom: 3px solid #1a4d7a; padding-bottom: 20px; margin-bottom: 20px; }
    .invoice-header h1 { color: #1a4d7a; margin: 0; }
    .company-info { text-align: center; color: #666; margin-top: 10px; }
    .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .detail-box { background: #f5f5f5; padding: 15px; border-radius: 8px; }
    .detail-box h3 { margin: 0 0 10px 0; color: #1a4d7a; }
    .detail-box p { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #1a4d7a; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .totals { text-align: right; margin-top: 20px; }
    .totals table { width: 300px; margin-left: auto; }
    .totals .total-row { font-weight: bold; font-size: 1.2em; background: #f0f0f0; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; }
    .status-badge { display: inline-block; padding: 5px 15px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
    @media print { body { margin: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="invoice-header">
    <h1>🛒 SIMBA SUPERMARKET</h1>
    <div class="company-info">
      <p>KN 4 Ave, Kigali, Rwanda</p>
      <p>Phone: +250 788 000 000 | Email: info@simbasupermarket.rw</p>
      <p>TIN: 123456789</p>
    </div>
  </div>

  <div class="invoice-details">
    <div class="detail-box">
      <h3>Invoice Details</h3>
      <p><strong>Invoice #:</strong> ${orderData.orderRef}</p>
      <p><strong>Date:</strong> ${new Date(orderData.orderDate).toLocaleString()}</p>
      <p><strong>Payment:</strong> ${orderData.paymentMethod === 'momo' ? 'MTN Mobile Money' : orderData.paymentMethod === 'airtel' ? 'Airtel Money' : 'Cash on Delivery'}</p>
      <p><strong>Status:</strong> <span class="status-badge">${orderData.status}</span></p>
    </div>
    
    <div class="detail-box">
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${orderData.customer.name}</p>
      <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
      <p><strong>Address:</strong> ${orderData.customer.address}</p>
    </div>
  </div>

  <h3>Order Items</h3>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Category</th>
        <th>Unit Price</th>
        <th>Quantity</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${orderData.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.price.toLocaleString()} RWF</td>
          <td>${item.quantity}</td>
          <td>${(item.price * item.quantity).toLocaleString()} RWF</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td>${orderData.subtotal.toLocaleString()} RWF</td>
      </tr>
      ${orderData.discount > 0 ? `
      <tr style="color: #10b981;">
        <td>Discount (${orderData.discountPercent}%):</td>
        <td>-${orderData.discount.toLocaleString()} RWF</td>
      </tr>
      ` : ''}
      <tr>
        <td>Delivery:</td>
        <td>${orderData.delivery.toLocaleString()} RWF</td>
      </tr>
      <tr class="total-row">
        <td>TOTAL:</td>
        <td>${orderData.total.toLocaleString()} RWF</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p><strong>Thank you for shopping with Simba Supermarket!</strong></p>
    <p>For support, contact us at +250 788 000 000</p>
    <p class="no-print">
      <button onclick="window.print()" style="padding: 10px 20px; background: #1a4d7a; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
        🖨️ Print Invoice
      </button>
      <button onclick="downloadPDF()" style="padding: 10px 20px; background: #ff6b9d; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
        📥 Download PDF
      </button>
    </p>
  </div>

  <script>
    function downloadPDF() {
      alert('PDF download feature requires a backend server. Use Print to save as PDF from your browser.');
      window.print();
    }
  </script>
</body>
</html>
  `;
  
  // Save receipt HTML
  localStorage.setItem('lastReceipt', receiptHTML);
  
  // Add download button to success screen
  const successScreen = document.getElementById('step3');
  if (successScreen) {
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn-outline';
    downloadBtn.style.marginTop = '1rem';
    downloadBtn.innerHTML = '<i class="fas fa-file-invoice"></i> View Invoice';
    downloadBtn.onclick = () => viewReceipt(receiptHTML);
    
    const backBtn = document.getElementById('backShopBtn');
    if (backBtn && backBtn.parentNode) {
      backBtn.parentNode.insertBefore(downloadBtn, backBtn);
    }
  }
}

function viewReceipt(receiptHTML) {
  const receiptWindow = window.open('', '_blank');
  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
}

// View last receipt
function viewLastReceipt() {
  const receipt = localStorage.getItem('lastReceipt');
  if (receipt) {
    viewReceipt(receipt);
  } else {
    alert('No receipt available');
  }
}

// Get all orders
function getAllOrders() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}

// Make functions globally available
window.viewLastReceipt = viewLastReceipt;
window.getAllOrders = getAllOrders;
