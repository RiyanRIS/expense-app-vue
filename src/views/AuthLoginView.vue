<template>
  <main class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
      <div class="text-center mb-6">
        <i class="fas fa-wallet text-5xl mb-4" :class="accentTextClass"></i>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ t('loginTitle') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('loginSubtitle') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('email') }}</label>
          <input
            v-model="loginForm.email"
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
            v-model="loginForm.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:border-transparent"
            :class="accentRingClass"
            autocomplete="current-password"
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
          {{ authLoading ? t('loggingIn') : t('login') }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('noAccount') }}
          <button @click="switchToSignup" :class="[accentTextClass, 'font-medium']">{{ t('signupNow') }}</button>
        </p>
      </div>

      <div v-if="authError" class="mt-4 text-center">
        <button @click="$emit('change-tab','forgot-password')" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">{{ t('forgotPassword') }}</button>
      </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from '../stores/auth.js';
import { useAppStore } from '../stores/app.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "AuthLoginView",
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
        await useAuthStore().login(this.loginForm);
       
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
  },
};
</script>
