// Router configuration
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPasswordView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardViewMobile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoriesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment-sources',
    name: 'PaymentSources',
    component: PaymentSourcesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/quick-add',
    name: 'QuickAdd',
    component: QuickAddView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  }
];

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
});

// Navigation guards
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

// Export router untuk digunakan di app.js
// Tidak perlu export karena sudah jadi variable global
