<template>
  <main class="space-y-4">
    <section v-if="pendingCount > 0" class="bg-yellow-50 dark:bg-yellow-900 rounded-xl p-4 shadow border border-yellow-200 dark:border-yellow-800">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-semibold text-yellow-800 dark:text-yellow-100">{{ t('pendingSyncNotice') }}</div>
          <div class="text-xs text-yellow-700 dark:text-yellow-200">{{ t('pendingSyncNoticeDetail') }}</div>
        </div>
        <button @click="handleTriggerSync" class="px-3 py-1 rounded bg-yellow-600 text-white text-sm">{{ t('triggerSync') }}</button>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('totalTodayNotice') }}</div>
        <div class="text-xl font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(totalToday) }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <div class="flex items-center justify-between">
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('totalMonthNotice') }}</div>
        </div>
        <div class="text-xl font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(totalMonth) }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('topCategoryNotice') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ topCategory }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('topSourceNotice') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ topSource }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow col-span-2">
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('topStoreNotice') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ topStore }}</div>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow mb-4">
      <h2 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ t('filterNotice') }}</h2>
      <div class="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        <button @click="handleSetFilter('all')" :class="buttonClass('all')">{{ t('allNotice') }}</button>
        <button @click="handleSetFilter('today')" :class="buttonClass('today')">{{ t('todayNotice') }}</button>
        <button @click="handleSetFilter('yesterday')" :class="buttonClass('yesterday')">{{ t('yesterdayNotice') }}</button>
        <button @click="handleSetFilter('this_week')" :class="buttonClass('this_week')">{{ t('thisWeekNotice') }}</button>
        <button @click="handleSetFilter('this_month')" :class="buttonClass('this_month')">{{ t('thisMonthNotice') }}</button>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl shadow">
      <div class="flex items-center justify-between p-4">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('latestNotice') }}</h2>
        <button @click="handleManualRefresh()" :class="['rounded text-gray-900 dark:text-white']"><i class="fas fa-sync-alt"></i></button>
      </div>
      <ul v-if="!loadingExpenses" class="divide-y divide-gray-100 dark:divide-gray-700">
        <li v-for="expense in latestTen" :key="expense._id" @click="handleShowDetail(expense._id)" class="p-4 flex items-center justify-between cursor-pointer">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ expense.item }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ expense.store }} • {{ expense.category }} • {{ expense.payment_source }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ timeAgo(expense.input_date || expense.Date, expense.input_time) }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">Rp {{ formatNumber(toNumber(expense.amount)) }}</div>
          </div>
        </li>
      </ul>
      <div v-else class="p-4 space-y-2">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-1"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { formatNumber as formatCurrency, parseNumber, isSameDay as sameDay, isSameMonth as sameMonth, isThisWeek as thisWeek, timeAgo as relativeTimeAgo } from '../services/utilityService.js';

export default {
  name: "HomeView",
  data() {
    return {};
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    pendingCount() {
      return this.appStore.pendingCount;
    },
    topCategory() {
      return this.appStore.topCategory;
    },
    topSource() {
      return this.appStore.topSource;
    },
    topStore() {
      return this.appStore.topStore;
    },
    filter() {
      return this.appStore.filter;
    },
    latestTen() {
      return this.appStore.latestTen;
    },
    loadingExpenses() {
      return this.appStore.loadingExpenses;
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
    totalToday() {
      return this.appStore.totalToday;
    },
    totalMonth() {
      return this.appStore.totalMonth;
    },
  },
  methods: {
    buttonClass(value) {
      return [
        'py-2 px-4 rounded-md text-xs text-nowrap font-medium',
        this.filter === value ? this.accentBgClass + ' text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600',
      ];
    },
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    formatNumber(n) {
      return formatCurrency(n);
    },
    toNumber(v) {
      try {
        return typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0;
      } catch (e) {
        return 0;
      }
    },
    timeAgo(dateString, timeString) {
      const result = relativeTimeAgo(dateString, timeString);
      if (result === 'justNow') return this.appStore.t('justNow');
      return result
        .replace('yearsAgo', this.appStore.t('yearsAgo'))
        .replace('monthsAgo', this.appStore.t('monthsAgo'))
        .replace('daysAgo', this.appStore.t('daysAgo'))
        .replace('hoursAgo', this.appStore.t('hoursAgo'))
        .replace('minutesAgo', this.appStore.t('minutesAgo'));
    },
    handleTriggerSync() {
      this.$emit('trigger-sync');
    },
    handleSetFilter(filterType) {
      this.appStore.filter = filterType;
      this.$emit('set-filter', filterType);
    },
    handleManualRefresh() {
      this.$emit('manual-refresh');
    },
    handleShowDetail(expenseId) {
      this.$emit('show-detail', expenseId);
    },
  },
};
</script>
