// Login View Component
const LoginView = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t('loginTitle') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t('loginSubtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div class="space-y-4">
            <div>
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

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('password') }}
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <router-link
              to="/forgot-password"
              class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              {{ t('forgotPassword') }}
            </router-link>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? t('loggingIn') : t('login') }}
          </button>

          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('noAccount') }}
              <router-link
                to="/signup"
                class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                {{ t('signupNow') }}
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,

  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    };
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    async handleLogin() {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.auth.login(this.form);
        
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update root auth state
        this.$root.currentUser = response.user;
        
        // Show success message
        this.$root.showNotification(this.t('loginSuccess') || 'Login berhasil!', 'success');
        
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        // Display error message from server or fallback
        const errorMessage = error.message || this.t('loginFailed') || 'Login gagal';
        this.error = errorMessage;
        
        // Also show notification for better visibility
        this.$root.showNotification(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    }
  }
};
