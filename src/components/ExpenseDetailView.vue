<template>
  <main class="space-y-4">
    <section v-if="selectedExpense" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('expenseDetail') }}</h2>
        <button @click="$emit('change-tab','home')" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
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
        <button @click="$emit('edit-expense', selectedExpense)" :class="['w-full py-2 rounded text-white', accentBgClass]">{{ t('edit') }}</button>
        <button @click="$emit('delete-expense', selectedExpense._id)" class="w-full py-2 rounded bg-red-600 text-white">{{ t('delete') }}</button>
      </div>
    </section>

    <div v-else class="text-center text-gray-500 dark:text-gray-400 pt-4">{{ t('noExpenseSelected') }}</div>
  </main>
</template>

<script>
export default {
  name: "ExpenseDetailView",
  props: {
    selectedExpense: Object,
    accentBgClass: String,
    t: Function,
    formatNumber: Function,
    toNumber: Function,
  },
};
</script>
