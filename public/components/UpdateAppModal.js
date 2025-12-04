// Update App Modal Component
const UpdateAppModal = {
  props: {
    show: Boolean,
    updating: Boolean
  },
  
  emits: ['cancel', 'confirm'],
  
  template: `
    <div 
      v-if="show" 
      class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="$emit('cancel')"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <i class="fas fa-sync-alt text-indigo-500 mr-3"></i>
            {{ t('updateApp') || 'Perbarui Aplikasi' }}
          </h3>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('confirmUpdateApp') || 'Perbarui aplikasi ke versi terbaru?' }}
          </p>
          <div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-indigo-500 mr-3 mt-1"></i>
              <div class="text-sm text-indigo-700 dark:text-indigo-300">
                <p class="font-medium mb-1">{{ t('updateAppInfo') || 'Yang akan dilakukan:' }}</p>
                <ul class="space-y-1 ml-4 list-disc">
                  <li>{{ t('updateAppStep1') || 'Mengunduh file terbaru' }}</li>
                  <li>{{ t('updateAppStep2') || 'Memperbarui tampilan aplikasi' }}</li>
                  <li>{{ t('updateAppStep3') || 'Aplikasi akan dimuat ulang' }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            @click="$emit('cancel')"
            :disabled="updating"
            v-haptic:light
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform disabled:opacity-50"
          >
            {{ t('cancel') || 'Batal' }}
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="updating"
            v-haptic:success
            class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition-transform"
          >
            <i v-if="updating" class="fas fa-spinner fa-spin mr-2"></i>
            {{ updating ? (t('updatingApp') || 'Sedang memperbarui...') : (t('update') || 'Perbarui') }}
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
