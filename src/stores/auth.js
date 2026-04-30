import { defineStore } from 'pinia';
import { showToast } from '../services/utilityService.js';
import { loginUser } from '../services/authService.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    currentUser: null,
    authToken: null,
    authLoading: false,
    authError: null,
  }),
  actions: {
    async login(loginForm) {
        try{
            const data = await loginUser(loginForm);
            this.authToken = data.token;
            this.currentUser = data.user;
            this.isAuthenticated = true;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            this.authError = error.message || 'Login gagal';
            showToast(this.authError, 'error');
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
    relogin() {
      this.authToken = null;
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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