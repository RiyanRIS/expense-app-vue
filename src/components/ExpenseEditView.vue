<template>
  <section v-if="selectedExpense" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <form @submit.prevent="$emit('submit-edit')" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('editExpense') }}</h2>
        <button @click="$emit('change-tab','detail')" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>

      <div class="flex justify-between items-center mb-2">
        <button type="button" @click="$emit('change-month', -1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-left"></i></button>
        <span class="font-semibold text-lg text-gray-500 dark:text-gray-400">{{ monthName }} {{ currentYear }}</span>
        <button type="button" @click="$emit('change-month', 1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-right"></i></button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        <div class="text-gray-500 dark:text-gray-400" v-for="dayName in t('dayNames')" :key="dayName">{{ dayName }}</div>
        <template v-for="day in calendarDays" :key="`${currentYear}-${currentMonth}-${day}`">
          <div v-if="day" @click="$emit('select-day-edit', day)" :class="['p-2 rounded-full cursor-pointer', selectedExpense.date === new Date(currentYear, currentMonth, day).toISOString().slice(0, 10) ? accentBgClass + ' text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400']">{{ day }}</div>
          <div v-else class="p-2"></div>
        </template>
      </div>

      <div class="relative">
        <input v-model="selectedExpense.item" :placeholder="t('itemPlaceholder')" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100', itemError ? 'border-red-500 ring-1 ring-red-500' : '']" />
      </div>
      <p v-if="itemError" class="text-red-500 text-xs mt-1">{{ t('itemError') }}</p>

      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-500 dark:text-gray-400">Rp</span></div>
        <input v-model="selectedExpense.displayAmount" type="text" inputmode="numeric" :placeholder="t('amountPlaceholder')" @input="$emit('handle-edit-amount-input', $event)" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 pl-10', amountError ? 'border-red-500 ring-1 ring-red-500' : '']" />
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
export default {
  name: "ExpenseEditView",
  props: {
    selectedExpense: Object,
    categories: Array,
    paymentSources: Array,
    accentBgClass: String,
    t: Function,
    monthName: String,
    currentYear: Number,
    currentMonth: Number,
    calendarDays: Array,
    itemError: Boolean,
    amountError: Boolean,
  },
};
</script>
