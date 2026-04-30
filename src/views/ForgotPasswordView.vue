<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <div class="text-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('forgotPasswordTitle') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('forgotPasswordSubtitle') }}</p>
    </div>

    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('email') }}</label>
        <input v-model="forgotPasswordForm.email" type="email" :placeholder="t('emailPlaceholder')" required class="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
      </div>

      <button type="submit" :class="['w-full py-3 rounded-lg text-white font-medium', accentBgClass]">{{ t('resetPassword') }}</button>
    </form>

    <div class="mt-6 text-center">
      <button @click="handleGoToLogin" class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">{{ t('loginNow') }}</button>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { forgotPassword } from '../services/authService.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "ForgotPasswordView",
  data() {
    return {
      forgotPasswordForm: {
        email: '',
      },
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
  },
  methods: {
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    async handleForgotPassword() {
      try {
        await forgotPassword(this.forgotPasswordForm.email);
        showToast('Check your email for reset instructions');
        this.forgotPasswordForm.email = '';
        this.$router.push('/login');
      } catch (error) {
        console.error('Error requesting password reset:', error);
        showToast('Error requesting password reset', 'error');
      }
    },
    handleGoToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>
