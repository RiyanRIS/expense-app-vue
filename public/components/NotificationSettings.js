// Notification Settings Component
const NotificationSettings = {
  props: {
    enabled: Boolean,
    loading: Boolean
  },
  
  emits: ['toggle'],
  
  template: `
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
            @click="$emit('toggle')"
            :disabled="loading"
            v-haptic:light
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :class="enabled ? 'bg-indigo-600' : 'bg-gray-200'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="enabled ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
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
