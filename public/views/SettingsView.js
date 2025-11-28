// Settings View Component
const SettingsView = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Header with Description -->
        <div class="mb-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ t('settings') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('settingsDescription') }}
          </p>
        </div>

        <!-- Appearance Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <i class="fas fa-palette mr-2"></i>
              {{ t('appearance') }}
            </h3>
          </div>
          
          <div class="p-5 space-y-4">
            <!-- Dark Mode Toggle -->
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('darkMode') }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('darkModeDescription') || 'Gunakan tema gelap untuk mengurangi kelelahan mata' }}
                </p>
              </div>
              <button
                @click="toggleDarkMode"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                :class="darkMode ? 'bg-indigo-600' : 'bg-gray-200'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="darkMode ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>

            <!-- Language Selector -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('language') }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('languageDescription') || 'Pilih bahasa antarmuka aplikasi' }}
                </p>
              </div>
              <select
                v-model="selectedLanguage"
                @change="changeLanguage"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data Management -->
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
                @click="exportData"
                :disabled="exporting"
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
                  @change="importData"
                  accept=".json"
                  class="hidden"
                />
                <button
                  @click="$refs.fileInput.click()"
                  :disabled="importing"
                  class="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 active:scale-95 transition-transform text-sm font-medium whitespace-nowrap"
                >
                  <i class="fas fa-upload mr-1.5"></i>
                  {{ importing ? t('importing') : t('import') }}
                </button>
              </div>
            </div>

            <!-- Clear Cache -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex-1 min-w-0 mr-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('clearCache') }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('clearCacheDescription') || 'Hapus data cache lokal aplikasi' }}
                </p>
              </div>
              <button
                @click="clearCache"
                class="px-4 py-2.5 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 active:scale-95 transition-transform text-sm font-medium whitespace-nowrap"
              >
                <i class="fas fa-broom mr-1.5"></i>
                {{ t('clear') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <i class="fas fa-bell mr-2"></i>
              {{ t('notifications') }}
            </h3>
          </div>
          
          <div class="p-5">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0 mr-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('pushNotifications') }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ t('pushNotificationsDescription') || 'Terima notifikasi untuk pengingat dan pembaruan' }}
                </p>
              </div>
              <button
                @click="toggleNotifications"
                :disabled="notificationLoading"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                :class="notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="notificationsEnabled ? 'translate-x-6' : 'translate-x-1'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <i class="fas fa-info-circle mr-2"></i>
              {{ t('about') }}
            </h3>
          </div>
          
          <div class="p-5 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ t('version') }}</span>
              <span class="font-medium text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ t('lastUpdate') }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ new Date().toLocaleDateString() }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ t('appDescription') || 'Aplikasi manajemen pengeluaran pribadi yang membantu Anda melacak dan mengelola keuangan dengan mudah.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      darkMode: false,
      selectedLanguage: 'id',
      notificationsEnabled: false,
      notificationLoading: false,
      exporting: false,
      importing: false
    };
  },

  created() {
    this.darkMode = this.$root.darkMode;
    this.selectedLanguage = this.$root.language;
    this.checkNotificationPermission();
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    toggleDarkMode() {
      this.$root.darkMode = !this.$root.darkMode;
      this.darkMode = this.$root.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      this.$root.showNotification(
        this.t('settingsUpdatedSuccessfully') || 'Pengaturan berhasil diperbarui',
        'success'
      );
    },

    changeLanguage() {
      this.$root.language = this.selectedLanguage;
      localStorage.setItem('language', this.selectedLanguage);
      this.$root.showNotification(
        this.t('languageChangedSuccessfully') || 'Bahasa berhasil diubah',
        'success'
      );
    },

    checkNotificationPermission() {
      if ('Notification' in window) {
        this.notificationsEnabled = Notification.permission === 'granted';
      }
    },

    async toggleNotifications() {
      if (!('Notification' in window)) {
        this.$root.showNotification(
          this.t('notificationsNotSupported') || 'Browser tidak mendukung notifikasi',
          'error'
        );
        return;
      }

      this.notificationLoading = true;

      try {
        if (this.notificationsEnabled) {
          // Disable notifications (can't actually revoke permission, just update UI)
          this.notificationsEnabled = false;
          this.$root.showNotification(
            this.t('notificationsDisabled') || 'Notifikasi dinonaktifkan',
            'info'
          );
        } else {
          // Request notification permission
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            this.notificationsEnabled = true;
            this.$root.showNotification(
              this.t('notificationsEnabled') || 'Notifikasi diaktifkan',
              'success'
            );
          } else {
            this.$root.showNotification(
              this.t('notificationPermissionDenied') || 'Izin notifikasi ditolak',
              'error'
            );
          }
        }
      } catch (error) {
        console.error('Notification toggle error:', error);
        this.$root.showNotification(
          this.t('failedToToggleNotifications') || 'Gagal mengubah pengaturan notifikasi',
          'error'
        );
      } finally {
        this.notificationLoading = false;
      }
    },

    async exportData() {
      this.exporting = true;

      try {
        const response = await apiClient.backup.export();
        
        // Create download link
        const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.$root.showNotification(
          this.t('dataExportedSuccessfully') || 'Data berhasil diekspor',
          'success'
        );
      } catch (error) {
        console.error('Export error:', error);
        this.$root.showNotification(
          error.message || this.t('failedToExportData') || 'Gagal mengekspor data',
          'error'
        );
      } finally {
        this.exporting = false;
      }
    },

    async importData(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.importing = true;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        await apiClient.backup.import(data);

        this.$root.showNotification(
          this.t('dataImportedSuccessfully') || 'Data berhasil diimpor',
          'success'
        );

        // Reload page to refresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Import error:', error);
        this.$root.showNotification(
          error.message || this.t('failedToImportData') || 'Gagal mengimpor data',
          'error'
        );
      } finally {
        this.importing = false;
        event.target.value = ''; // Reset file input
      }
    },

    clearCache() {
      const confirmed = confirm(
        this.t('confirmClearCache') || 'Yakin ingin menghapus cache? Aplikasi akan dimuat ulang.'
      );
      
      if (!confirmed) return;

      try {
        // Clear localStorage except authentication
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        localStorage.clear();
        
        if (token) localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', user);

        // Clear sessionStorage
        sessionStorage.clear();

        this.$root.showNotification(
          this.t('cacheCleared') || 'Cache berhasil dihapus',
          'success'
        );

        // Reload page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Clear cache error:', error);
        this.$root.showNotification(
          this.t('failedToClearCache') || 'Gagal menghapus cache',
          'error'
        );
      }
    }
  }
};
