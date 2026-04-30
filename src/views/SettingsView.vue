<template>
  <div class="space-y-4">
    <section class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <div class="flex items-center gap-3">
        <img :src="currentUser?.avatar || 'https://i.pravatar.cc/100?img=5'" alt="user" class="w-12 h-12 rounded-full object-cover" />
        <div>
          <div class="font-semibold text-gray-900 dark:text-gray-100">{{ currentUser?.name || 'User' }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Level {{ currentUser?.level || 'Standard' }}</div>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl px-4 shadow space-y-3 mt-4">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="flex items-center justify-between py-3">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('theme') }}</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" :checked="darkMode" @change="appStore.toggleDark()" class="sr-only peer" />
            <div @click="appStore.toggleDark()" class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </li>
        <li class="flex items-center justify-between py-3">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('accentColor') }}</span>
          <select :value="tone" @change="appStore.setTone($event.target.value)" :class="['px-1.5 py-1 border rounded text-white', accentBgClass]">
            <option value="indigo">Indigo</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="rose">Rose</option>
            <option value="amber">Amber</option>
          </select>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="handleClearCache">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('clearCache') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="handleTestNotification">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('testNotification') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$router.push('/backup-restore')">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('backupRestore') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
      </ul>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl px-4 shadow space-y-3 mt-4">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$router.push('/category')">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('manageCategories') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$router.push('/payment-source')">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('managePaymentSources') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$router.push('/quick-add')">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('quickAddItems') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
      </ul>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl px-4 shadow space-y-3 mt-4">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$router.push('/profile')">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('manageProfile') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$router.push('/change-password')">
          <span class="text-gray-900 dark:text-gray-100">{{ appStore.t('changePassword') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="handleLogout">
          <span class="text-red-600 hover:underline dark:text-red-400">{{ appStore.t('logout') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { useAuthStore } from '../stores/auth.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "SettingsView",
  data() {
    return {};
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    authStore() {
      return useAuthStore();
    },
    currentUser() {
      return this.authStore.currentUser;
    },
    darkMode() {
      return this.appStore.darkMode;
    },
    tone() {
      return this.appStore.tone;
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
    accentTextClass() {
      return this.appStore.accentTextClass;
    },
  },
  methods: {
    async handleClearCache() {
      let count = 0;
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        count += 1;
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
        count += 2;
      }
      showToast(this.appStore.t('clearCacheSuccess'), 'success');
      setTimeout(() => { window.location.reload(true); }, count * 1000);
    },
    async handleTestNotification() {
      // This would need to be implemented based on your notification service
      showToast(this.appStore.t('testNotificationSuccess'), 'success');
    },
    handleLogout() {
      this.authStore.logout();
      this.$router.push('/login');
    },
  },
};
</script>
