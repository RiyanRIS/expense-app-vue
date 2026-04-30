<template>
  <section v-if="selectedExpense" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <form @submit.prevent="handleSubmitEdit" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('editExpense') }}</h2>
        <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>

      <div class="flex justify-between items-center mb-2">
        <button type="button" @click="handleChangeMonth(-1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-left"></i></button>
        <span class="font-semibold text-lg text-gray-500 dark:text-gray-400">{{ monthName }} {{ currentYear }}</span>
        <button type="button" @click="handleChangeMonth(1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-right"></i></button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        <div class="text-gray-500 dark:text-gray-400" v-for="dayName in t('dayNames')" :key="dayName">{{ dayName }}</div>
        <template v-for="day in calendarDays" :key="`${currentYear}-${currentMonth}-${day}`">
          <div v-if="day" @click="handleSelectDay(day)" :class="['p-2 rounded-full cursor-pointer', selectedExpense.date === new Date(currentYear, currentMonth, day).toISOString().slice(0, 10) ? accentBgClass + ' text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400']">{{ day }}</div>
          <div v-else class="p-2"></div>
        </template>
      </div>

      <div class="relative">
        <input v-model="selectedExpense.item" :placeholder="t('itemPlaceholder')" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100', itemError ? 'border-red-500 ring-1 ring-red-500' : '']" />
      </div>
      <p v-if="itemError" class="text-red-500 text-xs mt-1">{{ t('itemError') }}</p>

      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-500 dark:text-gray-400">Rp</span></div>
        <input v-model="selectedExpense.displayAmount" type="text" inputmode="numeric" :placeholder="t('amountPlaceholder')" @input="handleAmountInput" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 pl-10', amountError ? 'border-red-500 ring-1 ring-red-500' : '']" />
      </div>
      <p v-if="amountError" class="text-red-500 text-xs mt-1">{{ t('amountError') }}</p>

      <input v-model="selectedExpense.store" placeholder="Toko" class="p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />

      <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('category') }}</div>
      <div class="flex flex-wrap gap-2 items-center">
        <label v-for="category in categories" :key="category" class="flex items-center gap-2 p-2 border rounded cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
          <input type="radio" name="category-edit" :value="category" v-model="selectedExpense.category" />
          <span class="text-sm">{{ category }}</span>
        </label>
      </div>

      <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('paymentSource') }}</div>
      <div class="flex flex-wrap gap-2 items-center">
        <label v-for="source in paymentSources" :key="source" class="flex items-center gap-2 p-2 border rounded cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
          <input type="radio" name="payment_source_edit" :value="source" v-model="selectedExpense.payment_source" />
          <span class="text-sm">{{ source }}</span>
        </label>
      </div>

      <button :class="['w-full py-2 rounded text-white', accentBgClass]">{{ t('save') }}</button>
    </form>
  </section>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { updateExpense } from '../services/dataService.js';
import { formatNumber as formatCurrency, showToast } from '../services/utilityService.js';

export default {
  name: "ExpenseEditView",
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      itemError: false,
      amountError: false,
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    expenseId() {
      return this.$route.params.id;
    },
    selectedExpense() {
      return this.appStore.expenses.find(e => e._id === this.expenseId);
    },
    categories() {
      return this.appStore.categories;
    },
    paymentSources() {
      return this.appStore.paymentSources;
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
      if (this.selectedExpense) {
        this.selectedExpense.date = new Date(this.currentYear, this.currentMonth, day).toISOString().slice(0, 10);
      }
    },
    handleAmountInput(event) {
      const value = event.target.value.replace(/[^0-9]/g, '');
      if (this.selectedExpense) {
        this.selectedExpense.displayAmount = value ? formatCurrency(parseInt(value)) : '';
        this.selectedExpense.amount = value ? parseInt(value) : 0;
      }
      this.amountError = false;
    },
    handleGoBack() {
      this.$router.push(`/detail/${this.expenseId}`);
    },
    async handleSubmitEdit() {
      if (!this.selectedExpense) return;

      this.itemError = !this.selectedExpense.item.trim();
      this.amountError = this.selectedExpense.amount <= 0;

      if (this.itemError || this.amountError) {
        return;
      }

      try {
        const payload = {
          item: this.selectedExpense.item,
          amount: this.selectedExpense.amount,
          store: this.selectedExpense.store,
          category: this.selectedExpense.category,
          payment_source: this.selectedExpense.payment_source,
          date: this.selectedExpense.date,
          input_date: this.selectedExpense.input_date,
          input_time: this.selectedExpense.input_time,
        };

        await updateExpense(this.expenseId, payload);
        await this.appStore.fetchExpenses();
        showToast('Expense updated');
        this.$router.push(`/detail/${this.expenseId}`);
      } catch (error) {
        console.error('Error updating expense:', error);
        showToast('Error updating expense', 'error');
      }
    },
  },
};
</script>
