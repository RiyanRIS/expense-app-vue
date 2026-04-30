<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ t('profileManagement') }}</h2>
      <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
    </div>

    <form @submit.prevent="handleUpdateProfile" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('fullName') }}</label>
        <input v-model="profileForm.name" type="text" :placeholder="t('fullName')" required class="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('profilePhoto') }}</label>
        <input v-model="profileForm.avatar" type="url" :placeholder="t('profilePhotoPlaceholder')" class="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
      </div>

      <button type="submit" :class="['w-full py-3 rounded-lg text-white font-medium', accentBgClass]">{{ t('updateProfile') }}</button>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js';
import { useAppStore } from '../stores/app.js';
import { updateProfile } from '../services/authService.js';
import { showToast } from '../services/utilityService.js';

export default {
  name: "ProfileView",
  data() {
    return {
      profileForm: {
        name: '',
        avatar: '',
      },
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    authStore() {
      return useAuthStore();
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
  },
  mounted() {
    if (this.authStore.currentUser) {
      this.profileForm.name = this.authStore.currentUser.name || '';
      this.profileForm.avatar = this.authStore.currentUser.avatar || '';
    }
  },
  methods: {
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    handleGoBack() {
      this.$router.push('/settings');
    },
    async handleUpdateProfile() {
      try {
        await updateProfile(this.profileForm);
        
        // Update auth store
        if (this.authStore.currentUser) {
          this.authStore.currentUser.name = this.profileForm.name;
          this.authStore.currentUser.avatar = this.profileForm.avatar;
        }
        
        showToast('Profile updated');
        this.$router.push('/settings');
      } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
      }
    },
  },
};
</script>
