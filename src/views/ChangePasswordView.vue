<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ t('changePassword') }}</h2>
      <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
    </div>

    <form @submit.prevent="handleChangePassword" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('newPassword') }}</label>
        <input v-model="changePasswordForm.newPassword" type="password" :placeholder="t('newPassword')" required class="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('confirmNewPassword') }}</label>
        <input v-model="changePasswordForm.confirmPassword" type="password" :placeholder="t('confirmNewPassword')" required class="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
      </div>

      <button type="submit" :class="['w-full py-3 rounded-lg text-white font-medium', accentBgClass]">{{ t('changePassword') }}</button>
    </form>
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { changePassword as changePasswordService } from '../services/authService.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "ChangePasswordView",
  data() {
    return {
      changePasswordForm: {
        newPassword: '',
        confirmPassword: '',
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
    handleGoBack() {
      this.$router.push('/settings');
    },
    async handleChangePassword() {
      if (this.changePasswordForm.newPassword !== this.changePasswordForm.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }

      try {
        await changePasswordService(this.changePasswordForm.newPassword);
        showToast('Password changed successfully');
        this.changePasswordForm.newPassword = '';
        this.changePasswordForm.confirmPassword = '';
        this.$router.push('/settings');
      } catch (error) {
        console.error('Error changing password:', error);
        showToast('Error changing password', 'error');
      }
    },
  },
};
</script>
