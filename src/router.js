import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import AuthView from './components/AuthView.vue';
import HomeView from './components/HomeView.vue';
import CreateExpenseView from './components/CreateExpenseView.vue';
import ExpenseDetailView from './components/ExpenseDetailView.vue';
import ExpenseEditView from './components/ExpenseEditView.vue';
import SettingsView from './components/SettingsView.vue';
import ProfileView from './components/ProfileView.vue';
import ChangePasswordView from './components/ChangePasswordView.vue';
import ForgotPasswordView from './components/ForgotPasswordView.vue';
import CategoryView from './components/CategoryView.vue';
import PaymentSourceView from './components/PaymentSourceView.vue';
import BackupRestoreView from './components/BackupRestoreView.vue';
import QuickAddView from './components/QuickAddView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: AuthView, props: { mode: 'login' }, meta: { requiresGuest: true } },
  { path: '/signup', component: AuthView, props: { mode: 'signup' }, meta: { requiresGuest: true } },
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