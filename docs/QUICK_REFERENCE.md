# 🚀 Quick Reference - Expense App Vue Mobile-First

## ⚡ Deploy Dalam 3 Langkah

### 1. Aktivasi Modular Architecture
```powershell
cd c:\laragon\www\expense-app-vue\public
Remove-Item app.js
Rename-Item app-new.js app.js
```

### 2. Start Server
```powershell
cd c:\laragon\www\expense-app-vue
node server.js
```

### 3. Test di Browser atau HP
```
Desktop: http://localhost:3000
Mobile: http://[YOUR-IP]:3000
```

---

## 📱 Mobile Features (NEW!)

### Bottom Navigation
```
[Home] [Quick Add] [  +  ] [Categories] [Profile]
                  (FAB)
```

### Gestures
- **Pull Down** → Refresh dashboard
- **Swipe Stats** → Scroll statistics cards
- **Swipe Left** → Delete expense
- **Tap FAB (+)** → Add expense
- **Tap Card** → Edit expense

### Components
- `MobileBottomNav` - Bottom navigation
- `MobileTopBar` - Compact top bar
- `DashboardViewMobile` - Mobile-optimized dashboard

---

## 📁 File Structure Cheat Sheet

```
public/
├── app.js                      # ⚠️ REPLACE dengan app-new.js
├── router/index.js             # 11 routes + guards
├── utils/
│   ├── api.js                  # API client
│   └── i18n.js                 # Translations
├── components/
│   ├── Navbar.js               # Navigation
│   ├── ExpenseList.js          # List component
│   └── ExpenseForm.js          # Form component
└── views/
    ├── LoginView.js            # Login
    ├── SignupView.js           # Registration
    ├── DashboardView.js        # Main app
    ├── ProfileView.js          # Profile
    ├── CategoriesView.js       # Categories CRUD
    ├── PaymentSourcesView.js   # Payment CRUD
    ├── QuickAddView.js         # Quick add CRUD
    └── SettingsView.js         # Settings
```

---

## 🎯 Routes Quick Reference

| URL | Page | Auth |
|-----|------|------|
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/dashboard` | Dashboard | Yes |
| `/profile` | Profile | Yes |
| `/categories` | Categories | Yes |
| `/payment-sources` | Payment Sources | Yes |
| `/quick-add` | Quick Add | Yes |
| `/settings` | Settings | Yes |

---

## 💻 Code Snippets

### Create New View

```javascript
// views/MyView.js
const MyView = {
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <navbar></navbar>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ t('myTitle') }}
        </h1>
      </div>
    </div>
  `,
  data() {
    return {
      items: []
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    async loadData() {
      try {
        const response = await apiClient.myResource.getAll();
        this.items = response.items;
      } catch (error) {
        this.$root.showNotification(error.message, 'error');
      }
    }
  }
};
```

### Add New Route

```javascript
// router/index.js - tambahkan di routes array
{
  path: '/my-page',
  name: 'MyPage',
  component: MyView,
  meta: { requiresAuth: true }
}
```

### API Call

```javascript
// GET
const response = await apiClient.expenses.getAll();

// POST
await apiClient.expenses.create({
  date: '2024-01-01',
  item: 'Makan',
  amount: 50000
});

// PUT
await apiClient.expenses.update(id, data);

// DELETE
await apiClient.expenses.delete(id);
```

### Translation

```javascript
// Add to utils/i18n.js
translations: {
  id: { myKey: 'Teks Indonesia' },
  en: { myKey: 'English Text' }
}

// Use in component
{{ t('myKey') }}
```

---

## 🔧 Common Tasks

### Add Navigation Link

```javascript
// components/Navbar.js - dalam template
<router-link 
  to="/my-page" 
  class="text-gray-700 hover:text-indigo-600"
>
  {{ t('myPage') }}
</router-link>
```

### Show Notification

```javascript
this.$root.showNotification('Success!', 'success'); // green
this.$root.showNotification('Error!', 'error');     // red
this.$root.showNotification('Warning!', 'warning'); // yellow
this.$root.showNotification('Info', 'info');        // blue
```

### Toggle Dark Mode

```javascript
this.$root.darkMode = !this.$root.darkMode;
localStorage.setItem('darkMode', this.$root.darkMode);
document.documentElement.classList.toggle('dark');
```

### Change Language

```javascript
this.$root.language = 'en'; // or 'id'
localStorage.setItem('language', this.$root.language);
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_GUIDE.md` | Step-by-step setup |
| `REFACTORING_GUIDE.md` | Detailed refactoring explanation |
| `REFACTORING_SUMMARY.md` | Complete summary |
| `public/COMPONENTS_README.md` | Component usage guide |
| `public/README.md` | Public folder structure |

---

## ✅ Testing Checklist

```
[ ] App loads without errors
[ ] Login works
[ ] Signup works
[ ] Dashboard shows after login
[ ] Navbar appears
[ ] Can create expense
[ ] Can edit expense
[ ] Can delete expense
[ ] Filters work
[ ] Dark mode works
[ ] Language switch works
[ ] Profile update works
[ ] Categories CRUD works
[ ] Payment sources CRUD works
[ ] Quick add works
[ ] Settings work
[ ] Logout works
[ ] Protected routes redirect to login
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check console, verify app.js replaced |
| Router error | Check router/index.js loaded |
| Component error | Check component registration in app.js |
| API error | Check server running, network tab |
| Dark mode broken | Hard refresh (Ctrl+F5) |
| Translation missing | Check i18n.js, add key |

---

## 📊 Stats

- **Total Files Created:** 20+
- **Total Lines Refactored:** ~2156 → ~110 (app.js)
- **Components:** 3
- **Views:** 10
- **Routes:** 11
- **Documentation:** 5 files

---

## 🎉 You're Ready!

**File yang HARUS diganti:**
```powershell
Remove-Item c:\laragon\www\expense-app-vue\public\app.js
Rename-Item c:\laragon\www\expense-app-vue\public\app-new.js app.js
```

**Start server:**
```powershell
cd c:\laragon\www\expense-app-vue
node server.js
```

**Test:**
```
http://localhost:3000
```

---

**Version:** 1.0.0 | **Status:** ✅ Production Ready
