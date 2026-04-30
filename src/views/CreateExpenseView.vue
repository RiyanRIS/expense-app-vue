<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <form @submit.prevent="handleSubmitNew" class="space-y-3">
      <div class="flex justify-between items-center mb-2">
        <button type="button" @click="handleChangeMonth(-1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-left"></i></button>
        <span class="font-semibold text-lg text-gray-500 dark:text-gray-400">{{ monthName }} {{ currentYear }}</span>
        <button type="button" @click="handleChangeMonth(1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-right"></i></button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        <div class="text-gray-500 dark:text-gray-400" v-for="dayName in t('dayNames')" :key="dayName">{{ dayName }}</div>
        <template v-for="day in calendarDays" :key="`${currentYear}-${currentMonth}-${day}`">
          <div v-if="day" @click="handleSelectDay(day)" :class="['p-2 rounded-full cursor-pointer', newForm.date === new Date(currentYear, currentMonth, day).toISOString().slice(0, 10) ? accentBgClass + ' text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400']">{{ day }}</div>
          <div v-else class="p-2"></div>
        </template>
      </div>

      <div v-if="quickAddItems.length > 0" class="flex space-x-2 overflow-x-auto pb-2">
        <button v-for="(item, index) in quickAddItems" :key="item._id || index" type="button" @click="handleApplyQuickAddItem(item)" class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium text-white" :class="accentBgClass">{{ item.name }} (Rp {{ formatNumber(item.amount) }})</button>
      </div>

      <div class="relative">
        <input v-model="newForm.item" :placeholder="t('itemPlaceholder')" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100', itemError ? 'border-red-500 ring-1 ring-red-500' : '']" />
      </div>
      <p v-if="itemError" class="text-red-500 text-xs mt-1">{{ t('itemError') }}</p>

      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-500 dark:text-gray-400">Rp</span></div>
        <input v-model="newForm.displayAmount" type="text" inputmode="numeric" :placeholder="t('amountPlaceholder')" @input="handleAmountInput" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 pl-10', amountError ? 'border-red-500 ring-1 ring-red-500' : '']" />
      </div>
      <p v-if="amountError" class="text-red-500 text-xs mt-1">{{ t('amountError') }}</p>

      <input v-model="newForm.store" placeholder="Toko" class="p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />

      <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('selectCategory') }}</div>
      <div class="flex flex-wrap gap-2 items-center">
        <label v-for="category in categories" :key="category" class="flex items-center gap-2 p-2 border rounded cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
          <input type="radio" name="category" :value="category" v-model="newForm.category" class="" />
          <span class="text-sm">{{ category }}</span>
        </label>
      </div>

      <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('selectPaymentSource') }}</div>
      <div class="flex flex-wrap gap-2 items-center">
        <label v-for="source in paymentSources" :key="source" class="flex items-center gap-2 p-2 border rounded cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
          <input type="radio" name="payment_source" :value="source" v-model="newForm.payment_source" class="" />
          <span class="text-sm">{{ source }}</span>
        </label>
      </div>

      <button :class="['w-full py-2 rounded text-white', accentBgClass]">{{ t('save') }}</button>
    </form>
  </section>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { createExpense } from '../services/dataService.js';
import { addPendingExpense } from '../services/localDataService.js';
import { formatNumber as formatCurrency, showToast } from '../services/utilityService.js';

export default {
  name: "CreateExpenseView",
  data() {
    return {
      newForm: {
        date: new Date().toISOString().slice(0, 10),
        item: '',
        amount: 0,
        displayAmount: '',
        store: '',
        category: '',
        payment_source: '',
      },
      itemError: false,
      amountError: false,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    categories() {
      return this.appStore.categories;
    },
    paymentSources() {
      return this.appStore.paymentSources;
    },
    quickAddItems() {
      return this.appStore.quickAddItems;
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
    monthNames() {
      return this.t('monthNames').split(',').map(m => m.trim());
    },
    monthName() {
      const names = this.monthNames;
      return names[this.currentMonth];
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      const days = new Array(firstDay).fill(null);
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      return days;
    },
  },
  methods: {
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    formatNumber(n) {
      return formatCurrency(n);
    },
    handleChangeMonth(offset) {
      this.currentMonth += offset;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
    },
    handleSelectDay(day) {
      this.newForm.date = new Date(this.currentYear, this.currentMonth, day).toISOString().slice(0, 10);
    },
    handleApplyQuickAddItem(item) {
      this.newForm.item = item.name;
      this.newForm.amount = item.amount;
      this.newForm.displayAmount = this.formatNumber(item.amount);
      this.newForm.category = item.category;
      this.newForm.payment_source = item.paymentSource;
    },
    handleAmountInput(event) {
      const value = event.target.value.replace(/[^0-9]/g, '');
      this.newForm.displayAmount = value ? this.formatNumber(parseInt(value)) : '';
      this.newForm.amount = value ? parseInt(value) : 0;
      this.amountError = false;
    },
    async handleSubmitNew() {
      this.itemError = !this.newForm.item.trim();
      this.amountError = this.newForm.amount <= 0;

      if (this.itemError || this.amountError) {
        return;
      }

      try {
        const payload = {
          item: this.newForm.item,
          amount: this.newForm.amount,
          store: this.newForm.store,
          category: this.newForm.category,
          payment_source: this.newForm.payment_source,
          date: this.newForm.date,
          input_date: this.newForm.date,
          input_time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        };

        await createExpense(payload);
        await this.appStore.fetchExpenses();
        showToast('Expense saved');
        this.$router.push('/home');
      } catch (error) {
        console.error('Error saving expense:', error);
        showToast('Error saving expense', 'error');
      }
    },
  },
};
</script>
