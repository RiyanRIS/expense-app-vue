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
                autofocus="autofocus"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white',
                  nameValid === null ? 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500' :
                  nameValid ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                  'border-red-300 focus:ring-red-500 focus:border-red-500'
                ]"
                :placeholder="t('fullNamePlaceholder')"
                @input="validateName"
                @blur="validateName"
              />
              <p v-if="form.name && nameValid === false" class="mt-1 text-xs text-red-500">
                {{ t('nameRequired') || 'Nama lengkap harus diisi dan minimal 2 karakter' }}
              </p>
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
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white',
                  emailValid === null ? 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500' :
                  emailValid ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                  'border-red-300 focus:ring-red-500 focus:border-red-500'
                ]"
                :placeholder="t('emailPlaceholder')"
                @input="validateEmail"
                @blur="validateEmail"
              />
              <p v-if="form.email && emailValid === false" class="mt-1 text-xs text-red-500">
                {{ t('emailInvalid') || 'Format email tidak valid' }}
              </p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('password') }}
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  :class="[
                    'mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white',
                    passwordValid === null ? 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500' :
                    passwordValid ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                    'border-red-300 focus:ring-red-500 focus:border-red-500'
                  ]"
                  placeholder="••••••••"
                  @input="validatePassword"
                  @blur="validatePassword"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p v-if="form.password && passwordValid === false" class="mt-1 text-xs text-red-500">
                {{ t('passwordTooShort') || 'Password minimal 6 karakter' }}
              </p>
            </div>

            <div>
              <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('confirmPassword') }}
              </label>
              <div class="relative">
                <input
                  id="passwordConfirm"
                  v-model="form.passwordConfirm"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  required
                  :class="[
                    'mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white',
                    passwordsMatch === null ? 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500' :
                    passwordsMatch ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                    'border-red-300 focus:ring-red-500 focus:border-red-500'
                  ]"
                  placeholder="••••••••"
                  @input="validatePasswords"
                />
                <button
                  type="button"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
                >
                  <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p v-if="form.passwordConfirm && passwordsMatch === false" class="mt-1 text-xs text-red-500">
                {{ t('passwordMismatch') || 'Password tidak cocok' }}
              </p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      error: null,
      showPassword: false,
      showPasswordConfirm: false,
      nameValid: null,
      emailValid: null,
      passwordValid: null,
      passwordsMatch: null
    };
  },

  computed: {
    isFormValid() {
      return this.nameValid === true && 
             this.emailValid === true && 
             this.passwordValid === true && 
             this.passwordsMatch === true;
    }
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    validateName() {
      if (this.form.name === '') {
        this.nameValid = null;
        return;
      }
      
      const name = this.form.name.trim();
      this.nameValid = name.length >= 2;
    },

    validateEmail() {
      if (this.form.email === '') {
        this.emailValid = null;
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailValid = emailRegex.test(this.form.email.trim());
    },

    validatePassword() {
      if (this.form.password === '') {
        this.passwordValid = null;
        this.validatePasswords(); // Update password match status
        return;
      }
      
      const password = this.form.password.trim();
      this.passwordValid = password.length >= 6;
      this.validatePasswords(); // Update password match status
    },

    validatePasswords() {
      if (this.form.passwordConfirm === '') {
        this.passwordsMatch = null;
        return;
      }
      
      // Trim whitespace untuk memastikan perbandingan yang akurat
      const password = this.form.password.trim();
      const passwordConfirm = this.form.passwordConfirm.trim();
      
      this.passwordsMatch = password === passwordConfirm;
    },

    validateAllFields() {
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      this.validatePasswords();
      
      return this.nameValid && this.emailValid && this.passwordValid && this.passwordsMatch;
    },

    async handleSignup() {
      // Clear previous error
      this.error = null;
      
      // Validate all fields
      if (!this.validateAllFields()) {
        this.error = this.t('formValidationFailed') || 'Mohon periksa kembali semua field';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.auth.signup({
          name: this.form.name.trim(),
          email: this.form.email.trim(),
          password: this.form.password.trim(),
          passwordConfirm: this.form.passwordConfirm.trim()
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
