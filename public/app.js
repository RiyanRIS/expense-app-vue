// Main Application - Refactored with Vue Router
// This is the new version of app.js that uses Vue Router
// To use this file, rename app.js to app-old-backup.js and rename this file to app.js

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      // Global state
      currentUser: null,
      darkMode: false,
      language: 'id',
      isOnline: navigator.onLine || true,
      notifications: [],
      // Event emitter simple
      events: {}
    };
  },

  created() {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      this.darkMode = savedDarkMode === 'true';
    } else {
      // Check system preference
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Apply dark mode class
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }

    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.language = savedLanguage;
    }

    // Initialize user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }

    // Network status listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showNotification(this.t('backOnline') || 'Koneksi kembali', 'success');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showNotification(this.t('offlineMode') || 'Mode offline', 'warning');
    });
  },

  methods: {
    // Translation helper
    t(key) {
      return translations[this.language]?.[key] || key;
    },

    // Notification system
    showNotification(message, type = 'info') {
      const id = Date.now();
      const notification = {
        id,
        message,
        type, // success, error, warning, info
        show: true
      };
      
      this.notifications.push(notification);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
      }, 3000);
    },

    // Logout handler
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.currentUser = null;
      this.$router.push('/login');
      this.showNotification(this.t('loggedOut'), 'info');
    },

    // Simple event emitter for component communication
    $on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },

    $emit(event, ...args) {
      if (this.events[event]) {
        this.events[event].forEach(callback => callback(...args));
      }
    },

    $off(event, callback) {
      if (!this.events[event]) return;
      if (callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      } else {
        this.events[event] = [];
      }
    }
  }
});

// Register global components
app.component('mobile-top-bar', MobileTopBar);
app.component('mobile-bottom-nav', MobileBottomNav);

// Use router
app.use(router);

// Mount app
app.mount('#app');
