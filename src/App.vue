<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <div class="max-w-xl mx-auto p-4">
      <header class="mb-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Expense View</h1>
        <div class="flex items-center gap-2">
          <i @click="toggleDark" :class="[darkMode ? 'fas fa-sun text-white' : 'fas fa-moon', 'text-lg cursor-pointer']"></i>
          <button @click="setLanguage('id')" :class="['px-2 py-1 rounded text-xs', currentLang === 'id' ? accentBgClass + ' text-white' : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700']">ID</button>
          <button @click="setLanguage('en')" :class="['px-2 py-1 rounded text-xs', currentLang === 'en' ? accentBgClass + ' text-white' : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700']">EN</button>
        </div>
      </header>

      <div v-if="!isOnline" class="mb-2 rounded-lg p-2 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 text-xs text-yellow-800 dark:text-yellow-100">{{ t('offlineSyncNotice') }}</div>

      <router-view />
    </div>

    <BottomNav
      :is-authenticated="isAuthenticated"
      :accent-text-class="accentTextClass"
      :t="t"
    />
  </div>
</template>

<script>
import BottomNav from "./components/BottomNav.vue";
import Swal from 'sweetalert2';
import { useAuthStore } from './stores/auth.js';
import { useAppStore } from './stores/app.js';

import { updateProfile, changePassword as changePasswordService, forgotPassword as forgotPasswordService, resetPassword as resetPasswordService } from "./services/authService.js";
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense as updateExpenseRequest,
  deleteExpense as deleteExpenseRequest,
  getCategories,
  getPaymentSources,
  getQuickAddItems,
  createQuickAddItem,
  updateQuickAddItem,
  deleteQuickAddItem,
  downloadBackup,
  restoreBackup,
  sendPushNotification,
  sendSubscription,
} from "./services/dataService.js";
import { addPendingExpense as savePendingExpense, getPendingExpenses as loadPendingExpenses } from "./services/localDataService.js";
import { formatNumber as formatCurrency, parseNumber, isSameDay as sameDay, isSameMonth as sameMonth, isThisWeek as thisWeek, timeAgo as relativeTimeAgo, showToast as notify } from "./services/utilityService.js";

export default {
  name: "App",
  components: {
    BottomNav,
  },
  data() {
    return {
      profileForm: {
        name: "",
        avatar: "",
      },
      changePasswordForm: {
        newPassword: "",
        confirmPassword: "",
      },
      forgotPasswordForm: {
        email: "",
      },
      resetPasswordForm: {
        password: "",
        passwordConfirm: "",
      },
      resetToken: "",
      expenses: [],
      selectedExpense: null,
      newForm: {
        date: new Date().toISOString().slice(0, 10),
      },
      categories: [],
      paymentSources: [],
      newCategoryName: "",
      editingCategory: null,
      newPaymentSourceName: "",
      editingPaymentSource: null,
      quickAddItems: [],
      newQuickAddItem: {
        name: "",
        amount: 0,
        displayAmount: "",
        category: "",
        paymentSource: "",
      },
      quickAddEditIndex: null,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      backPressCount: 0,
      pendingCount: 0,
      pendingExpenses: [],
      restoreFile: null,
      restoreStatus: "",
      itemError: false,
      amountError: false,
      loadingExpenses: false,
      filter: "all",
      vapidPublicKey: "BIt2q9mIdxGqhVYsISG4JrKNl8gmfUUfMY49csaHSm0KM2ItJdqlVEQkFk_k6S_EtFoOudeE0GuwaYvqODZlpaI",
      pushSubscription: null,
    };
  },
  mounted() {
    this.authStore.checkAuth();
    if (this.authStore.isAuthenticated && ["/", "/login", "/signup", "/forgot-password"].includes(this.$route.path)) {
      this.$router.replace('/home');
    }

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      this.appStore.darkMode = savedTheme === "true";
    } else {
      this.appStore.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    this.applyTheme(this.appStore.darkMode);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (localStorage.getItem("darkMode") === null) {
        this.appStore.darkMode = e.matches;
        this.applyTheme(this.appStore.darkMode);
      }
    });
    this.appStore.isOnline = navigator.onLine;
    window.addEventListener("online", () => {
      this.appStore.isOnline = true;
      this.triggerSync();
      this.getPendingExpenses();
    });
    window.addEventListener("offline", () => {
      this.appStore.isOnline = false;
    });
    if (this.isAuthenticated) {
      this.fetchExpenses();
      this.fetchCategories();
      this.fetchPaymentSources();
      this.loadQuickAddItems();
      this.getPendingExpenses();
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").then((registration) => {
          console.log("ServiceWorker registered: ", registration);
        }).catch((error) => {
          console.error("ServiceWorker registration failed: ", error);
        });
        if (this.isAuthenticated) {
          this.requestNotificationPermission();
          this.subscribeToPushNotifications();
        }
      });
    }
    window.addEventListener("popstate", (event) => {
      if (this.currentTab === "detail") {
        this.changeTab("home");
      } else if (this.currentTab === "edit") {
        this.changeTab("detail");
      } else if (this.currentTab === "category" || this.currentTab === "payment-source") {
        this.changeTab("settings");
      } else if (["home", "create", "settings"].includes(this.currentTab)) {
        this.backPressCount++;
        if (this.backPressCount === 1) {
          showToast(this.t("pressAgainToExit"), "info");
          setTimeout(() => {
            this.backPressCount = 0;
          }, 2000);
        } else if (this.backPressCount === 2) {
          window.history.back();
        }
      } else {
        this.changeTab("home");
      }
    });
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "expenses-synced") {
          this.fetchExpenses();
          showToast(this.t("dataOfflineSynced"), "success");
          this.getPendingExpenses();
        }
      });
    }
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    appStore() {
      return useAppStore();
    },
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    currentUser() {
      return this.authStore.user;
    },
    darkMode() {
      return this.appStore.darkMode;
    },
    tone() {
      return this.appStore.tone;
    },
    accentBgClass() {
      return `bg-${this.tone}-500`;
    },
    accentRingClass() {
      return `ring-${this.tone}-500`;
    },
    accentTextClass() {
      return `text-${this.tone}-500`;
    },
    isOnline() {
      return this.appStore.isOnline;
    },
  },
  methods: {
    async apiCall(url, method = 'GET', data = null) {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
        },
      };
      if (data && ['POST','PUT','PATCH'].includes(method)) {
        config.body = JSON.stringify(data);
      }
      const response = await fetch(url, config);
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message || body?.message || `API call failed: ${response.status}`);
      }
      return response.json();
    },
    async getPendingExpenses() {
      try {
        const items = await loadPendingExpenses();
        this.pendingExpenses = items;
        this.pendingCount = items.length;
      } catch (e) {
        this.pendingExpenses = [];
        this.pendingCount = 0;
      }
    },
    async triggerSync() {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if ('sync' in reg) {
          try {
            await reg.sync.register('sync-expenses');
          } catch (e) {
            console.warn('Background sync unavailable', e);
          }
        } else if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'sync-expenses' });
        }
      }
    },
    async fetchExpenses() {
      if (!this.isAuthenticated) return;
      this.loadingExpenses = true;
      try {
        this.expenses = await getExpenses();
      } catch (error) {
        if (error.message === 'Unauthorized') {
          this.logout();
          return;
        }
        console.error('Error fetching expenses:', error);
        this.haptic('error');
      } finally {
        this.loadingExpenses = false;
      }
    },
    async fetchCategories() {
      if (!this.isAuthenticated) return;
      try {
        const data = await getCategories();
        this.categories = data.map((cat) => cat.name);
      } catch (error) {
        if (error.message === 'Unauthorized') {
          this.logout();
          return;
        }
        console.error('Error fetching categories:', error);
      }
    },
    async fetchPaymentSources() {
      if (!this.isAuthenticated) return;
      try {
        const data = await getPaymentSources();
        this.paymentSources = data.map((ps) => ps.name);
      } catch (error) {
        if (error.message === 'Unauthorized') {
          this.logout();
          return;
        }
        console.error('Error fetching payment sources:', error);
      }
    },
    async addCategory() {
      try {
        if (!this.newCategoryName) return;
        await createCategory({ name: this.newCategoryName });
        this.newCategoryName = '';
        await this.fetchCategories();
        showToast(this.t('categoryAddedSuccessfully'), 'success');
      } catch (error) {
        console.error('Error adding category:', error);
        showToast(this.t('failedToAddCategory'), 'error');
      }
    },
    async deleteCategory(categoryName) {
      try {
        await deleteCategory(categoryName);
        await this.fetchCategories();
        showToast(this.t('categoryDeletedSuccessfully'), 'success');
      } catch (error) {
        console.error('Error deleting category:', error);
        showToast(this.t('failedToDeleteCategory'), 'error');
      }
    },
    editCategory(category) {
      this.editingCategory = category;
      this.newCategoryName = category;
    },
    async saveCategory(name) {
      try {
        const categoryName = name ?? this.newCategoryName;
        if (!categoryName) return;
        if (this.editingCategory) {
          await updateCategory(this.editingCategory, { newName: categoryName });
          showToast(this.t('categoryUpdatedSuccessfully'), 'success');
        } else {
          await createCategory({ name: categoryName });
          showToast(this.t('categoryAddedSuccessfully'), 'success');
        }
        this.newCategoryName = '';
        this.editingCategory = null;
        await this.fetchCategories();
      } catch (error) {
        console.error('Error saving category:', error);
        showToast(this.t('failedToUpdateCategory'), 'error');
      }
    },
    cancelEditCategory() {
      this.editingCategory = null;
      this.newCategoryName = '';
    },
    deleteCategoryConfirm(category) {
      Swal.fire({
        title: this.t('confirmDeleteCategory', { '%s': category }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.t('delete'),
        cancelButtonText: this.t('cancel'),
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteCategory(category);
        }
      });
    },
    async addPaymentSource() {
      try {
        if (!this.newPaymentSourceName) return;
        await createPaymentSource({ name: this.newPaymentSourceName });
        this.newPaymentSourceName = '';
        await this.fetchPaymentSources();
        showToast(this.t('paymentSourceAddedSuccessfully'), 'success');
      } catch (error) {
        console.error('Error adding payment source:', error);
        showToast(this.t('failedToAddPaymentSource'), 'error');
      }
    },
    async deletePaymentSource(sourceName) {
      try {
        await deletePaymentSource(sourceName);
        await this.fetchPaymentSources();
        showToast(this.t('paymentSourceDeletedSuccessfully'), 'success');
      } catch (error) {
        console.error('Error deleting payment source:', error);
        showToast(this.t('failedToDeletePaymentSource'), 'error');
      }
    },
    editPaymentSource(source) {
      this.editingPaymentSource = source;
      this.newPaymentSourceName = source;
    },
    async savePaymentSource(name) {
      try {
        const paymentSourceName = name ?? this.newPaymentSourceName;
        if (!paymentSourceName) return;
        if (this.editingPaymentSource) {
          await updatePaymentSource(this.editingPaymentSource, { newName: paymentSourceName });
          showToast(this.t('paymentSourceUpdatedSuccessfully'), 'success');
        } else {
          await createPaymentSource({ name: paymentSourceName });
          showToast(this.t('paymentSourceAddedSuccessfully'), 'success');
        }
        this.newPaymentSourceName = '';
        this.editingPaymentSource = null;
        await this.fetchPaymentSources();
      } catch (error) {
        console.error('Error saving payment source:', error);
        showToast(this.t('failedToUpdatePaymentSource'), 'error');
      }
    },
    cancelEditPaymentSource() {
      this.editingPaymentSource = null;
      this.newPaymentSourceName = '';
    },
    deletePaymentSourceConfirm(source) {
      Swal.fire({
        title: this.t('confirmDeletePaymentSource', { '%s': source }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.t('delete'),
        cancelButtonText: this.t('cancel'),
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePaymentSource(source);
        }
      });
    },
    loadQuickAddItems() {
      getQuickAddItems().then((data) => {
        this.quickAddItems = data;
      }).catch((error) => {
        console.error('Failed to load quick add items:', error);
        showToast(this.t('failedToDeleteQuickAddItem'), 'error');
      });
    },
    addQuickAddItem(item) {
      createQuickAddItem(item).then((newItem) => {
        this.quickAddItems.push(newItem);
        showToast(this.t('quickAddItemDeletedSuccessfully'), 'success');
      }).catch((error) => {
        console.error('Failed to add quick add item:', error);
        showToast(this.t('failedToDeleteQuickAddItem'), 'error');
      });
    },
    editQuickAddItem(index, updatedItem) {
      const itemId = this.quickAddItems[index]._id;
      updateQuickAddItem(itemId, updatedItem).then((updatedItemResponse) => {
        this.quickAddItems.splice(index, 1, updatedItemResponse);
        showToast(this.t('quickAddItemDeletedSuccessfully'), 'success');
      }).catch((error) => {
        console.error('Failed to update quick add item:', error);
        showToast(this.t('failedToDeleteQuickAddItem'), 'error');
      });
    },
    deleteQuickAddItem(index) {
      const itemId = this.quickAddItems[index]._id;
      deleteQuickAddItem(itemId).then(() => {
        this.quickAddItems.splice(index, 1);
        showToast(this.t('quickAddItemDeletedSuccessfully'), 'success');
      }).catch((error) => {
        console.error('Failed to delete quick add item:', error);
        showToast(this.t('failedToDeleteQuickAddItem'), 'error');
      });
    },
    saveQuickAddItem() {
      if (this.quickAddEditIndex !== null) {
        this.editQuickAddItem(this.quickAddEditIndex, {
          ...this.newQuickAddItem,
        });
      } else {
        this.addQuickAddItem({ ...this.newQuickAddItem });
      }
      this.resetQuickAddItemForm();
    },
    editQuickAddItemForm(index) {
      const itemToEdit = this.quickAddItems[index];
      this.newQuickAddItem = {
        ...itemToEdit,
        displayAmount: this.formatNumber(itemToEdit.amount),
      };
      this.quickAddEditIndex = index;
    },
    deleteQuickAddItemConfirm(index) {
      Swal.fire({
        title: this.t('confirmDeleteQuickAddItem'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.t('delete'),
        cancelButtonText: this.t('cancel'),
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteQuickAddItem(index);
        }
      });
    },
    cancelEditQuickAddItem() {
      this.resetQuickAddItemForm();
    },
    resetQuickAddItemForm() {
      this.newQuickAddItem = { name: '', amount: 0, displayAmount: '', category: '', paymentSource: '' };
      this.quickAddEditIndex = null;
    },
    handleQuickAddAmountInput(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      value = value.replace(/^0+/, '');
      const numericValue = parseFloat(value) || 0;
      this.newQuickAddItem.amount = numericValue;
      this.newQuickAddItem.displayAmount = this.formatNumber(numericValue);
    },
    applyQuickAddItem(item) {
      this.newForm.item = item.name;
      this.newForm.amount = item.amount;
      this.newForm.displayAmount = this.formatNumber(item.amount);
      this.newForm.category = item.category;
      this.newForm.payment_source = item.paymentSource;
    },
    toNumber(v) {
      try {
        return typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0;
      } catch (e) {
        return 0;
      }
    },
    formatNumber(n) {
      return formatCurrency(n);
    },
    timeAgo(dateString, timeString) {
      const result = relativeTimeAgo(dateString, timeString);
      if (result === 'justNow') return this.t('justNow');
      return result
        .replace('yearsAgo', this.t('yearsAgo'))
        .replace('monthsAgo', this.t('monthsAgo'))
        .replace('daysAgo', this.t('daysAgo'))
        .replace('hoursAgo', this.t('hoursAgo'))
        .replace('minutesAgo', this.t('minutesAgo'));
    },
    applyTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    haptic(type) {
      if (!navigator.vibrate) return;
      if (type === 'success') {
        navigator.vibrate(30);
      } else if (type === 'error') {
        navigator.vibrate([60, 30, 60]);
      } else {
        navigator.vibrate(20);
      }
    },
    async testNotification() {
      try {
        await sendPushNotification(this.pushSubscription, {
          title: this.t('testNotificationTitle'),
          body: this.t('testNotificationBody'),
        });
        showToast(this.t('testNotificationSuccess'), 'success');
      } catch (error) {
        console.error('Error sending test notification:', error);
        showToast(this.t('testNotificationError'), 'error');
      }
    },
    toggleDark() {
      this.appStore.toggleDark();
    },
    async requestNotificationPermission() {
      if (!('Notification' in window)) {
        showToast(this.t('browserNotSupportNotification'), 'error');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast(this.t('notificationPermissionGranted'), 'success');
      } else if (permission === 'denied') {
        showToast(this.t('notificationPermissionDenied'), 'error');
      } else {
        showToast(this.t('notificationPermissionNotGranted'), 'info');
      }
    },
    async subscribeToPushNotifications() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        showToast(this.t('pushNotificationNotSupportedByBrowser'), 'error');
        return;
      }
      if (Notification.permission !== 'granted') {
        showToast(this.t('notificationPermissionNotGranted'), 'info');
        return;
      }
      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          this.pushSubscription = existingSubscription;
          return;
        }
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        };
        const subscription = await registration.pushManager.subscribe(subscribeOptions);
        await sendSubscription(subscription);
        this.pushSubscription = subscription;
        showToast(this.t('pushSubscriptionSuccess'), 'success');
      } catch (error) {
        console.error('Gagal berlangganan notifikasi push:', error);
        showToast(this.t('pushSubscriptionError'), 'error');
      }
    },
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    manualRefresh() {
      this.fetchExpenses();
      this.haptic('tap');
    },
    setFilter(newFilter) {
      this.filter = newFilter;
      this.haptic('tap');
    },
    isSameDay(d1, d2) {
      return sameDay(d1, d2);
    },
    isSameMonth(d1, d2) {
      return sameMonth(d1, d2);
    },
    isThisWeek(d, now) {
      return thisWeek(d, now);
    },
    async copyMonthlySummary() {
      if (!navigator.clipboard) {
        showToast(this.t('browserNotSupportClipboard'), 'error');
        return;
      }
      const ym = new Date().toISOString().slice(0, 7);
      const monthlyExpenses = this.expenses.filter((e) => (e.input_date || '').slice(0, 7) === ym);
      let summaryText = `${this.t('monthlySummary')} (${this.monthName} ${new Date().getFullYear()}):`;
      let total = 0;
      const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + this.toNumber(expense.amount);
        return acc;
      }, {});
      for (const category in expensesByCategory) {
        summaryText += `\n- ${category}: Rp ${this.formatNumber(expensesByCategory[category])}`;
        total += expensesByCategory[category];
      }
      summaryText += `\n\n${this.t('total')}: Rp ${this.formatNumber(total)}`;
      try {
        await navigator.clipboard.writeText(summaryText);
        showToast(this.t('monthlySummaryCopied'), 'success');
      } catch (err) {
        console.error('Gagal menyalin ringkasan: ', err);
        showToast(this.t('monthlySummaryCopyFailed'), 'error');
      }
    },
    async downloadBackup() {
      try {
        const data = await downloadBackup();
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.download = `backup-expense-view-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast(this.t('backupDownloaded'), 'success');
      } catch (e) {
        const fallback = { expenses: this.expenses, categories: this.categories, paymentSources: this.paymentSources };
        const blob = new Blob([JSON.stringify(fallback)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.download = `backup-expense-view-local-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast(this.t('backupDownloadedFallback'), 'success');
      }
    },
    handleRestoreFile(ev) {
      const f = ev.target.files && ev.target.files[0];
      this.restoreFile = f || null;
      this.restoreStatus = this.restoreFile ? this.restoreFile.name : '';
    },
    async restoreData() {
      if (!this.restoreFile) return;
      this.restoreStatus = this.t('restoreProcessing');
      try {
        const text = await this.restoreFile.text();
        const payload = JSON.parse(text);
        await restoreBackup(payload);
        this.restoreStatus = `Selesai`;
        await this.fetchExpenses();
        await this.fetchCategories();
        await this.fetchPaymentSources();
        this.loadQuickAddItems();
        showToast(this.t('restoreSuccess'), 'success');
      } catch (e) {
        try {
          const text = await this.restoreFile.text();
          const data = JSON.parse(text);
          const cats = Array.isArray(data.categories) ? data.categories : [];
          const srcs = Array.isArray(data.paymentSources) ? data.paymentSources : [];
          for (const name of cats) {
            await createCategory({ name });
          }
          for (const name of srcs) {
            await createPaymentSource({ name });
          }
          const exps = Array.isArray(data.expenses) ? data.expenses : [];
          for (const exp of exps) {
            await createExpense(exp);
          }
          this.restoreStatus = this.t('restoreSuccessFallback');
          await this.fetchExpenses();
          await this.fetchCategories();
          await this.fetchPaymentSources();
          showToast(this.t('restoreSuccessFallback'), 'success');
        } catch (err) {
          this.restoreStatus = this.t('restoreFailed');
          showToast(this.t('restoreFailed'), 'error');
        }
      }
      this.restoreFile = null;
    },
    changeTab(tabName, pushState = true) {
      const routeMap = {
        home: '/home',
        create: '/create',
        settings: '/settings',
        profile: '/profile',
        category: '/category',
        'payment-source': '/payment-source',
        'backup-restore': '/backup-restore',
        'quick-add': '/quick-add',
        login: '/login',
        signup: '/signup',
        'forgot-password': '/forgot-password',
      };

      if (tabName === 'detail' && this.selectedExpense?._id) {
        this.$router.push(`/detail/${this.selectedExpense._id}`);
      } else if (tabName === 'edit' && this.selectedExpense?._id) {
        this.$router.push(`/edit/${this.selectedExpense._id}`);
      } else if (routeMap[tabName]) {
        if (this.$route.path !== routeMap[tabName]) {
          this.$router.push(routeMap[tabName]);
        }
      }

      this.haptic('tap');
    },
    async showDetail(expenseId) {
      try {
        this.selectedExpense = await getExpenseById(expenseId);
        this.changeTab('detail');
      } catch (error) {
        console.error('Error fetching expense detail:', error);
      }
    },
    editExpense(expense) {
      this.selectedExpense.displayAmount = this.formatNumber(this.toNumber(this.selectedExpense.amount));
      this.changeTab('edit');
    },
    async submitEdit() {
      try {
        await updateExpenseRequest(this.selectedExpense._id, this.selectedExpense);
        await this.fetchExpenses();
        this.showDetail(this.selectedExpense._id);
        showToast(this.t('editExpenseSuccess'), 'success');
        this.haptic('success');
      } catch (error) {
        console.error('Error updating expense:', error);
        showToast(this.t('editExpenseFailed'), 'error');
        this.haptic('error');
      }
    },
    async deleteExpense(expenseId) {
      try {
        await deleteExpenseRequest(expenseId);
        await this.fetchExpenses();
        showToast(this.t('deleteExpenseSuccess'), 'success');
        this.haptic('success');
        this.changeTab('home', false);
      } catch (error) {
        console.error('Error deleting expense:', error);
        showToast(this.t('deleteExpenseFailed'), 'error');
        this.haptic('error');
      }
    },
    topByKey(k) {
      const m = {};
      for (const e of this.expenses) {
        const key = e[k];
        if (!key) continue;
        m[key] = (m[key] || 0) + 1;
      }
      let best = "";
      let cnt = 0;
      for (const [key, val] of Object.entries(m)) {
        if (val > cnt) {
          cnt = val;
          best = key;
        }
      }
      return best || "-";
    },
    async submitNew() {
      this.itemError = false;
      this.amountError = false;
      let hasError = false;
      if (!this.newForm.item) {
        this.itemError = true;
        hasError = true;
      }
      if (!this.newForm.amount) {
        this.amountError = true;
        hasError = true;
      }
      if (hasError) return;
      if (!navigator.onLine) {
        await savePendingExpense(this.newForm);
        showToast(this.t('addExpenseSuccessOffline'), 'success');
        await this.triggerSync();
        this.resetNewForm();
        await this.getPendingExpenses();
        return;
      }
      try {
        await createExpense(this.newForm);
        await this.fetchExpenses();
        showToast(this.t('addExpenseSuccess'), 'success');
        this.haptic('success');
        this.resetNewForm();
      } catch (error) {
        console.error('Error adding expense:', error);
        try {
          await savePendingExpense(this.newForm);
          showToast(this.t('addExpenseSuccessOffline'), 'success');
          await this.triggerSync();
          this.resetNewForm();
          await this.getPendingExpenses();
        } catch (e) {
          showToast(this.t('addExpenseFailedOffline'), 'error');
          this.haptic('error');
        }
      }
    },
    action(type) {
      if (type === 'profil') {
        this.initializeProfileForm();
        this.changeTab('profile');
      } else if (type === 'logout') {
        this.logout();
      }
    },
    resetNewForm() {
      this.newForm.store = '';
      this.newForm.item = '';
      this.newForm.amount = '';
      this.newForm.displayAmount = '';
      this.newForm.category = '';
      this.newForm.payment_source = '';
      this.itemError = false;
      this.amountError = false;
    },
    selectDay(day) {
      if (day) {
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.newForm.date = selectedDate.toISOString().slice(0, 10);
      }
    },
    selectDayEdit(day) {
      if (day) {
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.selectedExpense.date = selectedDate.toISOString().slice(0, 10);
      }
    },
    handleAmountInput(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      value = value.replace(/^0+/, '');
      const numericValue = parseFloat(value) || 0;
      this.newForm.amount = numericValue;
      this.newForm.displayAmount = this.formatNumber(numericValue);
    },
    handleEditAmountInput(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      value = value.replace(/^0+/, '');
      const numericValue = parseFloat(value) || 0;
      this.selectedExpense.amount = numericValue;
      this.selectedExpense.displayAmount = this.formatNumber(numericValue);
    },
    showToast(message, type = 'info') {
      notify(message, type);
    },
    initializeProfileForm() {
      if (this.currentUser) {
        this.profileForm.name = this.currentUser.name || '';
        this.profileForm.avatar = this.currentUser.avatar || '';
      }
    },
    async updateProfile() {
      try {
        const response = await updateProfile({ name: this.profileForm.name, avatar: this.profileForm.avatar });
        this.authStore.currentUser = { ...this.authStore.currentUser, ...response.user };
        localStorage.setItem('user', JSON.stringify(this.authStore.currentUser));
        showToast(this.t('profileUpdatedSuccessfully'), 'success');
        this.changeTab('settings');
      } catch (error) {
        showToast(this.t('failedToUpdateProfile'), 'error');
      }
    },
    async changePassword() {
      if (this.changePasswordForm.newPassword !== this.changePasswordForm.confirmPassword) {
        showToast(this.t('passwordMismatch'), 'error');
        return;
      }
      try {
        const response = await changePasswordService({ newPassword: this.changePasswordForm.newPassword, newPasswordConfirm: this.changePasswordForm.confirmPassword });
        this.authToken = response.token;
        this.authStore.currentUser = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        showToast(this.t('passwordChangedSuccessfully'), 'success');
        this.changeTab('settings');
        this.changePasswordForm = { newPassword: '', confirmPassword: '' };
      } catch (error) {
        showToast(error.message, 'error');
      }
    },
    async forgotPassword() {
      try {
        await forgotPasswordService({ email: this.forgotPasswordForm.email });
        showToast(this.t('resetLinkSent'), 'success');
        this.changeTab('login');
      } catch (error) {
        showToast(error.message, 'error');
      }
    },
    async resetPassword() {
      if (this.resetPasswordForm.password !== this.resetPasswordForm.passwordConfirm) {
        showToast(this.t('passwordMismatch'), 'error');
        return;
      }
      try {
        const data = await resetPasswordService(this.resetToken, { password: this.resetPasswordForm.password, passwordConfirm: this.resetPasswordForm.passwordConfirm });
        this.authToken = data.token;
        this.authStore.currentUser = data.user;
        this.authStore.isAuthenticated = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast(this.t('resetPasswordSuccess'), 'success');
        this.changeTab('home');
        await this.fetchExpenses();
        await this.fetchCategories();
        await this.fetchPaymentSources();
      } catch (error) {
        showToast(error.message, 'error');
      }
    },
    async clearCacheAndReload() {
      let count = 0;
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        count += 1;
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
        count += 2;
      }
      showToast(this.t('clearCacheSuccess'), 'success');
      setTimeout(() => { window.location.reload(true); }, count * 1000);
    },
    setLanguage(lang) {
      this.appStore.setLanguage(lang);
    },
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    adjustMonth(amount) {
      this.currentMonth += amount;
    },
  },
  watch: {
    currentMonth(newMonth) {
      if (newMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else if (newMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
    },
  },
};
</script>
