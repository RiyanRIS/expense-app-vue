import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import AuthLoginView from './views/AuthLoginView.vue';
import AuthSignupView from './views/AuthSignupView.vue';
import HomeView from './views/HomeView.vue';
import CreateExpenseView from './views/CreateExpenseView.vue';
import ExpenseDetailView from './views/ExpenseDetailView.vue';
import ExpenseEditView from './views/ExpenseEditView.vue';
import SettingsView from './views/SettingsView.vue';
import ProfileView from './views/ProfileView.vue';
import ChangePasswordView from './views/ChangePasswordView.vue';
import ForgotPasswordView from './views/ForgotPasswordView.vue';
import CategoryView from './views/CategoryView.vue';
import PaymentSourceView from './views/PaymentSourceView.vue';
import BackupRestoreView from './views/BackupRestoreView.vue';
import QuickAddView from './views/QuickAddView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: AuthLoginView, meta: { requiresGuest: true } },
  { path: '/signup', component: AuthSignupView, meta: { requiresGuest: true } },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/create', component: CreateExpenseView, meta: { requiresAuth: true } },
  { path: '/detail/:id', component: ExpenseDetailView, meta: { requiresAuth: true } },
  { path: '/edit/:id', component: ExpenseEditView, meta: { requiresAuth: true } },
  { path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/change-password', component: ChangePasswordView, meta: { requiresAuth: true } },
  { path: '/forgot-password', component: ForgotPasswordView, meta: { requiresGuest: true } },
  { path: '/category', component: CategoryView, meta: { requiresAuth: true } },
  { path: '/payment-source', component: PaymentSourceView, meta: { requiresAuth: true } },
  { path: '/backup-restore', component: BackupRestoreView, meta: { requiresAuth: true } },
  { path: '/quick-add', component: QuickAddView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;