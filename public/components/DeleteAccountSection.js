// Delete Account Section Component
const DeleteAccountSection = {
  props: {
    show: Boolean,
    loading: Boolean,
    error: String
  },
  
  emits: ['confirm-delete', 'cancel', 'clear-error', 'show-modal'],
  
  data() {
    return {
      password: '',
      showPassword: false
    };
  },
  
  template: `
    <div>
      <!-- Danger Zone -->
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
        <h3 class="text-lg font-bold text-red-900 dark:text-red-400 mb-2">
          {{ t('dangerZone') || 'Zona Berbahaya' }}
        </h3>
        <p class="text-sm text-red-700 dark:text-red-300 mb-4">
          {{ t('deleteAccountWarning') || 'Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.' }}
        </p>
        <button
          @click="$emit('show-modal')"
          v-haptic:strong
          class="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium active:scale-95 transition-transform"
        >
          <i class="fas fa-exclamation-triangle mr-2"></i>
          {{ t('deleteAccount') || 'Hapus Akun' }}
        </button>
      </div>

      <!-- Delete Account Modal -->
      <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleCancel">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full" @click.stop>
          <h3 class="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            {{ t('confirmDeleteAccount') || 'Konfirmasi Hapus Akun' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ t('deleteAccountWarning') || 'Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.' }}
          </p>
          
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center justify-between">
            <span>{{ error }}</span>
            <button type="button" @click="$emit('clear-error')" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('currentPassword') || 'Password Saat Ini' }}
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="••••••••"
                @keyup.enter="handleConfirm"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {{ t('passwordConfirmDeleteAccount') || 'Masukkan password Anda untuk konfirmasi penghapusan akun' }}
            </p>
          </div>

          <div class="flex space-x-3">
            <button
              @click="handleCancel"
              v-haptic:light
              class="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 font-medium transition-colors"
            >
              {{ t('cancel') || 'Batal' }}
            </button>
            <button
              @click="handleConfirm"
              :disabled="loading || !password"
              v-haptic:delete
              class="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 font-medium transition-colors"
            >
              {{ loading ? (t('deleting') || 'Menghapus...') : (t('deleteAccount') || 'Hapus Akun') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    handleConfirm() {
      if (this.password) {
        this.$emit('confirm-delete', this.password);
      }
    },
    
    handleCancel() {
      this.password = '';
      this.showPassword = false;
      this.$emit('cancel');
    }
  }
};
