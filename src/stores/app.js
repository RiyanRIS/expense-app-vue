import { defineStore } from 'pinia';
import {
  getExpenses,
  getCategories,
  getPaymentSources,
  getQuickAddItems,
} from '../services/dataService.js';
import translations from './translations.js';

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    tone: 'indigo',
    currentLang: localStorage.getItem('language') || 'id',
    translations,
    expenses: [],
    categories: [],
    paymentSources: [],
    quickAddItems: [],
    selectedExpense: null,
    newForm: { date: new Date().toISOString().slice(0, 10) },
    profileForm: { name: '', avatar: '' },
    changePasswordForm: { newPassword: '', confirmPassword: '' },
    forgotPasswordForm: { email: '' },
    newCategoryName: '',
    editingCategory: null,
    newPaymentSourceName: '',
    editingPaymentSource: null,
    newQuickAddItem: { name: '', amount: 0, displayAmount: '', category: '', paymentSource: '' },
    quickAddEditIndex: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    pendingCount: 0,
    pendingExpenses: [],
    restoreFile: null,
    restoreStatus: '',
    itemError: false,
    amountError: false,
    isOnline: navigator.onLine,
    loadingExpenses: false,
    filter: 'all',
  }),
  getters: {
    accentBgClass: (state) => {
      const m = {
        indigo: 'bg-indigo-600',
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        rose: 'bg-rose-600',
        amber: 'bg-amber-600',
      };
      return m[state.tone] || m.indigo;
    },
    accentTextClass: (state) => {
      const m = {
        indigo: 'text-indigo-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        rose: 'text-rose-600',
        amber: 'text-amber-600',
      };
      return m[state.tone] || m.indigo;
    },
    accentRingClass: (state) => {
      const m = {
        indigo: 'focus:ring-indigo-500',
        blue: 'focus:ring-blue-500',
        green: 'focus:ring-green-500',
        rose: 'focus:ring-rose-500',
        amber: 'focus:ring-amber-500',
      };
      return m[state.tone] || m.indigo;
    },
    calendarDays: (state) => {
      const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(state.currentYear, state.currentMonth, 1).getDay();
      const days = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      return days;
    },
    monthName: (state) => {
      const date = new Date(state.currentYear, state.currentMonth);
      return date.toLocaleString(state.currentLang === 'id' ? 'id-ID' : 'en-US', { month: 'long' });
    },
    latestTen: (state) => state.filteredExpenses,
    filteredExpenses: (state) => {
      let filtered = [...state.expenses];
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      switch (state.filter) {
        case 'today':
          filtered = filtered.filter((e) => state.isSameDay(new Date(e.input_date), today));
          break;
        case 'yesterday':
          filtered = filtered.filter((e) => state.isSameDay(new Date(e.input_date), yesterday));
          break;
        case 'this_week':
          filtered = filtered.filter((e) => state.isThisWeek(new Date(e.input_date), today));
          break;
        case 'this_month':
          filtered = filtered.filter((e) => state.isSameMonth(new Date(e.input_date), today));
          break;
        case 'all':
        default:
          break;
      }
      return filtered.sort((a, b) => new Date(b.input_date) - new Date(a.input_date));
    },
    totalToday: (state) => {
      const today = new Date();
      return state.filteredExpenses.filter((e) => state.isSameDay(new Date(e.input_date), today)).reduce((s, e) => s + state.toNumber(e.amount), 0);
    },
    totalMonth: (state) => {
      const ym = new Date().toISOString().slice(0, 7);
      return state.filteredExpenses.filter((e) => (e.input_date || '').slice(0, 7) === ym).reduce((s, e) => s + state.toNumber(e.amount), 0);
    },
    topCategory: (state) => state.topByKey('category'),
    topSource: (state) => state.topByKey('payment_source'),
    topStore: (state) => state.topByKey('store'),
  },
  actions: {
    // Auth actions
    checkAuth() {
      const authStore = useAuthStore();
      authStore.checkAuth();
    },
    // App actions
    toggleDark() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      this.applyTheme(this.darkMode);
    },
    setTone(tone) {
      this.tone = tone;
    },
    setLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem('language', lang);
    },
    t(key, ...replacements) {
      let translation = (this.translations[this.currentLang] || {})[key];
      if (translation === undefined) return key;
      if (typeof translation === 'string') {
        replacements.forEach((rep) => {
          const nextKey = Object.keys(rep)[0];
          translation = translation.replace(new RegExp(`\{\{${nextKey}\}\}`, 'g'), rep[nextKey]);
        });
      }
      return translation;
    },
    applyTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    // Data actions
    async fetchExpenses() {
      this.loadingExpenses = true;
      try {
        this.expenses = await getExpenses();
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        this.loadingExpenses = false;
      }
    },
    async fetchCategories() {
      try {
        const data = await getCategories();
        this.categories = data.map((cat) => cat.name);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchPaymentSources() {
      try {
        const data = await getPaymentSources();
        this.paymentSources = data.map((ps) => ps.name);
      } catch (error) {
        console.error('Error fetching payment sources:', error);
      }
    },
    loadQuickAddItems() {
      getQuickAddItems().then((data) => {
        this.quickAddItems = data;
      }).catch((error) => {
        console.error('Failed to load quick add items:', error);
      });
    },
    // Tambahkan actions lainnya sesuai kebutuhan
    toNumber(v) {
      try {
        return typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0;
      } catch (e) {
        return 0;
      }
    },
    isSameDay(d1, d2) {
      return d1.toDateString() === d2.toDateString();
    },
    isSameMonth(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    },
    isThisWeek(d, now) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return d >= startOfWeek && d <= endOfWeek;
    },
    topByKey(k) {
      const m = {};
      for (const e of this.expenses) {
        const key = e[k];
        if (!key) continue;
        m[key] = (m[key] || 0) + 1;
      }
      let best = '';
      let cnt = 0;
      for (const [key, val] of Object.entries(m)) {
        if (val > cnt) {
          cnt = val;
          best = key;
        }
      }
      return best || '-';
    },
  },
});