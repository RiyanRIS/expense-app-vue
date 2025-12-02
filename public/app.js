// Main Application - Refactored with Vue Router
// This is the new version of app.js that uses Vue Router
// To use this file, rename app.js to app-old-backup.js and rename this file to app.js

const { createApp } = Vue;

const app = createApp({
  template: `
    <div>
      <!-- Router View - All pages will be rendered here -->
      <router-view></router-view>
      
      <!-- Notification Container - Fixed for Mobile -->
      <div class="fixed top-4 left-4 right-4 z-50 space-y-3 pointer-events-none">
        <transition-group name="fade" tag="div" class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'mx-auto max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl border pointer-events-auto transform transition-all duration-300',
              notification.type === 'success' ? 'border-green-200 dark:border-green-700' : '',
              notification.type === 'error' ? 'border-red-200 dark:border-red-700' : '',
              notification.type === 'warning' ? 'border-yellow-200 dark:border-yellow-700' : '',
              notification.type === 'info' ? 'border-blue-200 dark:border-blue-700' : ''
            ]"
          >
            <div class="p-4">
              <div class="flex items-start space-x-3">
                <!-- Icon -->
                <div class="flex-shrink-0 mt-0.5">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    notification.type === 'success' ? 'bg-green-100 dark:bg-green-900' : '',
                    notification.type === 'error' ? 'bg-red-100 dark:bg-red-900' : '',
                    notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' : '',
                    notification.type === 'info' ? 'bg-blue-100 dark:bg-blue-900' : ''
                  ]">
                    <i :class="[
                      'text-sm',
                      notification.type === 'success' ? 'fas fa-check text-green-600 dark:text-green-400' : '',
                      notification.type === 'error' ? 'fas fa-times text-red-600 dark:text-red-400' : '',
                      notification.type === 'warning' ? 'fas fa-exclamation text-yellow-600 dark:text-yellow-400' : '',
                      notification.type === 'info' ? 'fas fa-info text-blue-600 dark:text-blue-400' : ''
                    ]"></i>
                  </div>
                </div>
                
                <!-- Message -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                    {{ notification.message }}
                  </p>
                </div>
                
                <!-- Close Button -->
                <div class="flex-shrink-0">
                  <button
                    @click="removeNotification(notification.id)"
                    class="inline-flex rounded-full p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    <span class="sr-only">Close</span>
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  `,
  
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
      
      // Auto remove after 5 seconds (extended for delete account flow)
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    },

    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
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
