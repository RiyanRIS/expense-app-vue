// Settings View Component
const SettingsView = {
  components: {
    'appearance-settings': AppearanceSettings,
    'data-management-settings': DataManagementSettings,
    'notification-settings': NotificationSettings,
    'about-section': AboutSection
  },

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

        <!-- Appearance Settings Component -->
        <appearance-settings
          :dark-mode="darkMode"
          :language="selectedLanguage"
          @toggle-dark-mode="toggleDarkMode"
          @change-language="changeLanguage"
        />

        <!-- Data Management Settings Component -->
        <data-management-settings
          :exporting="exporting"
          :importing="importing"
          @export="exportData"
          @import="importData"
          @clear-cache="clearCache"
        />

        <!-- Notification Settings Component -->
        <notification-settings
          :enabled="notificationsEnabled"
          :loading="notificationLoading"
          @toggle="toggleNotifications"
        />

        <!-- About Section Component -->
        <about-section />
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

    changeLanguage(language) {
      this.selectedLanguage = language;
      this.$root.language = language;
      localStorage.setItem('language', language);
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
