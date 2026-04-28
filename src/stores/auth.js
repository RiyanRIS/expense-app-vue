import { defineStore } from 'pinia';
import { loginUser, registerUser, logoutUser, updateProfile, changePassword as changePasswordService } from './services/authService.js';
import { showToast } from './services/utilityService.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    currentUser: null,
    authToken: null,
    authLoading: false,
    authError: null,
  }),
  actions: {
    async login(credentials) {
      this.authLoading = true;
      this.authError = null;
      try {
        const data = await loginUser(credentials);
        this.authToken = data.token;
        this.currentUser = data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Login berhasil!', 'success');
        return true;
      } catch (error) {
        this.authError = error.message;
        showToast(error.message, 'error');
        return false;
      } finally {
        this.authLoading = false;
      }
    },
    async signup(userData) {
      this.authLoading = true;
      this.authError = null;
      try {
        const data = await registerUser(userData);
        this.authToken = data.token;
        this.currentUser = data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Pendaftaran berhasil!', 'success');
        return true;
      } catch (error) {
        this.authError = error.message;
        showToast(error.message, 'error');
        return false;
      } finally {
        this.authLoading = false;
      }
    },
    logout() {
      this.authToken = null;
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast('Logout berhasil!', 'info');
    },
    checkAuth() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          this.authToken = token;
          this.currentUser = JSON.parse(user);
          this.isAuthenticated = true;
        } catch (error) {
          this.logout();
        }
      }
    },
  },
});