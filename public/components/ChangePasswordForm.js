// Change Password Form Component
const ChangePasswordForm = {
  props: {
    loading: Boolean,
    error: String,
    success: String
  },
  
  emits: ['submit', 'clear-error', 'clear-success'],
  
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    };
  },
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        {{ t('changePassword') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>{{ error }}</span>
          <button type="button" @click="$emit('clear-error')" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>{{ success }}</span>
          <button type="button" @click="$emit('clear-success')" class="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <!-- Current Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('currentPassword') || 'Password Saat Ini' }}
          </label>
          <div class="relative">
            <input
              v-model="currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('newPassword') }}
          </label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {{ t('passwordRequirement') }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('confirmNewPassword') }}
          </label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
        >
          {{ loading ? (t('saving') || 'Menyimpan...') : t('changePassword') }}
        </button>
      </form>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    handleSubmit() {
      this.$emit('submit', {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      });
      
      // Reset form after submit
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }
};
