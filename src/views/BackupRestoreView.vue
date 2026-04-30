<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('backupRestore') }}</h2>
      <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <div class="font-medium text-gray-800 dark:text-gray-200 mb-2">{{ t('backupData') }}</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ t('backupNotice') }}</p>
        <button @click="handleDownloadBackup" :class="['py-2 px-4 rounded text-white font-semibold', accentBgClass]">{{ t('downloadBackup') }}</button>
      </div>
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <div class="font-medium text-gray-800 dark:text-gray-200 mb-2">{{ t('restoreData') }}</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ t('restoreNotice') }}</p>
        <input type="file" accept="application/json" @change="handleRestoreFile" class="text-sm text-gray-700 dark:text-gray-200" />
        <div class="mt-3 flex items-center gap-2">
          <button @click="handleRestoreData" :disabled="!restoreFile" :class="['py-2 px-4 rounded text-white font-semibold', accentBgClass, !restoreFile ? 'opacity-50 cursor-not-allowed' : '']">{{ t('uploadRestore') }}</button>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ restoreStatus }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { downloadBackup as downloadBackupService, restoreBackup as restoreBackupService } from '../services/dataService.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "BackupRestoreView",
  data() {
    return {
      restoreFile: null,
      restoreStatus: '',
    };
  },
  computed: {
    appStore() {
      return useAppStore();
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
    async handleDownloadBackup() {
      try {
        this.restoreStatus = 'Downloading...';
        await downloadBackupService();
        this.restoreStatus = 'Download complete';
        showToast('Backup downloaded');
      } catch (error) {
        console.error('Error downloading backup:', error);
        this.restoreStatus = 'Download failed';
        showToast('Error downloading backup', 'error');
      }
    },
    handleRestoreFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.restoreFile = file;
        this.restoreStatus = `File selected: ${file.name}`;
      }
    },
    async handleRestoreData() {
      if (!this.restoreFile) {
        showToast('Please select a file', 'error');
        return;
      }

      try {
        this.restoreStatus = 'Restoring...';
        const formData = new FormData();
        formData.append('file', this.restoreFile);
        
        await restoreBackupService(formData);
        
        // Refresh all data after restore
        await this.appStore.fetchExpenses();
        await this.appStore.fetchCategories();
        await this.appStore.fetchPaymentSources();
        
        this.restoreStatus = 'Restore complete';
        showToast('Data restored successfully');
        this.restoreFile = null;
      } catch (error) {
        console.error('Error restoring backup:', error);
        this.restoreStatus = 'Restore failed';
        showToast('Error restoring backup', 'error');
      }
    },
  },
};
</script>
