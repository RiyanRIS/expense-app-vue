# 🔐 AUTHENTICATION IMPLEMENTATION GUIDE

## Status: IN PROGRESS

Ini adalah panduan implementasi Authentication & Authorization dengan JWT untuk Expense App.

## ✅ Yang Sudah Dibuat (Backend)

### 1. Dependencies Installed
```bash
npm install jsonwebtoken bcryptjs
```

### 2. User Model (`models/User.js`)
- Schema lengkap dengan email, password, name, role, status
- Password hashing otomatis dengan bcrypt
- Instance methods: `comparePassword()`, `changedPasswordAfter()`, `createPasswordResetToken()`
- Static methods: `findActiveByEmail()`, `getStats()`

### 3. Auth Middleware (`middlewares/auth.js`)
- `protect` - Require authentication
- `restrictTo(...roles)` - Role-based access control
- `optionalAuth` - Optional authentication
- `checkOwnership` - Resource ownership validation
- `sendTokenResponse` - Helper untuk send JWT token

### 4. Auth Controller (`controllers/authController.js`)
- `signup` - Register new user
- `login` - Login user
- `logout` - Logout user
- `getMe` - Get current user
- `updateProfile` - Update user profile
- `changePassword` - Change password
- `deleteAccount` - Soft delete account
- `getAllUsers` - Get all users (Admin)
- `getUserStats` - Get user statistics (Admin)

### 5. Updated Expense Model
- Added `user` field (reference to User)
- Added indexes untuk optimize queries
- Added timestamps

## 🔧 Backend Setup Required

### 1. Update `.env` file
```env
# Existing vars...
DB_USERNAME=your_username
DB_PASSWORD=your_password
# ... etc

# ADD THESE:
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
NODE_ENV=development
```

**IMPORTANT:** Generate secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Complete Server.js Protection

All routes need to be wrapped with `protect` middleware and use `asyncHandler`.

Example struktur:
```javascript
// Public routes
app.post("/api/auth/signup", authController.signup);
app.post("/api/auth/login", authController.login);

// Protected routes
app.get("/api/expenses", protect, asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.userId });
  res.json(expenses);
}));

app.post("/api/expenses", protect, validateCreateExpense, asyncHandler(async (req, res) => {
  const payload = { ...req.body, user: req.userId };
  const expense = new Expense(payload);
  await expense.save();
  res.status(201).json(expense);
}));
```

## 🎨 Frontend Implementation (Vue.js)

### 1. Auth State Management (app.js)

Add to `data()`:
```javascript
data() {
  return {
    // Existing data...
    
    // Auth state
    isAuthenticated: false,
    currentUser: null,
    authToken: null,
    authLoading: false,
    authError: null,
  }
}
```

Add to `methods`:
```javascript
methods: {
  // Auth methods
  async signup(name, email, password, passwordConfirm) {
    this.authLoading = true;
    this.authError = null;
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, passwordConfirm })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Signup failed');
      }
      
      this.authToken = data.token;
      this.currentUser = data.user;
      this.isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      this.showToast('Account created successfully!', 'success');
      this.changeTab('home');
      
      return true;
    } catch (error) {
      this.authError = error.message;
      this.showToast(error.message, 'error');
      return false;
    } finally {
      this.authLoading = false;
    }
  },
  
  async login(email, password) {
    this.authLoading = true;
    this.authError = null;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }
      
      this.authToken = data.token;
      this.currentUser = data.user;
      this.isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      this.showToast('Welcome back!', 'success');
      this.changeTab('home');
      
      // Refresh data
      await this.fetchExpenses();
      
      return true;
    } catch (error) {
      this.authError = error.message;
      this.showToast(error.message, 'error');
      return false;
    } finally {
      this.authLoading = false;
    }
  },
  
  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear state
    this.authToken = null;
    this.currentUser = null;
    this.isAuthenticated = false;
    this.expenses = [];
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    this.showToast('Logged out successfully', 'info');
    this.changeTab('login');
  },
  
  // Check if user is logged in on mount
  checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        this.authToken = token;
        this.currentUser = JSON.parse(user);
        this.isAuthenticated = true;
      } catch (error) {
        // Invalid data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
  
  // Helper: Get auth headers
  getAuthHeaders() {
    if (!this.authToken) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    };
  },
}
```

Update `mounted()`:
```javascript
mounted() {
  // Check authentication first
  this.checkAuth();
  
  // Only load data if authenticated
  if (this.isAuthenticated) {
    this.fetchExpenses();
    this.fetchCategories();
    this.fetchPaymentSources();
  } else {
    this.changeTab('login');
  }
  
  // Rest of mounted code...
}
```

Update API calls to include auth header:
```javascript
async fetchExpenses() {
  if (!this.isAuthenticated) return;
  
  this.loadingExpenses = true;
  try {
    const response = await fetch("/api/expenses", {
      headers: this.getAuthHeaders()
    });
    
    if (response.status === 401) {
      this.logout();
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    this.expenses = data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    this.haptic("error");
  } finally {
    this.loadingExpenses = false;
  }
},
```

### 2. Login Page (index.html)

Add login tab section:
```html
<main v-if="currentTab==='login'" class="space-y-4">
  <!-- Login Form -->
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
    <div class="text-center mb-6">
      <i class="fas fa-wallet text-5xl mb-4" :class="accentTextClass"></i>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('loginTitle') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ t('loginSubtitle') }}
      </p>
    </div>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          v-model="loginForm.email"
          type="email"
          required
          class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="your@email.com"
          autocomplete="email"
        />
      </div>
      
      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          v-model="loginForm.password"
          type="password"
          required
          class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="••••••••"
          autocomplete="current-password"
        />
      </div>
      
      <!-- Error Message -->
      <div v-if="authError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-400">
          <i class="fas fa-exclamation-circle mr-2"></i>{{ authError }}
        </p>
      </div>
      
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authLoading"
        :class="[accentBgClass, 'w-full text-white py-3 rounded-lg font-medium transition-opacity', authLoading ? 'opacity-50 cursor-not-allowed' : '']"
      >
        <i v-if="authLoading" class="fas fa-spinner fa-spin mr-2"></i>
        {{ authLoading ? t('loggingIn') : t('login') }}
      </button>
    </form>
    
    <!-- Signup Link -->
    <div class="mt-6 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('noAccount') }}
        <button @click="changeTab('signup')" :class="[accentTextClass, 'font-medium']">
          {{ t('signupNow') }}
        </button>
      </p>
    </div>
  </div>
</main>
```

### 3. Signup Page (index.html)

Add signup tab section:
```html
<main v-if="currentTab==='signup'" class="space-y-4">
  <!-- Signup Form -->
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
    <div class="text-center mb-6">
      <i class="fas fa-user-plus text-5xl mb-4" :class="accentTextClass"></i>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('createAccount') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ t('signupSubtitle') }}
      </p>
    </div>
    
    <form @submit.prevent="handleSignup" class="space-y-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('fullName') }}
        </label>
        <input
          v-model="signupForm.name"
          type="text"
          required
          minlength="2"
          class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          :placeholder="t('fullNamePlaceholder')"
          autocomplete="name"
        />
      </div>
      
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          v-model="signupForm.email"
          type="email"
          required
          class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="your@email.com"
          autocomplete="email"
        />
      </div>
      
      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          v-model="signupForm.password"
          type="password"
          required
          minlength="6"
          class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="••••••••"
          autocomplete="new-password"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ t('passwordRequirement') }}
        </p>
      </div>
      
      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('confirmPassword') }}
        </label>
        <input
          v-model="signupForm.passwordConfirm"
          type="password"
          required
          minlength="6"
          class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="••••••••"
          autocomplete="new-password"
        />
      </div>
      
      <!-- Error Message -->
      <div v-if="authError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-400">
          <i class="fas fa-exclamation-circle mr-2"></i>{{ authError }}
        </p>
      </div>
      
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authLoading"
        :class="[accentBgClass, 'w-full text-white py-3 rounded-lg font-medium transition-opacity', authLoading ? 'opacity-50 cursor-not-allowed' : '']"
      >
        <i v-if="authLoading" class="fas fa-spinner fa-spin mr-2"></i>
        {{ authLoading ? t('creatingAccount') : t('createAccount') }}
      </button>
    </form>
    
    <!-- Login Link -->
    <div class="mt-6 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('haveAccount') }}
        <button @click="changeTab('login')" :class="[accentTextClass, 'font-medium']">
          {{ t('loginNow') }}
        </button>
      </p>
    </div>
  </div>
</main>
```

### 4. Add Translations

Update translations object in app.js:
```javascript
translations: {
  id: {
    // Auth
    loginTitle: "Masuk ke Akun Anda",
    loginSubtitle: "Kelola pengeluaran Anda dengan mudah",
    login: "Masuk",
    loggingIn: "Memproses...",
    noAccount: "Belum punya akun?",
    signupNow: "Daftar Sekarang",
    
    createAccount: "Buat Akun Baru",
    signupSubtitle: "Mulai kelola keuangan Anda hari ini",
    fullName: "Nama Lengkap",
    fullNamePlaceholder: "John Doe",
    confirmPassword: "Konfirmasi Password",
    passwordRequirement: "Minimal 6 karakter",
    creatingAccount: "Membuat akun...",
    haveAccount: "Sudah punya akun?",
    loginNow: "Masuk Sekarang",
    
    // Existing translations...
  },
  en: {
    // Auth
    loginTitle: "Login to Your Account",
    loginSubtitle: "Manage your expenses easily",
    login: "Login",
    loggingIn: "Processing...",
    noAccount: "Don't have an account?",
    signupNow: "Sign Up Now",
    
    createAccount: "Create New Account",
    signupSubtitle: "Start managing your finances today",
    fullName: "Full Name",
    fullNamePlaceholder: "John Doe",
    confirmPassword: "Confirm Password",
    passwordRequirement: "Minimum 6 characters",
    creatingAccount: "Creating account...",
    haveAccount: "Already have an account?",
    loginNow: "Login Now",
    
    // Existing translations...
  }
}
```

### 5. Bottom Navigation Update

Update navigation to show login/signup when not authenticated:
```html
<nav v-if="!isAuthenticated" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 pb-safe">
  <div class="max-w-xl mx-auto flex justify-around py-2">
    <button
      @click="changeTab('login')"
      :class="['flex flex-col items-center px-4 py-2', currentTab==='login' ? accentTextClass : 'text-gray-600 dark:text-gray-400']"
    >
      <i class="fas fa-sign-in-alt text-xl"></i>
      <span class="text-xs mt-1">{{ t('login') }}</span>
    </button>
    <button
      @click="changeTab('signup')"
      :class="['flex flex-col items-center px-4 py-2', currentTab==='signup' ? accentTextClass : 'text-gray-600 dark:text-gray-400']"
    >
      <i class="fas fa-user-plus text-xl"></i>
      <span class="text-xs mt-1">{{ t('signup') }}</span>
    </button>
  </div>
</nav>
```

## 📝 TODO: Complete Implementation

1. Fix all server.js routes to use `protect` and `asyncHandler`
2. Add login/signup forms to index.html
3. Update app.js with auth state and methods
4. Test signup flow
5. Test login flow
6. Test protected routes
7. Update dokumentasi

## 🚀 Quick Start

1. Add JWT_SECRET to `.env`
2. Restart server
3. Test auth endpoints with Postman
4. Implement frontend auth pages
5. Test full flow

---

**Status:** Backend 80% Complete, Frontend Pending
**Next:** Complete frontend auth pages implementation
