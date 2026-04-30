<template>
  <main class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
      <div class="text-center mb-6">
        <i class="fas fa-user-plus text-5xl mb-4" :class="accentTextClass"></i>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('createAccount') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('signupSubtitle') }}</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('fullName') }}</label>
          <input
            v-model="signupForm.name"
            type="text"
            required
            :placeholder="t('fullNamePlaceholder')"
            class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:border-transparent"
            :class="accentRingClass"
            autocomplete="name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('email') }}</label>
          <input
            v-model="signupForm.email"
            type="email"
            required
            :placeholder="t('emailPlaceholder')"
            class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:border-transparent"
            :class="accentRingClass"
            autocomplete="email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('password') }}</label>
          <input
            v-model="signupForm.password"
            type="password"
            required
            minlength="6"
            :placeholder="t('passwordRequirement')"
            class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:border-transparent"
            :class="accentRingClass"
            autocomplete="new-password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('confirmPassword') }}</label>
          <input
            v-model="signupForm.passwordConfirm"
            type="password"
            required
            minlength="6"
            :placeholder="t('confirmPassword')"
            class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:border-transparent"
            :class="accentRingClass"
            autocomplete="new-password"
          />
        </div>

        <div v-if="authError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400"><i class="fas fa-exclamation-circle mr-2"></i>{{ authError }}</p>
        </div>

        <button
          type="submit"
          :disabled="authLoading"
          :class="[accentBgClass, 'w-full text-white py-3 rounded-lg font-medium transition-opacity active:scale-95', authLoading ? 'opacity-50 cursor-not-allowed' : '']"
        >
          <i v-if="authLoading" class="fas fa-spinner fa-spin mr-2"></i>
          {{ authLoading ? t('creatingAccount') : t('signup') }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('haveAccount') }}
          <button @click="switchToLogin" :class="[accentTextClass, 'font-medium']">{{ t('loginNow') }}</button>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from '../stores/auth.js';
import { useAppStore } from '../stores/app.js';
import { loginUser, registerUser } from '../services/authService.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "AuthSignupView",
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      signupForm: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
      authLoading: false,
      authError: null,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    appStore() {
      return useAppStore();
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
    accentRingClass() {
      return this.appStore.accentRingClass;
    },
    accentTextClass() {
      return this.appStore.accentTextClass;
    },
    t() {
      return this.appStore.t;
    },
  },
  methods: {
    async handleLogin() {
      this.authLoading = true;
      this.authError = null;
      try {
        const data = await loginUser(this.loginForm);
        
        // Manually update auth store
        this.authStore.authToken = data.token;
        this.authStore.currentUser = data.user;
        this.authStore.isAuthenticated = true;
        
        // Save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showToast(this.t('loginSuccess'), 'success');
        this.loginForm = { email: '', password: '' };
        await this.appStore.fetchExpenses();
        await this.appStore.fetchCategories();
        await this.appStore.fetchPaymentSources();
        this.$router.push('/home');
      } catch (error) {
        this.authError = error.message;
        showToast(error.message, 'error');
      } finally {
        this.authLoading = false;
      }
    },
    async handleSignup() {
      if (this.signupForm.password !== this.signupForm.passwordConfirm) {
        this.authError = this.t('passwordMismatch');
        showToast(this.t('passwordMismatch'), 'error');
        return;
      }
      this.authLoading = true;
      this.authError = null;
      try {
        const data = await registerUser(this.signupForm);
        
        // Manually update auth store
        this.authStore.authToken = data.token;
        this.authStore.currentUser = data.user;
        this.authStore.isAuthenticated = true;
        
        // Save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showToast(this.t('signupSuccess'), 'success');
        this.signupForm = { name: '', email: '', password: '', passwordConfirm: '' };
        await this.appStore.fetchExpenses();
        await this.appStore.fetchCategories();
        await this.appStore.fetchPaymentSources();
        this.$router.push('/home');
      } catch (error) {
        this.authError = error.message;
        showToast(error.message, 'error');
      } finally {
        this.authLoading = false;
      }
    },
    switchToLogin() {
      this.$router.push('/login');
    },
    switchToSignup() {
      this.$router.push('/signup');
    },
  },
};
</script>
