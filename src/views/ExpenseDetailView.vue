<template>
  <main class="space-y-4">
    <section v-if="selectedExpense" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('expenseDetail') }}</h2>
        <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('item') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedExpense.item }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('amount') }}</div>
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(toNumber(selectedExpense.amount)) }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">Toko</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedExpense.store }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('category') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedExpense.category }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('paymentSource') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedExpense.payment_source }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('date') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedExpense.date }}</div>
      </div>

      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('time') }}</div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ selectedExpense.input_date }} {{ selectedExpense.input_time }}</div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button @click="handleEditExpense" :class="['w-full py-2 rounded text-white', accentBgClass]">{{ t('edit') }}</button>
        <button @click="handleDeleteExpense" class="w-full py-2 rounded bg-red-600 text-white">{{ t('delete') }}</button>
      </div>
    </section>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 pt-4">{{ t('noExpenseSelected') }}</div>
  </main>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { deleteExpense } from '../services/dataService.js';
import { formatNumber as formatCurrency, parseNumber, showToast } from '../services/utilityService.js';
import Swal from 'sweetalert2';

export default {
  name: "ExpenseDetailView",
  data() {
    return {};
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
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
  },
  methods: {
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
    handleGoBack() {
      this.$router.push('/home');
    },
    handleEditExpense() {
      if (this.selectedExpense) {
        this.$router.push(`/edit/${this.selectedExpense._id}`);
      }
    },
    async handleDeleteExpense() {
      if (!this.selectedExpense) return;

      const result = await Swal.fire({
        title: this.t('confirmDelete'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.t('delete'),
        cancelButtonText: this.t('cancel'),
      });

      if (result.isConfirmed) {
        try {
          await deleteExpense(this.selectedExpense._id);
          await this.appStore.fetchExpenses();
          showToast('Expense deleted');
          this.$router.push('/home');
        } catch (error) {
          console.error('Error deleting expense:', error);
          showToast('Error deleting expense', 'error');
        }
      }
    },
  },
};
</script>
