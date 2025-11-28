// Signup View Component
const SignupView = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t('createAccount') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t('signupSubtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleSignup" class="mt-8 space-y-6">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('fullName') }}
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                :placeholder="t('fullNamePlaceholder')"
              />
            </div>

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
                minlength="6"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ t('passwordRequirement') }}
              </p>
            </div>

            <div>
              <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('confirmPassword') }}
              </label>
              <input
                id="passwordConfirm"
                v-model="form.passwordConfirm"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? t('creatingAccount') : t('signup') }}
          </button>

          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('haveAccount') }}
              <router-link
                to="/login"
                class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                {{ t('loginNow') }}
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
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      },
      loading: false,
      error: null
    };
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    async handleSignup() {
      // Validate passwords match
      if (this.form.password !== this.form.passwordConfirm) {
        this.error = this.t('passwordMismatch');
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.auth.signup({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password
        });
        
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update root auth state
        this.$root.currentUser = response.user;
        
        // Show success message
        this.$root.showNotification(this.t('signupSuccess') || 'Akun berhasil dibuat!', 'success');
        
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        // Display error message from server or fallback
        const errorMessage = error.message || this.t('signupFailed') || 'Pendaftaran gagal';
        this.error = errorMessage;
        
        // Also show notification for better visibility
        this.$root.showNotification(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    }
  }
};
