<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3 mb-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('managePaymentSourcesTitle') }}</h2>
        <button @click="$emit('change-tab', 'settings')" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>
      <form @submit.prevent="savePaymentSource" class="space-y-3">
        <input type="text" v-model="localPaymentSourceName" :placeholder="t('newPaymentSourceNamePlaceholder')" required class="text-sm p-2 border border-gray-300 rounded-md shadow-sm w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
        <div class="flex space-x-2">
          <button type="button" @click="$emit('cancel-edit-payment-source')" class="text-sm w-full py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 mt-2">{{ t('cancel') }}</button>
          <button type="submit" :class="['text-sm w-full py-2 rounded text-white mt-2', accentBgClass]"><i class="fas fa-save"></i> {{ t('save') }}</button>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <h2 class="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('listOfPaymentSources') }}</h2>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="source in paymentSources" :key="source" @click="$emit('edit-payment-source', source)" class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ source }}</span>
          <button @click.stop="$emit('delete-payment-source-confirm', source)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><i class="fas fa-trash"></i></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentSourceView",
  props: {
    newPaymentSourceName: String,
    paymentSources: Array,
    editingPaymentSource: String,
    accentBgClass: String,
    t: Function,
  },
  data() {
    return {
      localPaymentSourceName: this.newPaymentSourceName || "",
    };
  },
  watch: {
    newPaymentSourceName(value) {
      this.localPaymentSourceName = value || "";
    },
  },
  methods: {
    savePaymentSource() {
      this.$emit('save-payment-source', this.localPaymentSourceName);
    },
  },
};
</script>
