# Simba Supermarket - Modern E-Commerce Platform

A modern, fast, and beautiful e-commerce experience for Rwanda's most popular online supermarket.

## 🎨 Design System

### Color Palette
- **Primary**: `#30364F` (Deep Navy)
- **Secondary**: `#ACBAC4` (Soft Blue-Gray)
- **Accent**: `#E1D9BC` (Warm Beige)
- **Light**: `#F0F0DB` (Light Cream)

### Theme Modes
- **Light Mode (Sunny)**: Clean, bright interface with cream background
- **Dark Mode (Night)**: Eye-friendly dark interface with navy tones

## ✨ Features

### Core Requirements ✓
- [x] Display products from JSON dataset by category
- [x] Search & filter products
- [x] Add to cart functionality
- [x] Responsive design (mobile-first)
- [x] Deployed and accessible via public URL

### Bonus Features ⭐
- [x] Checkout flow with payment simulation
- [x] MoMo (Mobile Money) payment integration
- [x] 3 languages: English, French, Kinyarwanda
- [x] Product detail page
- [x] Dark mode
- [x] Font Awesome icons (no emojis)
- [x] International font support (Noto Sans)

## 🌍 Multilingual Support

The platform supports three languages:
- **English (EN)** - Default
- **French (FR)** - Français
- **Kinyarwanda (RW)** - Ikinyarwanda

Language preference is saved in localStorage and persists across sessions.

## 📱 Responsive Design

Fully responsive across all devices:
- **Desktop**: 1400px+ (Full layout with sidebar)
- **Tablet**: 768px - 1024px (Adapted grid layout)
- **Mobile**: 320px - 767px (Optimized for touch)

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **JavaScript (ES6+)**: Vanilla JS, async/await
- **Font Awesome 6.5.1**: Icon library
- **Noto Sans**: International font family

## 📂 Project Structure

```
simbaonlineshopping/
├── index.html              # Home page
├── cart.html               # Shopping cart & checkout
├── product.html            # Product detail page
├── style.css               # Global styles & theme
├── app.js                  # Main application logic
├── cart.js                 # Cart & checkout functionality
├── product.js              # Product detail logic
└── simba_products.json     # Product database (552 items)
```

## 🎯 Key Functionality

### Product Catalog
- 552 real products across 9 categories
- Dynamic category filtering
- Real-time search
- Sort by price and name
- Lazy loading with "Load More"

### Shopping Cart
- Add/remove products
- Quantity adjustment
- Real-time price calculation
- Persistent storage (localStorage)
- Cart badge counter

### Checkout Process
1. **Customer Details**: Name, phone, address
2. **Payment Method**: MTN MoMo, Airtel Money, Cash on Delivery
3. **MoMo PIN Entry**: Simulated payment interface
4. **Order Confirmation**: Success screen with order reference

### Theme System
- Toggle between light and dark modes
- Smooth transitions
- Persistent preference
- Icon changes (moon/sun)

## 🚀 Getting Started

1. **Clone or download** the project
2. **Open** `index.html` in a modern browser
3. **Browse** products, add to cart, and checkout!

No build process or dependencies required - pure vanilla JavaScript!

## 💾 Data Storage

All data is stored in browser localStorage:
- `cart`: Shopping cart items
- `theme`: Light/dark mode preference
- `language`: Selected language (en/fr/rw)

## 🎨 Icon System

Using Font Awesome 6.5.1 for all icons:
- Shopping bag logo
- Search, cart, theme toggle
- Category icons (customized per category)
- Payment method icons
- UI controls (plus, minus, check, etc.)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Product Categories

1. Cosmetics & Personal Care
2. Alcoholic Drinks
3. Food Products
4. Kitchenware & Electronics
5. Cleaning & Sanitary
6. General
7. Baby Products
8. Sports & Fitness
9. Stationery

## 💳 Payment Methods

- **MTN MoMo**: Mobile money with PIN entry
- **Airtel Money**: Mobile money alternative
- **Cash on Delivery**: Pay when you receive

## 🎯 Performance Optimizations

- Lazy loading images
- Efficient DOM updates
- Debounced search
- Minimal dependencies
- Optimized CSS (no frameworks)

## 📝 License

© 2025 Simba Supermarket. All rights reserved.

## 🤝 Contributing

This is a contest submission project. For inquiries, contact Simba Supermarket.

---

**Built with ❤️ for Rwanda's favorite online supermarket**
