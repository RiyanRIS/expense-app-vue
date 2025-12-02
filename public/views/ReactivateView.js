// Reactivate Account View Component
const ReactivateView = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4">
            <i class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-xl"></i>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Reaktivasi Akun
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Akun Anda telah disuspend. Masukkan kredensial Anda untuk mengaktifkan kembali akun.
          </p>
        </div>

        <form @submit.prevent="handleReactivate" class="mt-8 space-y-6">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {{ success }}
          </div>

          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
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
                placeholder="email@example.com"
                @input="validateEmail"
                @blur="validateEmail"
              />
              <p v-if="form.email && emailValid === false" class="mt-1 text-xs text-red-500">
                Format email tidak valid
              </p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
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
                Password tidak boleh kosong
              </p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ loading ? 'Memproses...' : 'Reaktivasi Akun' }}
          </button>

          <div class="text-center space-y-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Akun masih aktif?
              <router-link
                to="/login"
                class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Masuk di sini
              </router-link>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Belum punya akun?
              <router-link
                to="/signup"
                class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Daftar Sekarang
              </router-link>
            </p>
          </div>
        </form>

        <!-- Information Box -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-info-circle text-blue-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Informasi Reaktivasi
              </h3>
              <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <ul class="list-disc list-inside space-y-1">
                  <li>Masukkan email dan password yang sama dengan akun sebelumnya</li>
                  <li>Akun akan langsung aktif setelah verifikasi berhasil</li>
                  <li>Semua data sebelumnya akan tetap tersimpan (kecuali yang dihapus permanen)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
      error: null,
      success: null,
      showPassword: false,
      emailValid: null,
      passwordValid: null
    };
  },

  computed: {
    isFormValid() {
      return this.emailValid === true && this.passwordValid === true;
    }
  },

  methods: {
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
        return;
      }
      
      this.passwordValid = this.form.password.trim().length > 0;
    },

    validateAllFields() {
      this.validateEmail();
      this.validatePassword();
      return this.emailValid && this.passwordValid;
    },

    async handleReactivate() {
      // Clear previous messages
      this.error = null;
      this.success = null;
      
      // Validate all fields
      if (!this.validateAllFields()) {
        this.error = 'Mohon periksa kembali semua field';
        return;
      }

      console.log('Starting reactivation process...', {
        email: this.form.email.trim(),
        hasPassword: !!this.form.password
      });

      this.loading = true;

      try {
        // Call reactivate API using apiClient
        console.log('Calling reactivate API...');
        const data = await apiClient.auth.reactivateAccount({
          email: this.form.email.trim(),
          password: this.form.password
        });
        
        console.log('Reactivate API response:', data);

        // Store token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Update root auth state
          this.$root.currentUser = data.user;
        }

        this.success = 'Akun berhasil diaktifkan! Mengalihkan ke dashboard...';
        
        // Show success notification
        this.$root.showNotification('Akun berhasil diaktifkan!', 'success');
        
        // Redirect to dashboard after success
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Reactivation error:', error);
        
        // More detailed error handling
        let errorMessage = 'Gagal mengaktifkan akun. Silakan coba lagi.';
        
        if (error.message) {
          if (error.message.includes('Invalid email or password')) {
            errorMessage = 'Email atau password tidak valid. Pastikan Anda menggunakan kredensial yang benar.';
          } else if (error.message.includes('Account is already active')) {
            errorMessage = 'Akun sudah aktif. Silakan langsung login.';
          } else if (error.message.includes('cannot be reactivated')) {
            errorMessage = 'Akun tidak dapat diaktifkan kembali. Silakan hubungi support.';
          } else {
            errorMessage = error.message;
          }
        }
        
        this.error = errorMessage;
        
        // Also show notification for better visibility
        this.$root.showNotification(this.error, 'error');
      } finally {
        this.loading = false;
      }
    }
  }
};