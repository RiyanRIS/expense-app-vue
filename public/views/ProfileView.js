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
            <div v-if="profileError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
              <span>{{ profileError }}</span>
              <button @click="profileError = null" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>

            <div v-if="profileSuccess" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
              <span>{{ profileSuccess }}</span>
              <button @click="profileSuccess = null" class="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200">
                <i class="fas fa-times text-xs"></i>
              </button>
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
              <div v-if="passwordError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                <span>{{ passwordError }}</span>
                <button @click="passwordError = null" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
                  <i class="fas fa-times text-xs"></i>
                </button>
              </div>

              <div v-if="passwordSuccess" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                <span>{{ passwordSuccess }}</span>
                <button @click="passwordSuccess = null" class="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200">
                  <i class="fas fa-times text-xs"></i>
                </button>
              </div>

              <!-- Current Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('currentPassword') || 'Password Saat Ini' }}
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('newPassword') }}
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {{ t('passwordRequirement') }}
                </p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('confirmNewPassword') }}
                </label>
                <div class="relative">
                  <input
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
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
            @click="showDeleteModal = true"
            class="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium active:scale-95 transition-transform"
          >
            <i class="fas fa-exclamation-triangle mr-2"></i>
            {{ t('deleteAccount') || 'Hapus Akun' }}
          </button>
        </div>

        <!-- Delete Account Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="showDeleteModal = false">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full" @click.stop>
            <h3 class="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              {{ t('confirmDeleteAccount') || 'Konfirmasi Hapus Akun' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ t('deleteAccountWarning') || 'Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.' }}
            </p>
            
            <div v-if="deleteError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center justify-between">
              <span>{{ deleteError }}</span>
              <button @click="deleteError = null" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('currentPassword') || 'Password Saat Ini' }}
              </label>
              <div class="relative">
                <input
                  v-model="deletePassword"
                  :type="showDeletePassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                  @keyup.enter="handleDeleteAccount"
                />
                <button
                  type="button"
                  @click="showDeletePassword = !showDeletePassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i :class="showDeletePassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ t('passwordConfirmDeleteAccount') || 'Masukkan password Anda untuk konfirmasi penghapusan akun' }}
              </p>
            </div>

            <div class="flex space-x-3">
              <button
                @click="cancelDeleteAccount"
                class="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 font-medium transition-colors"
              >
                {{ t('cancel') || 'Batal' }}
              </button>
              <button
                @click="handleDeleteAccount"
                :disabled="deleteLoading || !deletePassword"
                class="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 font-medium transition-colors"
              >
                {{ deleteLoading ? (t('deleting') || 'Menghapus...') : (t('deleteAccount') || 'Hapus Akun') }}
              </button>
            </div>
          </div>
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
      passwordSuccess: null,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      showDeleteModal: false,
      deletePassword: '',
      showDeletePassword: false,
      deleteLoading: false,
      deleteError: null
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
      } catch (error) {
        this.profileError = error.message || this.t('failedToUpdateProfile');
      } finally {
        this.profileLoading = false;
      }
    },

    async handleChangePassword() {
      // Validate current password and new password is provided
      if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
        this.passwordError = this.t('passwordRequired') || 'Password diperlukan';
        return;
      }

      // Validate passwords match
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = this.t('passwordMismatch');
        return;
      }

      // Validate current password and new password length
      if (this.passwordForm.currentPassword.length < 6 || this.passwordForm.newPassword.length < 6) {
        this.passwordError = this.t('passwordTooShort');
        return;
      }

      this.passwordLoading = true;
      this.passwordError = null;
      this.passwordSuccess = null;

      try {
        await apiClient.auth.changePassword({
          oldPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword,
          newPasswordConfirm: this.passwordForm.confirmPassword
        });
        
        this.passwordSuccess = this.t('passwordChangedSuccessfully');
        
        // Reset form
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        // notifikasi berhasil mengubah password silahkan login ulang dengan password yang baru
        this.$root.showNotification(this.t('passwordChangedNotice'), 'info');
        
        // Clear local storage after notifications
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$root.currentUser = null;
        
        // Redirect to login after showing messages (extended time)
        this.$router.push('/login');
      } catch (error) {
        this.passwordError = error.message || this.t('failedToChangePassword');
      } finally {
        this.passwordLoading = false;
      }
    },

    cancelDeleteAccount() {
      this.showDeleteModal = false;
      this.deletePassword = '';
      this.showDeletePassword = false;
      this.deleteError = null;
    },

    async handleDeleteAccount() {
      if (!this.deletePassword) {
        this.deleteError = this.t('passwordRequired') || 'Password diperlukan untuk konfirmasi';
        return;
      }

      this.deleteLoading = true;
      this.deleteError = null;

      try {
        const response = await apiClient.auth.deleteAccount({
          password: this.deletePassword
        });
        
        console.log('Delete account response:', response);
        
        // Close modal first to remove overlay
        this.showDeleteModal = false;
        
        // Wait a bit for modal to close
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Show success notification with force visibility
        this.$root.showNotification(this.t('accountDeleted') || 'Akun berhasil dihapus', 'success');
        
        // Wait for notification to be visible
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Show final goodbye message
        this.$root.showNotification('Terima kasih telah menggunakan aplikasi kami. Sampai jumpa!', 'info');
        
        // Clear local storage after notifications
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$root.currentUser = null;
        
        // Redirect to login after showing messages (extended time)
        setTimeout(() => {
          this.$router.push('/login');
        }, 3500);
        
      } catch (error) {
        console.error('Delete account error:', error);
        this.deleteError = error.message || this.t('failedToDeleteAccount') || 'Gagal menghapus akun';
        
        // Show error notification
        this.$root.showNotification(this.deleteError, 'error');
      } finally {
        this.deleteLoading = false;
      }
    }
  }
};
