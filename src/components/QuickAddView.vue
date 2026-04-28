<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('quickAddItems') }}</h2>
      <button @click="$emit('change-tab', 'settings')" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
    </div>

    <form @submit.prevent="$emit('save-quick-add-item')" class="space-y-3">
      <input
        v-model="newQuickAddItem.name"
        placeholder="Nama Item (e.g., Kopi)"
        class="text-sm p-2 border rounded-md shadow-sm w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        required
      />
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 dark:text-gray-400">Rp</span>
        </div>
        <input
          v-model="newQuickAddItem.displayAmount"
          type="text"
          inputmode="numeric"
          :placeholder="t('amountPlaceholder')"
          @input="$emit('handle-quick-add-amount-input', $event)"
          class="text-sm p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 pl-10"
          required
        />
      </div>
      <select
        v-model="newQuickAddItem.category"
        class="text-sm p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        required
      >
        <option value="" disabled>{{ t('selectCategory') }}</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select
        v-model="newQuickAddItem.paymentSource"
        class="text-sm p-2 border rounded w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        required
      >
        <option value="" disabled>{{ t('selectPaymentSource') }}</option>
        <option v-for="source in paymentSources" :key="source" :value="source">{{ source }}</option>
      </select>
      <div class="flex space-x-2">
        <button type="button" @click="$emit('cancel-edit-quick-add-item')" class="text-sm w-full py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 mt-2">{{ t('cancel') }}</button>
        <button type="submit" :class="['text-sm w-full py-2 rounded text-white mt-2', accentBgClass]"> <i class="fas fa-save"></i> {{ t('save') }}</button>
      </div>
    </form>

    <div class="mt-6">
      <h3 class="text-md font-semibold mb-2 mt-2 text-gray-800 dark:text-gray-200">{{ t('quickAddItemsList') }}</h3>
      <ul v-if="quickAddItems.length > 0" class="divide-y divide-gray-100 dark:divide-gray-700">
        <li v-for="(item, index) in quickAddItems" :key="item._id || index" class="py-3 flex items-center justify-between" @click="$emit('edit-quick-add-item-form', index)">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Rp {{ formatNumber(item.amount) }} • {{ item.category }} • {{ item.paymentSource }}</div>
          </div>
          <div class="flex gap-2">
            <button @click.stop="$emit('delete-quick-add-item-confirm', index)" class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><i class="fas fa-trash"></i></button>
          </div>
        </li>
      </ul>
      <p v-else class="text-sm text-gray-500 dark:text-gray-400">{{ t('noQuickAddItems') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuickAddView",
  props: {
    quickAddItems: Array,
    newQuickAddItem: Object,
    categories: Array,
    paymentSources: Array,
    accentBgClass: String,
    t: Function,
    formatNumber: Function,
  },
};
</script>
