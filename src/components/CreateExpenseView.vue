<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <form @submit.prevent="$emit('submit-new')" class="space-y-3">
      <div class="flex justify-between items-center mb-2">
        <button type="button" @click="$emit('change-month', -1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-left"></i></button>
        <span class="font-semibold text-lg text-gray-500 dark:text-gray-400">{{ monthName }} {{ currentYear }}</span>
        <button type="button" @click="$emit('change-month', 1)" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"><i class="fas fa-chevron-right"></i></button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        <div class="text-gray-500 dark:text-gray-400" v-for="dayName in t('dayNames')" :key="dayName">{{ dayName }}</div>
        <template v-for="day in calendarDays" :key="`${currentYear}-${currentMonth}-${day}`">
          <div v-if="day" @click="$emit('select-day', day)" :class="['p-2 rounded-full cursor-pointer', newForm.date === new Date(currentYear, currentMonth, day).toISOString().slice(0, 10) ? accentBgClass + ' text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400']">{{ day }}</div>
          <div v-else class="p-2"></div>
        </template>
      </div>

      <div v-if="quickAddItems.length > 0" class="flex space-x-2 overflow-x-auto pb-2">
        <button v-for="(item, index) in quickAddItems" :key="item._id || index" type="button" @click="$emit('apply-quick-add-item', item)" class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium text-white" :class="accentBgClass">{{ item.name }} (Rp {{ formatNumber(item.amount) }})</button>
      </div>

      <div class="relative">
        <input v-model="newForm.item" :placeholder="t('itemPlaceholder')" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100', itemError ? 'border-red-500 ring-1 ring-red-500' : '']" />
      </div>
      <p v-if="itemError" class="text-red-500 text-xs mt-1">{{ t('itemError') }}</p>

      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-500 dark:text-gray-400">Rp</span></div>
        <input v-model="newForm.displayAmount" type="text" inputmode="numeric" :placeholder="t('amountPlaceholder')" @input="$emit('handle-amount-input', $event)" :class="['p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 pl-10', amountError ? 'border-red-500 ring-1 ring-red-500' : '']" />
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
export default {
  name: "CreateExpenseView",
  props: {
    newForm: Object,
    quickAddItems: Array,
    categories: Array,
    paymentSources: Array,
    accentBgClass: String,
    itemError: Boolean,
    amountError: Boolean,
    t: Function,
    monthName: String,
    currentYear: Number,
    currentMonth: Number,
    calendarDays: Array,
    formatNumber: Function,
  },
};
</script>
