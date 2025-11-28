// Profile View Component - Mobile Optimized
const ProfileView = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Header with Description -->
        <div class="mb-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ t('profile') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('profileDescription') }}
          </p>
        </div>

        <!-- Update Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            {{ t('updateProfile') }}
          </h2>

          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <div v-if="profileError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {{ profileError }}
            </div>

            <div v-if="profileSuccess" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
              {{ profileSuccess }}
            </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('fullName') }}
                </label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  :placeholder="t('fullNamePlaceholder')"
                />
              </div>

              <button
                type="submit"
                :disabled="profileLoading"
                class="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 active:scale-95 transition-all"
              >
                {{ profileLoading ? (t('saving') || 'Menyimpan...') : t('save') }}
              </button>
            </form>
          </div>

          <!-- Change Password Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              {{ t('changePassword') }}
            </h2>

            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div v-if="passwordError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {{ passwordError }}
              </div>

              <div v-if="passwordSuccess" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
                {{ passwordSuccess }}
              </div>

              <!-- Current Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('currentPassword') || 'Password Saat Ini' }}
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('newPassword') }}
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {{ t('passwordRequirement') }}
                </p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('confirmNewPassword') }}
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                :disabled="passwordLoading"
                class="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
              >
                {{ passwordLoading ? (t('saving') || 'Menyimpan...') : t('changePassword') }}
              </button>
            </form>
          </div>

        <!-- Danger Zone -->
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
          <h3 class="text-lg font-bold text-red-900 dark:text-red-400 mb-2">
            {{ t('dangerZone') || 'Zona Berbahaya' }}
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300 mb-4">
            {{ t('deleteAccountWarning') || 'Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.' }}
          </p>
          <button
            @click="handleDeleteAccount"
            class="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium active:scale-95 transition-transform"
          >
            <i class="fas fa-exclamation-triangle mr-2"></i>
            {{ t('deleteAccount') || 'Hapus Akun' }}
          </button>
        </div>
      </div>

      <!-- Mobile Bottom Navigation -->
      <mobile-bottom-nav></mobile-bottom-nav>
    </div>
  `,

  data() {
    return {
      profileForm: {
        name: '',
        avatar: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      profileLoading: false,
      passwordLoading: false,
      profileError: null,
      profileSuccess: null,
      passwordError: null,
      passwordSuccess: null
    };
  },

  created() {
    this.loadUserData();
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    loadUserData() {
      if (this.$root.currentUser) {
        this.profileForm.name = this.$root.currentUser.name;
        this.profileForm.avatar = this.$root.currentUser.avatar || '';
      }
    },

    async handleUpdateProfile() {
      this.profileLoading = true;
      this.profileError = null;
      this.profileSuccess = null;

      try {
        const response = await apiClient.auth.updateProfile(this.profileForm);
        
        // Update user data
        this.$root.currentUser = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
        
        this.profileSuccess = this.t('profileUpdatedSuccessfully');
        this.$root.showNotification(this.t('profileUpdatedSuccessfully'), 'success');
      } catch (error) {
        this.profileError = error.message || this.t('failedToUpdateProfile');
      } finally {
        this.profileLoading = false;
      }
    },

    async handleChangePassword() {
      // Validate passwords match
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = this.t('passwordMismatch');
        return;
      }

      this.passwordLoading = true;
      this.passwordError = null;
      this.passwordSuccess = null;

      try {
        await apiClient.auth.changePassword({
          oldPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        });
        
        this.passwordSuccess = this.t('passwordChangedSuccessfully');
        this.$root.showNotification(this.t('passwordChangedSuccessfully'), 'success');
        
        // Reset form
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      } catch (error) {
        this.passwordError = error.message || this.t('failedToChangePassword');
      } finally {
        this.passwordLoading = false;
      }
    },

    async handleDeleteAccount() {
      const confirmed = confirm(
        this.t('confirmDeleteAccount') || 'Apakah Anda yakin ingin menghapus akun? Semua data akan dihapus secara permanen.'
      );
      
      if (!confirmed) return;

      const doubleConfirmed = confirm(
        this.t('confirmDeleteAccountFinal') || 'Ini adalah tindakan yang tidak dapat dibatalkan. Apakah Anda benar-benar yakin?'
      );
      
      if (!doubleConfirmed) return;

      try {
        await apiClient.auth.deleteAccount();
        this.$root.showNotification(this.t('accountDeleted') || 'Akun berhasil dihapus', 'success');
        this.$root.logout();
      } catch (error) {
        alert(error.message || this.t('failedToDeleteAccount') || 'Gagal menghapus akun');
      }
    }
  }
};
