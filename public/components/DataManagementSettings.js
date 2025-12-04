// Data Management Settings Component
const DataManagementSettings = {
  props: {
    exporting: Boolean,
    importing: Boolean
  },
  
  emits: ['export', 'import', 'update-app'],
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          <i class="fas fa-database mr-2"></i>
          {{ t('dataManagement') }}
        </h3>
      </div>
      
      <div class="p-5 space-y-4">
        <!-- Export Data -->
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0 mr-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t('exportData') }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('exportDataDescription') || 'Unduh semua data pengeluaran Anda' }}
            </p>
          </div>
          <button
            @click="$emit('export')"
            :disabled="exporting"
            v-haptic:medium
            class="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-transform text-sm font-medium whitespace-nowrap"
          >
            <i class="fas fa-download mr-1.5"></i>
            {{ exporting ? t('exporting') : t('export') }}
          </button>
        </div>

        <!-- Import Data -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex-1 min-w-0 mr-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t('importData') }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('importDataDescription') || 'Pulihkan data dari file backup' }}
            </p>
          </div>
          <div>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept=".json"
              class="hidden"
            />
            <button
              @click="$refs.fileInput.click()"
              :disabled="importing"
              v-haptic:medium
              class="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 active:scale-95 transition-transform text-sm font-medium whitespace-nowrap"
            >
              <i class="fas fa-upload mr-1.5"></i>
              {{ importing ? t('importing') : t('import') }}
            </button>
          </div>
        </div>

        <!-- Update App -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex-1 min-w-0 mr-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t('updateApp') || 'Perbarui Aplikasi' }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('updateAppDescription') || 'Perbarui cache dengan versi terbaru dari server' }}
            </p>
          </div>
          <button
            @click="$emit('update-app')"
            v-haptic:medium
            class="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-transform text-sm font-medium whitespace-nowrap"
          >
            <i class="fas fa-sync-alt mr-1.5"></i>
            {{ t('update') || 'Perbarui' }}
          </button>
        </div>
      </div>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    handleFileChange(event) {
      this.$emit('import', event);
    }
  }
};
