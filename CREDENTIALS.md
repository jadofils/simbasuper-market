# Simba Supermarket - Login Credentials

## 🔐 Default User Accounts

### Customer Account
- **Email:** `customer@simba.com`
- **Password:** `Simba@123`
- **Role:** Customer
- **Access:**
  - Browse and shop products
  - View live streams
  - Interact with live features (chat, reactions, comments)
  - Add to cart and checkout
  - View customer dashboard

### Admin Account
- **Email:** `admin@simba.com`
- **Password:** `Simba@123`
- **Role:** Admin
- **Access:**
  - All customer features
  - Admin dashboard
  - Live selling studio
  - Manage advertisements
  - View analytics
  - Configure settings

## 📍 Login Page

**URL:** `login.html` (root directory)

## 🔄 How Authentication Works

1. **Login:** Users enter email and password on `login.html`
2. **Validation:** System checks against stored users in `localStorage.users`
3. **Session:** User data stored in `sessionStorage.currentUser`
4. **State:** Login state stored in `localStorage.isLoggedIn`
5. **Redirect:** 
   - Admin → `dashboard.html`
   - Customer → `customer-dashboard.html`
   - Return URL → Original page (if specified)

## 🛡️ Protected Features

### Requires Login (Any User)
- Send chat messages in live streams
- Post comments
- Like/reply to comments
- Send reactions (❤️ 🔥 👏 😂 😮)
- Add products to cart
- Request microphone
- Raise hand
- Checkout and place orders

### Requires Admin Role
- Access admin dashboard
- Access broadcast studio
- Manage live sessions
- Approve/reject advertisements
- View analytics and reports
- Configure system settings

## 📦 Storage Structure

### localStorage
```json
{
  "users": [
    {
      "id": "USER-CUSTOMER",
      "name": "Simba Customer",
      "email": "customer@simba.com",
      "password": "Simba@123",
      "role": "customer"
    },
    {
      "id": "USER-ADMIN",
      "name": "Simba Admin",
      "email": "admin@simba.com",
      "password": "Simba@123",
      "role": "admin"
    }
  ],
  "isLoggedIn": "true"
}
```

### sessionStorage
```json
{
  "currentUser": {
    "id": "USER-CUSTOMER",
    "name": "Simba Customer",
    "email": "customer@simba.com",
    "role": "customer"
  }
}
```

## 🧪 Testing

### Test Customer Login
```
1. Go to: login.html
2. Email: customer@simba.com
3. Password: Simba@123
4. Click: Login
5. Result: Redirected to customer-dashboard.html
```

### Test Admin Login
```
1. Go to: login.html
2. Email: admin@simba.com
3. Password: Simba@123
4. Click: Login
5. Result: Redirected to dashboard.html
```

### Test Protected Actions
```
1. Go to: live-selling/index.html (not logged in)
2. Try to: Send reaction
3. Result: "Please login to send reactions"
4. Action: Redirected to login.html
5. Login: customer@simba.com / Simba@123
6. Result: Returned to live-selling/index.html
7. Try again: Send reaction
8. Result: Reaction sent successfully ✅
```

## 🔓 Logout

**How to Logout:**
- Click logout button on admin pages
- Or clear sessionStorage manually
- Or close browser (session ends)

**What Happens:**
- `sessionStorage.currentUser` removed
- `localStorage.isLoggedIn` removed
- Redirected to `login.html`

## 📝 Notes

- **Same Password:** Both accounts use `Simba@123` for simplicity
- **Case Sensitive:** Passwords are case-sensitive
- **Email Format:** Must be valid email format
- **Auto-Create:** Default accounts created automatically on first visit
- **Session:** Login persists until browser closed (sessionStorage)
- **Return URLs:** Users return to original page after login

## 🚀 Quick Start

**For Customers:**
```
login.html → customer@simba.com / Simba@123 → Shop & Interact
```

**For Admins:**
```
login.html → admin@simba.com / Simba@123 → Manage Everything
```

---

**Last Updated:** January 2025
**Version:** 1.0
