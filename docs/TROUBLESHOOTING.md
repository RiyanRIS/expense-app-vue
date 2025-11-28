# 🔧 Troubleshooting Guide - Fixed Router Error

## ✅ Error Fixed: "router is not defined"

**Problem:** Error terjadi di `app-new.js:107` karena variable `router` tidak didefinisikan.

**Solution:** File `router/index.js` telah diupdate untuk mendefinisikan `router` sebagai global variable.

---

## 📝 Changes Made

### 1. Updated `router/index.js`

**Before:**
```javascript
function createRouter(components) {
  const { createRouter, createWebHashHistory } = VueRouter;
  const router = createRouter({...});
  return router;
}
```

**After:**
```javascript
const { createRouter, createWebHashHistory } = VueRouter;
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
});
```

**Key Changes:**
- ✅ Removed function wrapper
- ✅ Router langsung didefinisikan sebagai const
- ✅ Components langsung direferensikan (LoginView, DashboardView, dll)
- ✅ Router tersedia sebagai global variable untuk `app-new.js`

---

## 🚀 Testing Steps

### 1. Open Browser Developer Tools
```
F12 atau Right Click → Inspect
```

### 2. Check Console
Pastikan tidak ada error:
- ✅ No "router is not defined" error
- ✅ No component loading errors
- ✅ No 404 errors for scripts

### 3. Test Navigation
1. **Login page should show** (default route: `#/login`)
2. **Create account:**
   - Click "Daftar Sekarang"
   - Fill form → Submit
   - Should auto-login and redirect to dashboard

3. **Login:**
   - Enter email & password
   - Submit
   - Should redirect to `#/dashboard`

4. **Test Protected Routes:**
   - Dashboard should show with navbar
   - Can navigate to Profile, Categories, Settings
   - Logout should redirect to Login

5. **Test Guest Routes:**
   - When logged in, cannot access `/login` or `/signup`
   - Should auto-redirect to `/dashboard`

---

## 🐛 Common Errors & Solutions

### Error: "LoginView is not defined"

**Cause:** View component belum loaded sebelum router

**Solution:** Check `index.html` script order:
```html
<!-- Views MUST be loaded BEFORE router -->
<script src="views/LoginView.js"></script>
<!-- ... other views ... -->
<script src="router/index.js"></script>
```

### Error: "Navbar is not defined"

**Cause:** Component belum loaded atau belum diregister

**Solution:** 
1. Check component file exists: `components/Navbar.js`
2. Check registered in `app-new.js`:
```javascript
app.component('navbar', Navbar);
```

### Error: "translations is not defined"

**Cause:** `utils/i18n.js` belum loaded

**Solution:** Check `index.html` has:
```html
<script src="utils/i18n.js"></script>
```

### Error: "apiClient is not defined"

**Cause:** `utils/api.js` belum loaded

**Solution:** Check `index.html` has:
```html
<script src="utils/api.js"></script>
```

### Blank Page After Login

**Cause:** Router guard tidak menemukan token

**Solution:** 
1. Open DevTools → Application → Local Storage
2. Check `token` exists
3. If not, try login again
4. Check console for errors

---

## 🎯 Script Loading Order (Critical!)

Urutan ini **WAJIB** diikuti:

```html
<!-- 1. Framework -->
<script src="plugins/vue/vue.global.js"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<!-- 2. Utilities -->
<script src="utils/api.js"></script>
<script src="utils/i18n.js"></script>

<!-- 3. Components -->
<script src="components/Navbar.js"></script>
<script src="components/ExpenseList.js"></script>
<script src="components/ExpenseForm.js"></script>

<!-- 4. Views -->
<script src="views/LoginView.js"></script>
<script src="views/SignupView.js"></script>
<!-- ... all views ... -->

<!-- 5. Router (AFTER all views!) -->
<script src="router/index.js"></script>

<!-- 6. App (LAST!) -->
<script src="app-new.js"></script>
```

**Why this order?**
- Router needs view components to be defined
- App needs router to be defined
- Components/Views need utilities (api, i18n)

---

## ✅ Verification Checklist

Run these checks in browser console:

```javascript
// 1. Check Vue loaded
console.log(typeof Vue); // should be "object"

// 2. Check VueRouter loaded
console.log(typeof VueRouter); // should be "object"

// 3. Check router defined
console.log(typeof router); // should be "object"

// 4. Check components defined
console.log(typeof LoginView); // should be "object"
console.log(typeof Navbar); // should be "object"

// 5. Check utilities defined
console.log(typeof apiClient); // should be "object"
console.log(typeof translations); // should be "object"

// 6. Check token (if logged in)
console.log(localStorage.getItem('token')); // should be JWT string
```

---

## 🔄 Quick Reset (If Things Break)

### Reset Authentication
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Reset to Login Page
```javascript
// In browser console
localStorage.removeItem('token');
localStorage.removeItem('user');
location.href = '#/login';
location.reload();
```

### Force Logout
```javascript
// In browser console
localStorage.clear();
location.href = '#/login';
location.reload();
```

---

## 📊 Testing Scenarios

### Scenario 1: First Time User

1. Open `http://localhost:3000`
2. Should see Login page
3. Click "Daftar Sekarang"
4. Fill signup form
5. Submit → Auto login → Redirect to Dashboard
6. ✅ **Expected:** Dashboard with navbar, empty expenses

### Scenario 2: Returning User

1. Open `http://localhost:3000`
2. Should see Login page
3. Enter credentials
4. Submit → Redirect to Dashboard
5. ✅ **Expected:** Dashboard with previous data

### Scenario 3: Navigation Flow

1. Login → Dashboard
2. Click Profile → See profile page
3. Click Categories → See categories page
4. Click Settings → See settings page
5. Click Logout → Redirect to Login
6. ✅ **Expected:** All navigation works

### Scenario 4: Protected Routes

1. Logout (clear token)
2. Try to access `#/dashboard` directly
3. ✅ **Expected:** Auto redirect to `/login`
4. Try to access `#/profile` directly
5. ✅ **Expected:** Auto redirect to `/login`

### Scenario 5: Guest Routes

1. Login successfully
2. Try to access `#/login` directly
3. ✅ **Expected:** Auto redirect to `/dashboard`
4. Try to access `#/signup` directly
5. ✅ **Expected:** Auto redirect to `/dashboard`

---

## 🎨 Visual Checks

### Login Page
- [ ] Logo/Icon visible
- [ ] Form centered
- [ ] Dark mode toggle works
- [ ] Language switch works
- [ ] "Daftar Sekarang" link works

### Dashboard
- [ ] Navbar appears at top
- [ ] Statistics cards show
- [ ] Expense list displays
- [ ] Filters work
- [ ] Create expense button works

### All Pages
- [ ] Dark mode persists across navigation
- [ ] Language persists across navigation
- [ ] Navbar active link highlights
- [ ] Logout works from any page

---

## 🚨 Emergency Rollback

If modular app doesn't work, rollback to monolithic:

```powershell
cd c:\laragon\www\expense-app-vue\public
Remove-Item app.js
Copy-Item app-old.js app.js
Remove-Item index.html
Copy-Item index-old.html index.html
```

Reload browser.

---

## 📞 Still Having Issues?

1. **Check Console:** F12 → Console tab
2. **Check Network:** F12 → Network tab (look for 404s)
3. **Check Application:** F12 → Application → Local Storage
4. **Check Server:** Terminal should show `Server running on port 3000`

### Debug Mode

Add this to browser console for detailed logs:

```javascript
// Enable Vue devtools
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue;

// Log all route changes
router.beforeEach((to, from, next) => {
  console.log('Navigating from', from.path, 'to', to.path);
  next();
});

// Log all API calls
const originalRequest = apiClient.request;
apiClient.request = async function(...args) {
  console.log('API Request:', args);
  const result = await originalRequest.apply(this, args);
  console.log('API Response:', result);
  return result;
};
```

---

**Status:** ✅ Router error fixed  
**Last Updated:** November 28, 2025  
**Next Step:** Test application in browser
