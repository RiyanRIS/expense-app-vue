// Profile View Component - Mobile Optimized
const ProfileView = {
  components: {
    'profile-form': ProfileForm,
    'change-password-form': ChangePasswordForm,
    'delete-account-section': DeleteAccountSection
  },

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

        <!-- Profile Form Component -->
        <profile-form
          :user="$root.currentUser"
          :loading="profileLoading"
          :error="profileError"
          :success="profileSuccess"
          @submit="handleUpdateProfile"
          @clear-error="profileError = null"
          @clear-success="profileSuccess = null"
        />

        <!-- Change Password Form Component -->
        <change-password-form
          :loading="passwordLoading"
          :error="passwordError"
          :success="passwordSuccess"
          @submit="handleChangePassword"
          @clear-error="passwordError = null"
          @clear-success="passwordSuccess = null"
        />

        <!-- Delete Account Section Component -->
        <delete-account-section
          :show="showDeleteModal"
          :loading="deleteLoading"
          :error="deleteError"
          @delete="handleDeleteAccount"
          @cancel="cancelDeleteAccount"
          @clear-error="deleteError = null"
        />
      </div>

      <!-- Mobile Bottom Navigation -->
      <mobile-bottom-nav></mobile-bottom-nav>
    </div>
  `,

  data() {
    return {
      profileLoading: false,
      passwordLoading: false,
      profileError: null,
      profileSuccess: null,
      passwordError: null,
      passwordSuccess: null,
      showDeleteModal: false,
      deleteLoading: false,
      deleteError: null
    };
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    async handleUpdateProfile(formData) {
      this.profileLoading = true;
      this.profileError = null;
      this.profileSuccess = null;

      try {
        const response = await apiClient.auth.updateProfile(formData);
        
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

    async handleChangePassword(passwordData) {
      // Validate current password and new password is provided
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        this.passwordError = this.t('passwordRequired') || 'Password diperlukan';
        return;
      }

      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        this.passwordError = this.t('passwordMismatch');
        return;
      }

      // Validate current password and new password length
      if (passwordData.currentPassword.length < 6 || passwordData.newPassword.length < 6) {
        this.passwordError = this.t('passwordTooShort');
        return;
      }

      this.passwordLoading = true;
      this.passwordError = null;
      this.passwordSuccess = null;

      try {
        await apiClient.auth.changePassword({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          newPasswordConfirm: passwordData.confirmPassword
        });
        
        this.passwordSuccess = this.t('passwordChangedSuccessfully');

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
      this.deleteError = null;
    },

    async handleDeleteAccount(password) {
      if (!password) {
        this.deleteError = this.t('passwordRequired') || 'Password diperlukan untuk konfirmasi';
        return;
      }

      this.deleteLoading = true;
      this.deleteError = null;

      try {
        const response = await apiClient.auth.deleteAccount({
          password: password
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
