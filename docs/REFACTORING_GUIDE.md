# Panduan Refactoring Vue.js ke Struktur Modular

## 📁 Struktur Folder Baru

```
public/
├── components/          # Reusable components
│   ├── ExpenseList.js
│   ├── ExpenseForm.js
│   ├── CategoryManager.js
│   ├── PaymentSourceManager.js
│   ├── QuickAddManager.js
│   └── Navbar.js
├── views/              # Page components (route views)
│   ├── LoginView.js
│   ├── SignupView.js
│   ├── ForgotPasswordView.js
│   ├── ResetPasswordView.js
│   ├── DashboardView.js
│   ├── ProfileView.js
│   ├── CategoriesView.js
│   ├── PaymentSourcesView.js
│   ├── QuickAddView.js
│   └── SettingsView.js
├── router/             # Vue Router configuration
│   └── index.js
├── utils/              # Utility functions
│   ├── api.js         # API client
│   ├── i18n.js        # Internationalization
│   └── helpers.js     # Helper functions
├── composables/        # Vue 3 composition functions
│   ├── useAuth.js
│   ├── useExpenses.js
│   └── useNotifications.js
├── app.js             # Main app (refactored)
└── index.html         # Entry point (updated)
```

## 🚀 Langkah-Langkah Implementasi

### 1. Install Vue Router via CDN

Tambahkan di `index.html` sebelum script app.js:

```html
<script src="https://unpkg.com/vue-router@4"></script>
```

### 2. Update index.html

Ubah struktur HTML utama untuk menggunakan `<router-view>`:

```html
<div id="app">
  <router-view></router-view>
</div>

<!-- Load dependencies -->
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<!-- Load utilities first -->
<script src="/utils/api.js"></script>
<script src="/utils/i18n.js"></script>
<script src="/utils/helpers.js"></script>

<!-- Load components -->
<script src="/components/Navbar.js"></script>
<script src="/components/ExpenseList.js"></script>
<script src="/components/ExpenseForm.js"></script>
<!-- ... other components -->

<!-- Load views -->
<script src="/views/LoginView.js"></script>
<script src="/views/SignupView.js"></script>
<script src="/views/DashboardView.js"></script>
<!-- ... other views -->

<!-- Load router -->
<script src="/router/index.js"></script>

<!-- Load main app -->
<script src="/app.js"></script>
```

### 3. Refactor app.js

Ubah app.js menjadi:

```javascript
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
      currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
      authToken: localStorage.getItem('token'),
      darkMode: localStorage.getItem('darkMode') === 'true',
      currentLang: localStorage.getItem('language') || 'id'
    };
  },

  created() {
    // Check authentication on app start
    this.checkAuth();
    
    // Setup dark mode
    this.initDarkMode();
    
    // Check online status
    this.setupOnlineListener();
  },

  methods: {
    async checkAuth() {
      if (this.authToken) {
        try {
          const response = await apiClient.auth.getMe();
          this.currentUser = response.user;
          this.isAuthenticated = true;
        } catch (error) {
          // Token invalid, logout
          this.logout();
        }
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isAuthenticated = false;
      this.currentUser = null;
      this.authToken = null;
      this.$router.push('/login');
    },

    t(key) {
      return translations[this.currentLang]?.[key] || key;
    },

    showNotification(message, type = 'info') {
      // Implement notification logic
      console.log(`[${type}] ${message}`);
    },

    initDarkMode() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
      }
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      document.documentElement.classList.toggle('dark');
    },

    setupOnlineListener() {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncOfflineData();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    },

    async syncOfflineData() {
      // Sync offline data logic
    }
  }
});

// Register components
app.component('Navbar', Navbar);
app.component('ExpenseList', ExpenseList);
app.component('ExpenseForm', ExpenseForm);
// ... register other components

// Create and use router
const router = createRouter({
  LoginView,
  SignupView,
  ForgotPasswordView,
  ResetPasswordView,
  DashboardView,
  ProfileView,
  CategoriesView,
  PaymentSourcesView,
  QuickAddView,
  SettingsView
});

app.use(router);

// Mount app
app.mount('#app');
```

### 4. Komponen yang Sudah Dibuat

✅ **Router Configuration** (`router/index.js`)
- Setup routes dengan navigation guards
- Protected routes untuk authenticated users
- Guest routes untuk login/signup

✅ **API Client** (`utils/api.js`)
- Centralized API calls
- Auth endpoints
- Expenses CRUD
- Categories, Payment Sources, Quick Add Items
- Backup & Restore

✅ **Login View** (`views/LoginView.js`)
- Login form dengan validasi
- Error handling
- Redirect ke dashboard setelah login

✅ **Signup View** (`views/SignupView.js`)
- Registration form
- Password confirmation
- Auto-login setelah signup

### 5. Komponen yang Perlu Dibuat

⏳ **ForgotPasswordView.js**
⏳ **ResetPasswordView.js**
⏳ **DashboardView.js** (halaman utama dengan expense list)
⏳ **ProfileView.js** (manajemen profil user)
⏳ **CategoriesView.js** (kelola kategori)
⏳ **PaymentSourcesView.js** (kelola sumber dana)
⏳ **QuickAddView.js** (kelola quick add items)
⏳ **SettingsView.js** (pengaturan aplikasi)

⏳ **Navbar.js** (navigasi component)
⏳ **ExpenseList.js** (daftar expense)
⏳ **ExpenseForm.js** (form tambah/edit expense)
⏳ **CategoryManager.js** (kelola kategori component)
⏳ **PaymentSourceManager.js** (kelola payment source)
⏳ **QuickAddManager.js** (kelola quick add)

⏳ **i18n.js** (translations utility)
⏳ **helpers.js** (helper functions)

## 📝 Keuntungan Struktur Baru

### 1. **Separation of Concerns**
- Setiap komponen punya tanggung jawab spesifik
- Lebih mudah di-maintain dan di-debug
- Code lebih terorganisir

### 2. **Reusability**
- Komponen bisa digunakan ulang di berbagai halaman
- Mengurangi duplikasi kode

### 3. **Routing**
- URL-based navigation
- Back/forward browser button works
- Deep linking support
- Better UX

### 4. **State Management**
- Centralized auth state
- Easier to track data flow
- Better debugging

### 5. **Code Splitting**
- File lebih kecil dan modular
- Easier collaboration
- Better git diffs

### 6. **Testing**
- Easier to unit test individual components
- Isolated logic

### 7. **Scalability**
- Mudah menambah fitur baru
- Clear structure untuk team development

## 🔄 Migration Steps (Step by Step)

### Phase 1: Setup Infrastructure ✅
1. Create folder structure ✅
2. Create router configuration ✅
3. Create API client utility ✅
4. Create auth views (Login, Signup) ✅

### Phase 2: Core Components (In Progress)
1. Create ForgotPasswordView
2. Create ResetPasswordView
3. Create DashboardView
4. Create Navbar component
5. Create ExpenseList component
6. Create ExpenseForm component

### Phase 3: Feature Components
1. Create ProfileView
2. Create CategoriesView
3. Create PaymentSourcesView
4. Create QuickAddView
5. Create SettingsView

### Phase 4: Utilities & Composables
1. Extract i18n to separate file
2. Create helper functions
3. Create composables for reusable logic

### Phase 5: Testing & Optimization
1. Test all routes
2. Test authentication flow
3. Test offline functionality
4. Optimize performance

## 💡 Tips

1. **Import Order**: Load utilities → components → views → router → app
2. **Component Naming**: Use PascalCase for component names
3. **File Naming**: Match component name (LoginView.js exports LoginView)
4. **Router Links**: Use `<router-link>` instead of `<a>` for internal navigation
5. **Route Guards**: Protect routes dengan meta: { requiresAuth: true }

## 🐛 Common Issues

**Issue**: Components not found
**Solution**: Check script loading order in index.html

**Issue**: Router not working
**Solution**: Make sure Vue Router is loaded before app.js

**Issue**: Dark mode not working
**Solution**: Check document.documentElement.classList for 'dark' class

**Issue**: API calls failing
**Solution**: Check Authorization header and token in localStorage

## 📚 Next Steps

Apakah Anda ingin saya lanjutkan membuat:
1. DashboardView dengan ExpenseList dan ExpenseForm?
2. Profile dan Settings views?
3. Komponen lainnya?
4. Update index.html dan app.js yang sudah di-refactor?

Beri tahu saya komponen mana yang ingin dibuat terlebih dahulu!
