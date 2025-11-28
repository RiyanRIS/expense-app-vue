// Forgot Password View Component
const ForgotPasswordView = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t('forgotPasswordTitle') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t('forgotPasswordSubtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {{ success }}
          </div>

          <div v-if="!success">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('email') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              :placeholder="t('emailPlaceholder')"
            />
          </div>

          <div v-if="!success">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ loading ? t('sendingLink') : t('sendResetLink') }}
            </button>
          </div>

          <div class="text-center">
            <router-link
              to="/login"
              class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <i class="fas fa-arrow-left mr-1"></i>
              {{ t('backToLogin') }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
  `,

  data() {
    return {
      form: {
        email: ''
      },
      loading: false,
      error: null,
      success: null
    };
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    async handleSubmit() {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        await apiClient.auth.forgotPassword(this.form.email);
        this.success = this.t('resetLinkSent');
        this.form.email = '';
      } catch (error) {
        this.error = error.message || this.t('resetPasswordFailed');
      } finally {
        this.loading = false;
      }
    }
  }
};
