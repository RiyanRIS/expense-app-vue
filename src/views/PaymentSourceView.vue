<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3 mb-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('managePaymentSourcesTitle') }}</h2>
        <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>
      <form @submit.prevent="handleSavePaymentSource" class="space-y-3">
        <input type="text" v-model="newPaymentSourceName" :placeholder="t('newPaymentSourceNamePlaceholder')" required class="text-sm p-2 border border-gray-300 rounded-md shadow-sm w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
        <div class="flex space-x-2">
          <button type="button" @click="handleCancelEdit" class="text-sm w-full py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 mt-2">{{ t('cancel') }}</button>
          <button type="submit" :class="['text-sm w-full py-2 rounded text-white mt-2', accentBgClass]"><i class="fas fa-save"></i> {{ t('save') }}</button>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <h2 class="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('listOfPaymentSources') }}</h2>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="source in paymentSources" :key="source" @click="handleEditPaymentSource(source)" class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ source }}</span>
          <button @click.stop="handleDeletePaymentSource(source)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><i class="fas fa-trash"></i></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { createPaymentSource, updatePaymentSource, deletePaymentSource } from '../services/dataService.js';
import { showToast } from '../services/utilityService.js';
import Swal from 'sweetalert2';

export default {
  name: "PaymentSourceView",
  data() {
    return {
      newPaymentSourceName: '',
      editingPaymentSource: null,
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    paymentSources() {
      return this.appStore.paymentSources;
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
  },
  methods: {
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    handleGoBack() {
      this.$router.push('/settings');
    },
    handleEditPaymentSource(source) {
      this.editingPaymentSource = source;
      this.newPaymentSourceName = source;
    },
    handleCancelEdit() {
      this.editingPaymentSource = null;
      this.newPaymentSourceName = '';
    },
    async handleSavePaymentSource() {
      if (!this.newPaymentSourceName.trim()) {
        showToast('Payment source name cannot be empty', 'error');
        return;
      }

      try {
        if (this.editingPaymentSource) {
          // Update existing payment source
          await updatePaymentSource(this.editingPaymentSource, { name: this.newPaymentSourceName });
        } else {
          // Create new payment source
          await createPaymentSource({ name: this.newPaymentSourceName });
        }
        
        await this.appStore.fetchPaymentSources();
        showToast('Payment source saved successfully');
        this.newPaymentSourceName = '';
        this.editingPaymentSource = null;
      } catch (error) {
        console.error('Error saving payment source:', error);
        showToast('Error saving payment source', 'error');
      }
    },
    async handleDeletePaymentSource(source) {
      const result = await Swal.fire({
        title: this.t('confirmDelete'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.t('delete'),
        cancelButtonText: this.t('cancel'),
      });

      if (result.isConfirmed) {
        try {
          await deletePaymentSource(source);
          await this.appStore.fetchPaymentSources();
          showToast('Payment source deleted');
        } catch (error) {
          console.error('Error deleting payment source:', error);
          showToast('Error deleting payment source', 'error');
        }
      }
    },
  },
};
</script>
