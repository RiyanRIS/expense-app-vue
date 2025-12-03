# Architecture Documentation - Expense Tracker App

> **Last Updated:** December 3, 2025  
> **Version:** 1.0.0  
> **Architecture Pattern:** MVC (Model-View-Controller) + RESTful API

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Folder Structure](#folder-structure)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Architecture](#api-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Authentication & Security](#authentication--security)
9. [Data Flow](#data-flow)
10. [Key Features](#key-features)

---

## 🎯 Project Overview

**Expense Tracker App** adalah aplikasi Progressive Web App (PWA) untuk mencatat dan mengelola pengeluaran pribadi dengan fitur-fitur lengkap seperti kategorisasi, sumber pembayaran, quick add items, backup/restore, dan push notifications.

### Core Capabilities
- ✅ User Authentication & Authorization
- ✅ CRUD Operations untuk Expenses, Categories, Payment Sources
- ✅ Quick Add Items untuk input cepat
- ✅ Backup & Restore Data
- ✅ Push Notifications (Web Push)
- ✅ Multi-language Support (i18n)
- ✅ Dark Mode Support
- ✅ Responsive Mobile-First Design
- ✅ Offline Support (Service Worker)

---

## 🏗️ Architecture Pattern

### MVC Pattern Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              VIEW LAYER (Vue.js SPA)                │   │
│  │  - LoginView, DashboardView, ProfileView, etc.      │   │
│  │  - Components: MobileTopBar, MobileBottomNav        │   │
│  │  - Router: Vue Router with Hash Mode                │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │ HTTP Requests (apiClient)           │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  SERVER (Express.js)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           MIDDLEWARE LAYER                           │  │
│  │  - CORS, JSON Parser, Morgan Logger                  │  │
│  │  - Auth Middleware (JWT Verification)                │  │
│  │  - Validation Middleware (express-validator)         │  │
│  │  - Error Handler                                     │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │           CONTROLLER LAYER                           │  │
│  │  - authController                                    │  │
│  │  - expenseController                                 │  │
│  │  - categoryController                                │  │
│  │  - paymentSourceController                           │  │
│  │  - quickAddItemController                            │  │
│  │  - backupController                                  │  │
│  │  - pushNotificationController                        │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │             MODEL LAYER (Mongoose)                   │  │
│  │  - User Model                                        │  │
│  │  - Expense Model                                     │  │
│  │  - Category Model                                    │  │
│  │  - PaymentSource Model                               │  │
│  │  - QuickAddItem Model                                │  │
│  │  - PushSubscription Model                            │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│              DATABASE (MongoDB Atlas)                        │
│  Collections: users, expense, category, payment_source,     │
│               quick_add_item, push_subscription              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
expense_view/
├── config/                      # Configuration files
│   └── logger.js               # Winston logger configuration
│
├── controllers/                 # Business logic controllers
│   ├── authController.js       # Authentication & user management
│   ├── expenseController.js    # Expense CRUD operations
│   ├── categoryController.js   # Category management
│   ├── paymentSourceController.js  # Payment source management
│   ├── quickAddItemController.js   # Quick add items management
│   ├── backupController.js     # Backup & restore operations
│   └── pushNotificationController.js  # Push notification handling
│
├── middlewares/                 # Express middlewares
│   ├── auth.js                 # JWT authentication & authorization
│   ├── validation.js           # Request validation rules
│   └── errorHandler.js         # Error handling & logging
│
├── models/                      # Mongoose schemas & models
│   ├── User.js                 # User model with authentication
│   ├── Expense.js              # Expense model
│   ├── Category.js             # Category model
│   ├── PaymentSource.js        # Payment source model
│   ├── QuickAddItem.js         # Quick add item model
│   └── PushSubscription.js     # Push subscription model
│
├── routes/                      # API route definitions
│   ├── index.js                # Main router (route aggregator)
│   ├── auth.js                 # Authentication routes
│   ├── expenses.js             # Expense routes
│   ├── categories.js           # Category routes
│   ├── paymentSources.js       # Payment source routes
│   ├── quickAddItems.js        # Quick add item routes
│   ├── backup.js               # Backup & restore routes
│   └── pushNotifications.js    # Push notification routes
│
├── public/                      # Frontend static files
│   ├── index.html              # Main HTML file
│   ├── app.js                  # Vue app initialization
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service worker for offline support
│   │
│   ├── components/             # Reusable Vue components
│   │   ├── MobileTopBar.js
│   │   └── MobileBottomNav.js
│   │
│   ├── views/                  # Vue view components
│   │   ├── LoginView.js
│   │   ├── SignupView.js
│   │   ├── DashboardView.js
│   │   ├── ProfileView.js
│   │   ├── CategoriesView.js
│   │   ├── PaymentSourcesView.js
│   │   ├── QuickAddView.js
│   │   ├── SettingsView.js
│   │   ├── ForgotPasswordView.js
│   │   ├── ResetPasswordView.js
│   │   └── ReactivateView.js
│   │
│   ├── router/                 # Vue Router configuration
│   │   └── index.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── api.js              # API client wrapper
│   │   └── i18n.js             # Internationalization
│   │
│   ├── plugins/                # Third-party libraries
│   │   ├── vue/
│   │   ├── tailwindcss/
│   │   └── fontawesome/
│   │
│   └── icons/                  # PWA icons
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md         # This file
│   ├── AUTH_IMPLEMENTATION_GUIDE.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── VALIDATION_GUIDE.md
│   └── ...
│
├── logs/                        # Application logs
│   ├── app-YYYY-MM-DD.log
│   ├── error-YYYY-MM-DD.log
│   └── http-YYYY-MM-DD.log
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── server.js                    # Express server entry point
├── package.json                 # NPM dependencies
└── README.md                    # Project readme

```

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 7.0+ | NoSQL database |
| **Mongoose** | 7.0.0 | ODM for MongoDB |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **express-validator** | 7.0.1 | Request validation |
| **Winston** | 3.11.0 | Logging |
| **Morgan** | 1.10.0 | HTTP request logging |
| **web-push** | 3.6.7 | Push notifications |
| **cors** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.0.0 | Environment variables |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue.js** | 3.x | Progressive JavaScript framework |
| **Vue Router** | 4.x | Client-side routing |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Font Awesome** | 6.x | Icon library |
| **Service Worker** | - | Offline support & caching |

### Development Tools
- **Nodemon** - Auto-restart on file changes
- **Git** - Version control

---

## 🗄️ Database Schema

### Collections Overview

```
MongoDB Database: riyanris
├── users
├── expense
├── category
├── payment_source
├── quick_add_item
└── push_subscription
```

### 1. User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required, lowercase),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  deactivatedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- email: unique
- username: unique
```

### 2. Expense Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  name: String (required),
  amount: Number (required, min: 0),
  category: String (default: ''),
  payment_source: String (default: ''),
  store: String (default: ''),
  date: String,
  input_date: String,
  input_time: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- { user: 1, input_date: -1 }
- { user: 1, category: 1 }
```

### 3. Category Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique per user),
  user: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- { name: 1, user: 1 } (unique compound)
```

### 4. PaymentSource Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique per user),
  user: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- { name: 1, user: 1 } (unique compound)
```

### 5. QuickAddItem Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique per user),
  amount: Number (required, min: 0),
  category: String (default: ''),
  payment_source: String (default: ''),
  store: String (default: ''),
  user: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- { name: 1, user: 1 } (unique compound)
```

### 6. PushSubscription Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  endpoint: String (required),
  keys: {
    p256dh: String (required),
    auth: String (required)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes:
- { user: 1 }
- { endpoint: 1 } (unique)
```

---

## 🚀 API Architecture

### Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

### API Structure

```
/api
├── /auth                        # Authentication endpoints
│   ├── POST   /signup          # User registration
│   ├── POST   /login           # User login
│   ├── POST   /logout          # User logout
│   ├── GET    /me              # Get current user
│   ├── PUT    /profile         # Update profile
│   ├── PUT    /change-password # Change password
│   ├── POST   /forgot-password # Request password reset
│   ├── POST   /reset-password/:token  # Reset password
│   ├── POST   /reactivate      # Reactivate suspended account
│   └── DELETE /account         # Delete account
│
├── /expenses                    # Expense management
│   ├── GET    /                # Get all expenses
│   ├── POST   /                # Create expense
│   ├── PUT    /:id             # Update expense
│   └── DELETE /:id             # Delete expense
│
├── /categories                  # Category management
│   ├── GET    /                # Get all categories
│   ├── POST   /                # Create category
│   ├── PUT    /:name           # Update category
│   └── DELETE /:name           # Delete category
│
├── /payment-sources             # Payment source management
│   ├── GET    /                # Get all payment sources
│   ├── POST   /                # Create payment source
│   ├── PUT    /:name           # Update payment source
│   └── DELETE /:name           # Delete payment source
│
├── /quick-add-items             # Quick add items
│   ├── GET    /                # Get all quick add items
│   ├── POST   /                # Create quick add item
│   ├── PUT    /:id             # Update quick add item
│   └── DELETE /:id             # Delete quick add item
│
├── /backup                      # Backup & restore
│   ├── GET    /backup          # Export all data
│   └── POST   /restore         # Import data
│
└── /push                        # Push notifications
    ├── POST   /subscribe       # Subscribe to push
    ├── POST   /unsubscribe     # Unsubscribe from push
    └── POST   /send            # Send push notification
```

### Authentication Flow

```
1. User Registration/Login
   ↓
2. Server generates JWT token
   ↓
3. Client stores token in localStorage
   ↓
4. Client includes token in Authorization header
   Header: "Authorization: Bearer <token>"
   ↓
5. Server validates token in auth middleware
   ↓
6. Authorized request proceeds to controller
```

### Request/Response Format

**Standard Success Response:**
```json
{
  "success": true,
  "count": 10,
  "data": { /* resource data */ }
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors */ ]
}
```

---

## 🎨 Frontend Architecture

### Vue.js SPA Structure

```
┌─────────────────────────────────────────────────────────┐
│                    index.html                           │
│  Loads: Vue.js, TailwindCSS, FontAwesome               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   app.js                                │
│  - Vue app initialization                              │
│  - Global state management                             │
│  - Event bus for components                            │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼─────┐ ┌───▼──────┐
│   Router     │ │ Views  │ │Components│
│              │ │        │ │          │
│ - Routes     │ │ - 11   │ │ - TopBar │
│ - Guards     │ │   views│ │ - BottomNav
│ - Navigation │ │        │ │          │
└──────────────┘ └────────┘ └──────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│                  Utils                                │
│  - apiClient: Axios-like HTTP wrapper                │
│  - i18n: Multi-language support                      │
└───────────────────────────────────────────────────────┘
```

### State Management

**Global State (in app.js):**
```javascript
{
  user: null,              // Current logged in user
  isAuthenticated: false,  // Auth status
  darkMode: false,         // Theme preference
  language: 'id',          // Current language
  notifications: []        // Toast notifications
}
```

### View Components

| View | Route | Purpose |
|------|-------|---------|
| LoginView | `/login` | User login |
| SignupView | `/signup` | User registration |
| DashboardView | `/dashboard` | Main expense dashboard |
| ProfileView | `/profile` | User profile management |
| CategoriesView | `/categories` | Manage categories |
| PaymentSourcesView | `/payment-sources` | Manage payment sources |
| QuickAddView | `/quick-add` | Manage quick add items |
| SettingsView | `/settings` | App settings |
| ForgotPasswordView | `/forgot-password` | Password reset request |
| ResetPasswordView | `/reset-password/:token` | Password reset |
| ReactivateView | `/reactivate` | Account reactivation |

### Routing Guards

```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    // Redirect to login if auth required
    next('/login');
  } else if (to.meta.requiresGuest && token) {
    // Redirect to dashboard if already logged in
    next('/dashboard');
  } else {
    next();
  }
});
```

---

## 🔐 Authentication & Security

### JWT Authentication

**Token Generation:**
```javascript
const token = jwt.sign(
  { 
    userId: user._id,
    email: user.email,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
);
```

**Token Verification:**
```javascript
// In auth middleware
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.userId;
req.userRole = decoded.role;
```

### Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure, stateless authentication
3. **CORS**: Configured for specific origins
4. **Input Validation**: express-validator for all inputs
5. **XSS Protection**: HTML escaping on all text inputs
6. **SQL Injection Protection**: MongoDB parameterized queries
7. **Rate Limiting**: Can be added with express-rate-limit
8. **HTTPS**: Recommended for production

### Authorization Levels

```javascript
Roles:
- user: Standard user (default)
- admin: Admin privileges

Middleware usage:
- protect: Requires authentication
- restrictTo('admin'): Requires admin role
```

---

## 🔄 Data Flow

### 1. Create Expense Flow

```
User Input (DashboardView)
    ↓
Form Validation (Client-side)
    ↓
API Call (apiClient.expenses.create)
    ↓
HTTP POST /api/expenses
    ↓
Auth Middleware (verify JWT)
    ↓
Validation Middleware (express-validator)
    ↓
Expense Controller (createExpense)
    ↓
Expense Model (save to MongoDB)
    ↓
Success Response
    ↓
Update UI (refresh expense list)
    ↓
Show Success Notification
```

### 2. Authentication Flow

```
User Login (LoginView)
    ↓
API Call (apiClient.auth.login)
    ↓
HTTP POST /api/auth/login
    ↓
Auth Controller (login)
    ↓
Verify Credentials (bcrypt compare)
    ↓
Generate JWT Token
    ↓
Send Token Response
    ↓
Store Token (localStorage)
    ↓
Redirect to Dashboard
    ↓
Load User Data
```

### 3. Quick Add Flow

```
User selects Quick Add Item
    ↓
Pre-filled form data
    ↓
Create expense with item data
    ↓
Save to expenses collection
    ↓
Show success notification
    ↓
Refresh dashboard
```

---

## ✨ Key Features

### 1. **Dashboard Statistics**
- Total expenses today
- Total expenses this month
- Top category by spending
- Top payment source by spending
- Expense filtering (all, today, yesterday, week, month)

### 2. **Quick Add Items**
- Pre-configured expense templates
- One-click expense creation
- Manage items: create, edit, delete
- Store information included

### 3. **Backup & Restore**
- Export all data to JSON
- Import data from JSON
- User-scoped data only
- Validation on restore

### 4. **Push Notifications**
- Web Push API integration
- Subscribe/Unsubscribe
- VAPID authentication
- Send custom notifications

### 5. **Multi-language Support**
- Indonesian (id)
- English (en)
- Dynamic translation
- Persistent preference

### 6. **Dark Mode**
- System preference detection
- Manual toggle
- Persistent preference
- Tailwind dark classes

### 7. **Mobile Optimization**
- Touch-optimized UI
- Swipe gestures (delete)
- Bottom navigation
- Pull-to-refresh
- Responsive design

### 8. **Progressive Web App**
- Installable
- Offline support
- Service worker caching
- App manifest

---

## 🔧 Configuration

### Environment Variables

```bash
# Database
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_CLUSTER=your_cluster.mongodb.net
DB_NAME=riyanris

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

# Server
PORT=3001
NODE_ENV=development

# Push Notifications (Optional)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Email (for password reset - optional)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Logging Configuration

```javascript
// Winston logger with daily rotation
- app-{date}.log: Combined logs
- error-{date}.log: Error logs only
- http-{date}.log: HTTP request logs
- Retention: 14 days
```

---

## 📊 Performance Considerations

### Database Optimization
- Indexed fields for faster queries
- Compound indexes for user-scoped data
- Lean queries for read operations

### Frontend Optimization
- Lazy loading for views
- Debounced input handlers
- Local state caching
- Service worker caching

### API Optimization
- Response compression (can be added)
- Request payload limits (10MB)
- Async/await for all DB operations
- Error handling with asyncHandler

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure MongoDB connection
- [ ] Generate VAPID keys for push notifications
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS for production domain
- [ ] Set up logging directory
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test backup/restore
- [ ] Enable compression middleware
- [ ] Set up monitoring (optional)
- [ ] Configure rate limiting (recommended)

---

## 📝 Notes

- All timestamps are in ISO format
- All monetary values are in Indonesian Rupiah (Rp)
- Date format: Indonesian locale (dd MMM yyyy)
- API uses snake_case for consistency with database
- Frontend uses camelCase for JavaScript conventions
- Error handling uses custom error classes
- Validation errors return detailed field-level messages

---

**For more detailed documentation, see:**
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Authentication Guide](./AUTH_IMPLEMENTATION_GUIDE.md)
- [Validation Guide](./VALIDATION_GUIDE.md)
- [API Reference](./API_REFERENCE.md) (to be created)
