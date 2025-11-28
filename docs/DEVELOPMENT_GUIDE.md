# Expense App Vue - Development Guide

> **Last Updated**: November 28, 2025  
> **Branch**: feat/vue-app  
> **Purpose**: Comprehensive guide untuk development session baru

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [File Structure](#file-structure)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [State Management](#state-management)
8. [Routing](#routing)
9. [Authentication Flow](#authentication-flow)
10. [Mobile-First Features](#mobile-first-features)
11. [Translation System (i18n)](#translation-system-i18n)
12. [Recent Changes](#recent-changes)
13. [Known Issues & TODOs](#known-issues--todos)

---

## Project Overview

**Expense App Vue** adalah aplikasi manajemen pengeluaran pribadi dengan pendekatan **mobile-first**. Aplikasi ini menggunakan Vue.js 3 (Composition API via CDN) tanpa build tools, dan backend Node.js/Express dengan MongoDB.

### Key Features
- ✅ Multi-user authentication (JWT-based)
- ✅ CRUD pengeluaran dengan kategorisasi
- ✅ Quick Add Items untuk input cepat
- ✅ Statistik dashboard (hari ini, bulan ini, top kategori, top payment)
- ✅ Multi-language (Indonesian/English)
- ✅ Dark mode support
- ✅ PWA-ready dengan service worker (planned)
- ✅ Mobile-optimized UI dengan swipe gestures
- ✅ Back button handling (modal-aware, double-tap to exit)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Vue 3 App (CDN - No Build Tools)            │  │
│  │  - Router (Hash mode)                        │  │
│  │  - Global State (root instance)              │  │
│  │  - i18n utility                              │  │
│  │  - Mobile-first components                   │  │
│  └──────────────────────────────────────────────┘  │
│                       ↕                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Client (Fetch-based)                    │  │
│  │  - Enhanced error handling                   │  │
│  │  - JWT token management                      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Auth Middleware (JWT protect)               │  │
│  │  Validation Middleware                       │  │
│  │  Error Handler                               │  │
│  └──────────────────────────────────────────────┘  │
│                       ↕                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  MongoDB Atlas                               │  │
│  │  - Users                                     │  │
│  │  - Expenses (user-scoped)                    │  │
│  │  - Categories (user-scoped)                  │  │
│  │  - PaymentSources (user-scoped)              │  │
│  │  - QuickAddItems (user-scoped)               │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Vue.js 3.4+** (Global build via CDN)
- **Vue Router 4** (Hash mode)
- **Tailwind CSS 3** (JIT via CDN)
- **Font Awesome 6** (Icons)
- **Fetch API** (HTTP requests)
- **LocalStorage** (Token & user data persistence)

### Backend
- **Node.js** (Express.js framework)
- **MongoDB** (Atlas cloud database)
- **Mongoose** (ODM)
- **JWT** (jsonwebtoken for authentication)
- **bcryptjs** (Password hashing)
- **web-push** (Push notifications)
- **morgan** (HTTP logging)
- **dotenv** (Environment variables)

### Development Tools
- **Nodemon** (Auto-reload server)
- **Morgan** (Request logging)
- **Custom Logger** (Winston-based, see config/logger.js)

---

## File Structure

```
expense-app-vue/
├── server.js                    # Main backend server
├── package.json
├── .env                         # Environment variables (not in repo)
│
├── models/                      # Mongoose models
│   ├── User.js                  # User schema with auth
│   ├── Expense.js               # Expense schema (user-scoped)
│   ├── Category.js              # Category schema (user-scoped)
│   ├── PaymentSource.js         # Payment source schema (user-scoped)
│   ├── QuickAddItem.js          # Quick add template (user-scoped)
│   └── PushSubscription.js      # Web push subscriptions
│
├── controllers/
│   └── authController.js        # Auth logic (signup, login, etc)
│
├── middlewares/
│   ├── auth.js                  # JWT verification (protect, restrictTo)
│   ├── validation.js            # Input validation
│   └── errorHandler.js          # Global error handling
│
├── config/
│   └── logger.js                # Winston logger configuration
│
├── public/                      # Frontend files (served statically)
│   ├── index.html               # Entry point
│   ├── app.js                   # Main Vue app instance
│   ├── manifest.json            # PWA manifest
│   ├── service-worker.js        # Service worker (PWA)
│   │
│   ├── components/              # Reusable Vue components
│   │   ├── MobileTopBar.js      # Top navigation bar
│   │   └── MobileBottomNav.js   # Bottom navigation (3 items)
│   │
│   ├── views/                   # Page components
│   │   ├── LoginView.js
│   │   ├── SignupView.js
│   │   ├── ForgotPasswordView.js
│   │   ├── ResetPasswordView.js
│   │   ├── DashboardViewMobile.js    # Main dashboard
│   │   ├── ProfileView.js
│   │   ├── CategoriesView.js
│   │   ├── PaymentSourcesView.js
│   │   ├── QuickAddView.js
│   │   └── SettingsView.js
│   │
│   ├── router/
│   │   └── index.js             # Vue Router configuration
│   │
│   ├── utils/
│   │   ├── api.js               # API client (fetch wrapper)
│   │   └── i18n.js              # Translation utility
│   │
│   ├── plugins/
│   │   ├── vue/vue.global.js
│   │   ├── tailwindcss/tailwindcss.js
│   │   └── fontawesome/         # Font Awesome assets
│   │
│   └── icons/                   # PWA icons
│
└── docs/                        # Documentation
    ├── DEVELOPMENT_GUIDE.md     # This file
    └── API_REFERENCE.md         # API endpoints documentation
```

---

## API Endpoints

### Base URL
- Development: `http://localhost:3000`
- Production: (to be configured)

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login user (returns JWT) |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password/:token` | No | Reset password with token |
| POST | `/api/auth/logout` | Yes | Logout (clear token) |
| GET | `/api/auth/me` | Yes | Get current user info |
| PUT | `/api/auth/profile` | Yes | Update user profile |
| PUT | `/api/auth/change-password` | Yes | Change password |
| DELETE | `/api/auth/account` | Yes | Delete account |
| GET | `/api/auth/users` | Admin | Get all users |
| GET | `/api/auth/stats` | Admin | Get user statistics |

### Expense Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/expenses` | Yes | Get all user's expenses (limit 200) |
| GET | `/api/expenses/:id` | Yes | Get single expense |
| POST | `/api/expenses` | Yes | Create new expense |
| PUT | `/api/expenses/:id` | Yes | Update expense |
| DELETE | `/api/expenses/:id` | Yes | Delete expense |

### Category Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Yes | Get all user's categories |
| POST | `/api/categories` | Yes | Create new category |
| PUT | `/api/categories/:name` | Yes | Update category name |
| DELETE | `/api/categories/:name` | Yes | Delete category |

### Payment Source Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payment-sources` | Yes | Get all user's payment sources |
| POST | `/api/payment-sources` | Yes | Create new payment source |
| PUT | `/api/payment-sources/:name` | Yes | Update payment source name |
| DELETE | `/api/payment-sources/:name` | Yes | Delete payment source |

### Quick Add Items Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/quick-add-items` | Yes | Get all user's quick add items |
| POST | `/api/quick-add-items` | Yes | Create new quick add item |
| PUT | `/api/quick-add-items/:id` | Yes | Update quick add item |
| DELETE | `/api/quick-add-items/:id` | Yes | Delete quick add item |

### Backup & Restore

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/backup` | Yes | Export all user data (JSON) |
| POST | `/api/restore` | Yes | Import data (overwrites existing) |

### Push Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/subscribe` | Yes | Subscribe to push notifications |
| POST | `/api/unsubscribe` | Yes | Unsubscribe from push notifications |
| POST | `/api/push-notification` | Yes | Send push notification |

---

## Frontend Components

### Global Components (Registered in app.js)

#### `MobileTopBar`
**Location**: `public/components/MobileTopBar.js`

**Purpose**: Top navigation bar dengan back button dan dropdown menu

**Features**:
- Dynamic page title berdasarkan route
- Back button (conditional based on route)
- Dropdown menu dengan 4 items:
  - Quick Add Items
  - Categories
  - Payment Sources
  - Settings

**Usage**:
```html
<mobile-top-bar></mobile-top-bar>
```

**Props**: None (uses `this.$route` internally)

---

#### `MobileBottomNav`
**Location**: `public/components/MobileBottomNav.js`

**Purpose**: Bottom navigation dengan 3 items + FAB

**Features**:
- Home (Dashboard)
- Add (FAB - navigates to dashboard with `?action=add`)
- Profile
- Active state highlighting
- Safe area support

**Usage**:
```html
<mobile-bottom-nav v-if="!showModal"></mobile-bottom-nav>
```

**Events**:
- Emits global event `show-add-expense` saat FAB diklik

---

### View Components

#### `DashboardViewMobile`
**Location**: `public/views/DashboardViewMobile.js`

**Purpose**: Main dashboard dengan expense list dan statistics

**Key Features**:
- 4 statistic cards (swipeable):
  - Total Today
  - Total This Month
  - Top Category
  - Top Payment Source
- Filter tabs (All, Today, Yesterday, This Week, This Month)
- Expense list dengan swipe-to-delete
- Quick Add modal (FAB button dengan icon petir ⚡)
- Add/Edit expense modal (bottom sheet)
- Pull-to-refresh
- **Back button handling**:
  - Priority 1: Close modal if open
  - Priority 2: Double-tap to exit (2 second window)

**Data**:
```javascript
{
  expenses: [],
  categories: [],
  paymentSources: [],
  quickAddItems: [],
  filter: 'all',
  showExpenseModal: false,
  showQuickAddModal: false,
  selectedExpense: null,
  formData: { ... },
  lastBackPress: 0,  // For double-tap exit
  backPressTimeout: null
}
```

**Methods**:
- `loadData()` - Fetch expenses, categories, sources, quick items
- `useQuickAddItem(item)` - Create expense from quick add template
- `saveExpense()` - Create/update expense
- `deleteCurrentExpense()` - Delete selected expense
- `setupBackButtonHandler()` - Browser back button handling
- `setupPullToRefresh()` - Touch gesture for refresh

**Browser History Management**:
- Modals push state to history when opened
- Back button closes modals first
- Double-tap on dashboard shows "Press again to exit" notification

---

#### `QuickAddView`
**Location**: `public/views/QuickAddView.js`

**Purpose**: Manage quick add templates untuk input cepat

**Features**:
- CRUD quick add items
- Each item contains: name, amount, category, payment_source, store
- One-tap creation dari dashboard

---

#### Auth Views
- **LoginView**: Login form dengan error handling
- **SignupView**: Registration form
- **ForgotPasswordView**: Request password reset
- **ResetPasswordView**: Reset password dengan token

**Enhanced Error Handling** (LoginView & SignupView):
```javascript
catch (error) {
  const errorMessage = error.message || this.t('loginFailed') || 'Login gagal';
  this.error = errorMessage;
  this.$root.showNotification(errorMessage, 'error');
}
```

---

## State Management

### Global State (Root Instance)

```javascript
// app.js
{
  currentUser: null,        // User object dari server
  darkMode: false,          // Dark mode state
  language: 'id',           // 'id' atau 'en'
  isOnline: true,           // Network status
  notifications: [],        // Toast notifications
  events: {}                // Simple event emitter
}
```

### LocalStorage

```javascript
// Stored data
{
  'token': 'jwt-token-string',
  'user': '{"_id":"...","name":"...","email":"..."}',
  'darkMode': 'true' | 'false',
  'language': 'id' | 'en'
}
```

### Methods Available Globally

```javascript
// Translation
this.$root.t(key)

// Notifications
this.$root.showNotification(message, type) // type: success, error, warning, info

// Event Bus
this.$root.$on(event, callback)
this.$root.$emit(event, ...args)
this.$root.$off(event, callback)

// Logout
this.$root.logout()
```

---

## Routing

### Router Configuration
**File**: `public/router/index.js`

**Mode**: Hash-based (`createWebHashHistory()`)

**Navigation Guards**:
```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});
```

### Routes

| Path | Component | Meta | Description |
|------|-----------|------|-------------|
| `/` | - | - | Redirect to `/dashboard` |
| `/login` | LoginView | `requiresGuest` | Login page |
| `/signup` | SignupView | `requiresGuest` | Signup page |
| `/forgot-password` | ForgotPasswordView | `requiresGuest` | Forgot password |
| `/reset-password/:token` | ResetPasswordView | `requiresGuest` | Reset password |
| `/dashboard` | DashboardViewMobile | `requiresAuth` | Main dashboard |
| `/profile` | ProfileView | `requiresAuth` | User profile |
| `/categories` | CategoriesView | `requiresAuth` | Manage categories |
| `/payment-sources` | PaymentSourcesView | `requiresAuth` | Manage payment sources |
| `/quick-add` | QuickAddView | `requiresAuth` | Manage quick add items |
| `/settings` | SettingsView | `requiresAuth` | App settings |

---

## Authentication Flow

### 1. Signup
```
User fills signup form
  → POST /api/auth/signup { name, email, password }
  → Server hashes password, creates user
  → Returns { token, user }
  → Frontend stores token & user in localStorage
  → Update this.$root.currentUser
  → Redirect to /dashboard
```

### 2. Login
```
User fills login form
  → POST /api/auth/login { email, password }
  → Server verifies credentials
  → Returns { token, user }
  → Frontend stores token & user
  → Update this.$root.currentUser
  → Redirect to /dashboard
```

### 3. Protected Routes
```
User navigates to protected route
  → Router beforeEach checks localStorage.token
  → If no token: redirect to /login
  → If token exists: allow navigation
  → API requests include: Authorization: Bearer <token>
```

### 4. Logout
```
User clicks logout
  → localStorage.removeItem('token')
  → localStorage.removeItem('user')
  → this.$root.currentUser = null
  → router.push('/login')
```

---

## Mobile-First Features

### 1. Touch Gestures

#### Pull-to-Refresh
```javascript
// DashboardViewMobile.js
setupPullToRefresh() {
  // Detect touch start at top of page
  // If pull down > 100px → trigger refresh
}
```

#### Swipe-to-Delete
```javascript
// DashboardViewMobile.js
handleTouchStart/Move/End() {
  // Swipe left > 60px → show delete confirmation
}
```

### 2. Bottom Sheet Modals

**Implementation**:
- Fixed position at bottom
- Slide-up animation
- Backdrop (dark overlay)
- Handle bar for visual affordance
- Max height 85vh with scroll

**Example**:
```html
<transition name="slide-up">
  <div v-if="showModal" class="fixed inset-0 z-[60] flex items-end">
    <div @click="closeModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
      <!-- Handle Bar -->
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
      <!-- Content -->
    </div>
  </div>
</transition>
```

### 3. Safe Area Support

```css
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 4. Back Button Handling

**File**: `DashboardViewMobile.js`

**Logic**:
1. If expense modal open → close modal
2. If quick add modal open → close modal
3. If on dashboard (no modals):
   - First back press → Show notification "Press again to exit"
   - Second back press (within 2s) → Allow exit
   - After 2s → Reset counter

**Implementation**:
```javascript
setupBackButtonHandler() {
  window.addEventListener('popstate', (event) => {
    // Check modals first
    if (this.showExpenseModal) {
      this.closeExpenseModal();
      return;
    }
    
    // Double-tap to exit
    const currentTime = Date.now();
    if (currentTime - this.lastBackPress < 2000) {
      // Allow exit
      return;
    } else {
      // Show notification
      this.$root.showNotification('Tekan sekali lagi untuk keluar', 'info');
      this.lastBackPress = currentTime;
      window.history.pushState({ dashboard: true }, '');
    }
  });
}
```

### 5. FAB (Floating Action Button)

**Two Types**:

1. **Add Expense** (Bottom Nav):
   - Icon: `fa-plus`
   - Position: Center of bottom nav (elevated)
   - Action: Navigate to `/dashboard?action=add`

2. **Quick Add** (Dashboard FAB):
   - Icon: `fa-bolt` (lightning)
   - Position: Right bottom (above bottom nav)
   - Gradient: Purple to Indigo
   - Action: Open quick add modal

---

## Translation System (i18n)

### File
`public/utils/i18n.js`

### Structure
```javascript
const translations = {
  id: {
    // Indonesian translations
    loginTitle: "Masuk ke Akun Anda",
    // ... ~150 keys
  },
  en: {
    // English translations
    loginTitle: "Login to Your Account",
    // ... ~150 keys
  }
};
```

### Usage

**In Components**:
```javascript
methods: {
  t(key) {
    return this.$root.t(key);
  }
}

// Template
{{ t('loginTitle') }}
```

**With Fallback**:
```javascript
{{ t('loginTitle') || 'Default Text' }}
```

### Key Categories

1. **Auth**: login, signup, password, etc.
2. **Dashboard**: statistics, filters, items
3. **Expense**: form fields, actions
4. **Navigation**: home, settings, profile
5. **Categories**: manage categories
6. **Payment Sources**: manage payment sources
7. **Profile**: user info, account management
8. **Quick Add**: quick add items management
9. **Settings**: app settings, preferences
10. **Messages**: success, error, confirmations

### Language Switching

```javascript
// SettingsView.js
changeLanguage() {
  this.$root.language = this.selectedLanguage;
  localStorage.setItem('language', this.selectedLanguage);
  this.$root.showNotification(
    this.t('languageChanged') || 'Language changed',
    'success'
  );
}
```

---

## Recent Changes

### November 28, 2025

#### 1. Component Cleanup
- ❌ Removed `Navbar.js` (replaced by MobileTopBar)
- ❌ Removed `ExpenseList.js` (inline in DashboardViewMobile)
- ❌ Removed `ExpenseForm.js` (inline in DashboardViewMobile)
- ✅ Kept `MobileTopBar.js` and `MobileBottomNav.js`

#### 2. Navigation Restructure
- Bottom nav: 3 items only (Home, Add FAB, Profile)
- Top bar dropdown: Quick Add, Categories, Payment Sources, Settings
- Cleaner mobile navigation hierarchy

#### 3. FAB Functionality Change
**Before**: Opens empty expense form

**After**: Opens Quick Add modal
- Shows list of pre-configured expense templates
- One-tap expense creation
- Empty state redirects to Quick Add management

#### 4. Back Button Handling
- Modal-aware navigation (close modal first)
- Double-tap to exit from dashboard
- Browser history management for modals
- Translation key: `pressBackAgainToExit`

#### 5. Enhanced Error Handling
**API Client** (`utils/api.js`):
- Safe JSON parsing
- Detailed error objects (message, status, data)
- Network error detection
- Multiple error message fallbacks

**Views** (LoginView, SignupView):
- Display server error messages directly
- Dual notification (inline + toast)
- Better UX for failed requests

#### 6. i18n Cleanup
- Removed ~80 unused translation keys
- Kept only actively used translations
- File size reduced: 401 → 345 lines
- Both Indonesian and English cleaned

#### 7. State Management Cleanup
- Removed redundant auth states from root
- Simplified to `currentUser` only
- Token managed via localStorage + API client

---

## Known Issues & TODOs

### High Priority
- [ ] Service Worker implementation untuk PWA
- [ ] Offline mode support (IndexedDB caching)
- [ ] Push notifications setup
- [ ] Image upload untuk profile photo
- [ ] Export/Import data UI

### Medium Priority
- [ ] Search & advanced filtering di expenses
- [ ] Expense categories dengan icons
- [ ] Monthly budget tracking
- [ ] Charts & visualizations
- [ ] Recurring expenses setup

### Low Priority
- [ ] Multi-currency support
- [ ] Receipt photo attachment
- [ ] Export to Excel/PDF
- [ ] Email notifications
- [ ] Social login (Google/Facebook)

### Code Quality
- [ ] Add unit tests (Vitest/Jest)
- [ ] Add E2E tests (Cypress/Playwright)
- [ ] TypeScript migration consideration
- [ ] Performance optimization (virtual scrolling)
- [ ] Accessibility audit (ARIA labels)

---

## Development Workflow

### 1. Starting Development

```bash
# Backend
cd expense-app-vue
npm install
npm run dev  # or: nodemon server.js

# Frontend
# Open http://localhost:3000 in browser
# No build step required (CDN-based)
```

### 2. Making Changes

**Frontend** (Hot reload via browser refresh):
1. Edit files in `public/`
2. Refresh browser
3. Check console for errors

**Backend** (Auto-reload via nodemon):
1. Edit files in root, `models/`, `controllers/`, `middlewares/`
2. Nodemon auto-restarts
3. Check terminal for logs

### 3. Adding New Features

**New API Endpoint**:
1. Add route in `server.js`
2. Add validation in `middlewares/validation.js`
3. Add controller logic (if complex)
4. Update this docs

**New View**:
1. Create `public/views/NewView.js`
2. Register route in `public/router/index.js`
3. Add to `public/index.html` scripts
4. Add translations in `public/utils/i18n.js`

**New Component**:
1. Create `public/components/NewComponent.js`
2. Register in `public/app.js`
3. Add to `public/index.html` scripts

### 4. Testing

**Manual Testing Checklist**:
- [ ] Login/Signup flow
- [ ] Create/Edit/Delete expense
- [ ] Quick Add workflow
- [ ] Category management
- [ ] Payment source management
- [ ] Language switching
- [ ] Dark mode toggle
- [ ] Mobile gestures (swipe, pull-to-refresh)
- [ ] Back button behavior
- [ ] Offline behavior (disconnect network)

---

## Environment Variables

Create `.env` file in root:

```env
# Database
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_CLUSTER=your_cluster.mongodb.net
DB_NAME=expense_app

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_very_long_random_secret_key
JWT_EXPIRES_IN=30d

# Email (for password reset)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@expense-app.com

# VAPID Keys (for push notifications)
VAPID_PUBLIC_KEY=your_public_vapid_key
VAPID_PRIVATE_KEY=your_private_vapid_key
```

---

## Quick Reference

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# View logs
tail -f logs/app.log
```

### Important URLs (Development)

- **App**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Login**: http://localhost:3000/#/login
- **Dashboard**: http://localhost:3000/#/dashboard

### Common Git Workflows

```bash
# Current branch
git status

# Commit changes
git add .
git commit -m "feat: description"

# Push to remote
git push origin feat/vue-app

# Pull latest
git pull origin feat/vue-app
```

---

## Support & Resources

### Internal Docs
- `docs/API_REFERENCE.md` - Detailed API documentation
- `docs/MOBILE_SUMMARY.md` - Mobile features summary
- `README.md` - Project overview

### External Resources
- [Vue.js 3 Docs](https://vuejs.org/guide/introduction.html)
- [Vue Router 4 Docs](https://router.vuejs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

---

## Notes for AI Assistant

### Context Restoration Checklist
When starting a new session, review:
1. ✅ This guide (DEVELOPMENT_GUIDE.md)
2. ✅ Recent changes section
3. ✅ Known issues & TODOs
4. ✅ Current branch: `feat/vue-app`
5. ✅ Tech stack (CDN-based Vue, no build tools)

### Key Patterns to Remember
- **No Build Tools**: Everything via CDN, edit and refresh
- **Mobile-First**: All components optimized for mobile
- **User-Scoped Data**: Every model has `user` field
- **Hash Routing**: URLs use `#/path` format
- **Global State**: Via root instance, not Vuex/Pinia
- **Translation**: Always use `t()` function with fallback
- **Error Handling**: Server messages displayed directly to user

### Common Tasks
1. **Adding Translation**: Update `utils/i18n.js` (both `id` and `en`)
2. **New API Endpoint**: Update `server.js`, `api.js`, and docs
3. **New View**: Create file, add route, register in index.html
4. **Styling**: Use Tailwind classes, check dark mode variant

---

**End of Development Guide**

*Last Updated: November 28, 2025*
*Maintained by: Development Team*
