# Panduan Implementasi Modular Architecture

Dokumen ini menjelaskan langkah-langkah untuk mengimplementasikan arsitektur modular pada aplikasi expense-app-vue.

## ✅ Yang Sudah Selesai

1. **Folder Structure** - Folder components/, views/, router/, utils/ sudah dibuat
2. **Router Configuration** (`router/index.js`) - 11 routes dengan navigation guards
3. **API Client** (`utils/api.js`) - Centralized API dengan semua endpoints
4. **Internationalization** (`utils/i18n.js`) - Translations untuk ID dan EN
5. **Components**:
   - `components/Navbar.js` - Navigation bar
   - `components/ExpenseList.js` - Expense list dengan filters
   - `components/ExpenseForm.js` - Form untuk create/edit expenses
6. **Views** (10 halaman):
   - `views/LoginView.js` - Login page
   - `views/SignupView.js` - Registration page
   - `views/ForgotPasswordView.js` - Forgot password
   - `views/ResetPasswordView.js` - Reset password
   - `views/DashboardView.js` - Main dashboard
   - `views/ProfileView.js` - User profile
   - `views/CategoriesView.js` - Category management
   - `views/PaymentSourcesView.js` - Payment source management
   - `views/QuickAddView.js` - Quick add items management
   - `views/SettingsView.js` - Application settings

## 🔄 Langkah Implementasi

### Step 1: Backup File Lama

File backup sudah dibuat:
- `public/index-old.html` - Backup HTML lama
- `public/app-old.js` - Backup JavaScript lama

### Step 2: Update index.html

File `index.html` sudah diupdate dengan:
- Router-view sebagai container
- Script imports untuk semua komponen
- Script order yang benar

### Step 3: Update app.js

**PENTING:** File `app.js` saat ini masih menggunakan kode lama.

Untuk mengaktifkan arsitektur modular, **ganti isi `app.js` dengan isi file `app-new.js`**:

```powershell
# Di PowerShell:
cd c:\laragon\www\expense-app-vue\public
Remove-Item app.js -Force
Rename-Item app-new.js app.js
```

Atau manual:
1. Buka `public/app-new.js`
2. Copy seluruh isinya
3. Buka `public/app.js`
4. Replace seluruh isinya dengan kode dari `app-new.js`
5. Save file

### Step 4: Test Aplikasi

1. **Start server** (jika belum running):
   ```powershell
   cd c:\laragon\www\expense-app-vue
   node server.js
   ```

2. **Buka di browser**:
   ```
   http://localhost:3000
   ```

3. **Test flow berikut**:
   - ✅ Login page muncul (default route)
   - ✅ Bisa signup akun baru
   - ✅ Bisa login
   - ✅ Redirect ke dashboard setelah login
   - ✅ Navbar muncul dan navigasi berfungsi
   - ✅ CRUD expenses berfungsi
   - ✅ CRUD categories berfungsi
   - ✅ CRUD payment sources berfungsi
   - ✅ Quick add items berfungsi
   - ✅ Settings (dark mode, language) berfungsi
   - ✅ Profile update berfungsi
   - ✅ Logout redirect ke login

## 🎯 Struktur File Baru

```
public/
├── index.html                    ← Updated dengan router-view
├── app.js                        ← Will be minimal router app (use app-new.js)
├── app-new.js                    ← New minimal app (ready to use)
│
├── router/
│   └── index.js                  ← Vue Router configuration
│
├── utils/
│   ├── api.js                    ← API client
│   └── i18n.js                   ← Translations
│
├── components/
│   ├── Navbar.js                 ← Navigation component
│   ├── ExpenseList.js            ← Expense list component
│   └── ExpenseForm.js            ← Expense form component
│
└── views/
    ├── LoginView.js              ← Login page
    ├── SignupView.js             ← Signup page
    ├── ForgotPasswordView.js     ← Forgot password page
    ├── ResetPasswordView.js      ← Reset password page
    ├── DashboardView.js          ← Main dashboard
    ├── ProfileView.js            ← Profile page
    ├── CategoriesView.js         ← Categories management
    ├── PaymentSourcesView.js     ← Payment sources management
    ├── QuickAddView.js           ← Quick add items management
    └── SettingsView.js           ← Settings page
```

## 📝 Script Loading Order (Sudah di index.html)

Urutan loading script sangat penting:

1. **Vue.js** - Framework core
2. **Vue Router** - Routing library
3. **Utilities** (api.js, i18n.js)
4. **Components** (Navbar, ExpenseList, ExpenseForm)
5. **Views** (semua view components)
6. **Router config** (router/index.js)
7. **App** (app.js) - Inisialisasi aplikasi

## 🐛 Troubleshooting

### Error: "router is not defined"

**Penyebab:** File `router/index.js` belum loaded atau ada error di dalamnya

**Solusi:**
1. Check console browser untuk error loading
2. Pastikan `router/index.js` ada dan bisa diakses
3. Check urutan script di `index.html`

### Error: "Navbar is not defined"

**Penyebab:** Component belum loaded

**Solusi:**
1. Check apakah file component ada
2. Check urutan script (components harus sebelum views)
3. Check nama component di `app.component('navbar', Navbar)`

### Halaman Blank Setelah Login

**Penyebab:** Router guard tidak detect authentication

**Solusi:**
1. Check localStorage ada token: `localStorage.getItem('token')`
2. Check router/index.js navigation guard
3. Buka console browser untuk error

### Styles Tidak Muncul

**Penyebab:** Tailwind atau dark mode tidak aktif

**Solusi:**
1. Hard refresh browser (Ctrl+F5)
2. Check `document.documentElement.classList` contains 'dark'
3. Check Tailwind CSS loaded

## 🎨 Customization

### Menambah Route Baru

1. Buat view component di `views/`:
   ```javascript
   const NewView = {
     template: `<div>...</div>`,
     // ...
   };
   ```

2. Tambah route di `router/index.js`:
   ```javascript
   {
     path: '/new-page',
     name: 'NewPage',
     component: NewView,
     meta: { requiresAuth: true }
   }
   ```

3. Tambah link di `Navbar.js`:
   ```html
   <router-link to="/new-page">New Page</router-link>
   ```

### Menambah Translation

Edit `utils/i18n.js`:
```javascript
translations: {
  id: {
    newKey: 'Teks Indonesia',
    // ...
  },
  en: {
    newKey: 'English Text',
    // ...
  }
}
```

Gunakan di component:
```javascript
{{ t('newKey') }}
```

### Menambah API Endpoint

Edit `utils/api.js`:
```javascript
const apiClient = {
  // ...existing code
  newResource: {
    async getAll() {
      return request('/api/new-resource');
    },
    async create(data) {
      return request('/api/new-resource', 'POST', data);
    }
  }
};
```

## 📊 Migration Benefits

**Sebelum (Monolithic):**
- ❌ 1 file app.js dengan ~2156 lines
- ❌ Sulit maintenance
- ❌ Sulit colaborasi (git conflicts)
- ❌ Tidak reusable
- ❌ Sulit testing

**Setelah (Modular):**
- ✅ Terorganisir dalam folder structure
- ✅ Reusable components
- ✅ Mudah maintenance (file kecil)
- ✅ Mudah colaborasi (file terpisah)
- ✅ Route-based code splitting
- ✅ Centralized API & translations
- ✅ Scalable architecture

## 🚀 Next Steps (Opsional)

1. **State Management** - Gunakan Pinia untuk global state yang lebih kompleks
2. **Build Process** - Setup Vite untuk bundling dan optimization
3. **TypeScript** - Tambah type safety
4. **Testing** - Unit tests dengan Vitest
5. **PWA** - Enhance service worker untuk offline capability

## 📞 Support

Jika ada masalah:
1. Check console browser untuk error
2. Check Network tab untuk failed requests
3. Lihat dokumentasi di `REFACTORING_GUIDE.md`
4. Lihat component docs di `COMPONENTS_README.md`

---

**Status Implementasi:** ✅ Ready to Deploy

Semua file sudah dibuat, tinggal **ganti `app.js` dengan `app-new.js`** dan test!
