// About Section Component
const AboutSection = {
  template: `
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
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    }
  }
};
