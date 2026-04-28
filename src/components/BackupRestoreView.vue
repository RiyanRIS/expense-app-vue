<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('backupRestore') }}</h2>
      <button @click="$emit('change-tab', 'settings')" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <div class="font-medium text-gray-800 dark:text-gray-200 mb-2">{{ t('backupData') }}</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ t('backupNotice') }}</p>
        <button @click="$emit('download-backup')" :class="['py-2 px-4 rounded text-white font-semibold', accentBgClass]">{{ t('downloadBackup') }}</button>
      </div>
      <div class="border rounded-lg p-4 dark:border-gray-700">
        <div class="font-medium text-gray-800 dark:text-gray-200 mb-2">{{ t('restoreData') }}</div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ t('restoreNotice') }}</p>
        <input type="file" accept="application/json" @change="$emit('handle-restore-file', $event)" class="text-sm text-gray-700 dark:text-gray-200" />
        <div class="mt-3 flex items-center gap-2">
          <button @click="$emit('restore-data')" :disabled="!restoreFile" :class="['py-2 px-4 rounded text-white font-semibold', accentBgClass, !restoreFile ? 'opacity-50 cursor-not-allowed' : '']">{{ t('uploadRestore') }}</button>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ restoreStatus }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BackupRestoreView",
  props: {
    restoreFile: Object,
    restoreStatus: String,
    accentBgClass: String,
    t: Function,
  },
};
</script>
