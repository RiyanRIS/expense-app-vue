// Mobile Top Bar Component
const MobileTopBar = {
  template: `
    <!-- Top Bar - Mobile Optimized -->
    <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 safe-area-top">
      <div class="flex items-center justify-between h-14 px-4">
        <!-- Left: Back button or Logo -->
        <div class="flex items-center space-x-3">
          <button
            v-if="showBackButton"
            @click="goBack"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            <i class="fas fa-arrow-left text-gray-700 dark:text-gray-300"></i>
          </button>
          <div v-else class="flex items-center space-x-2">
            <i class="fas fa-wallet text-xl text-indigo-600 dark:text-indigo-400"></i>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
          </div>
        </div>

        <!-- Center: Page title (if back button shown) -->
        <h1 v-if="showBackButton" class="text-base font-semibold text-gray-900 dark:text-white absolute left-1/2 transform -translate-x-1/2">
          {{ pageTitle }}
        </h1>

        <!-- Right: Actions -->
        <div class="flex items-center space-x-2">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            <i :class="darkMode ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-gray-600 dark:text-gray-400'"></i>
          </button>

          <!-- Menu/Settings -->
          <button
            @click="toggleMenu"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            <i class="fas fa-ellipsis-v text-gray-700 dark:text-gray-300"></i>
          </button>
        </div>
      </div>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div
          v-if="showMenuDropdown"
          @click="showMenuDropdown = false"
          class="fixed inset-0 z-50 bg-black bg-opacity-30"
        >
          <div
            @click.stop
            class="absolute right-2 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-56 overflow-hidden"
          >
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ currentUser?.name || 'User' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ currentUser?.email || '' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <router-link
                to="/quick-add"
                @click.native="showMenuDropdown = false"
                class="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
              >
                <i class="fas fa-bolt w-5 text-gray-600 dark:text-gray-400"></i>
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ t('quickAdd') }}</span>
              </router-link>

              <router-link
                to="/categories"
                @click.native="showMenuDropdown = false"
                class="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
              >
                <i class="fas fa-tags w-5 text-gray-600 dark:text-gray-400"></i>
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ t('categories') }}</span>
              </router-link>

              <router-link
                to="/payment-sources"
                @click.native="showMenuDropdown = false"
                class="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
              >
                <i class="fas fa-credit-card w-5 text-gray-600 dark:text-gray-400"></i>
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ t('paymentSources') }}</span>
              </router-link>

              <router-link
                to="/settings"
                @click.native="showMenuDropdown = false"
                class="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
              >
                <i class="fas fa-cog w-5 text-gray-600 dark:text-gray-400"></i>
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ t('settings') }}</span>
              </router-link>

              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 transition-colors border-t border-gray-200 dark:border-gray-700"
              >
                <i class="fas fa-sign-out-alt w-5 text-red-600 dark:text-red-400"></i>
                <span class="ml-3 text-sm text-red-600 dark:text-red-400 font-medium">{{ t('logout') }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </header>
  `,

  data() {
    return {
      showMenuDropdown: false,
      darkMode: false,
      currentUser: null
    };
  },

  computed: {
    showBackButton() {
      const backButtonPages = ['/profile', '/categories', '/payment-sources', '/quick-add', '/settings'];
      return backButtonPages.includes(this.$route.path);
    },

    pageTitle() {
      const titles = {
        '/dashboard': this.t('home'),
        '/profile': this.t('profile'),
        '/categories': this.t('categories'),
        '/payment-sources': this.t('paymentSources'),
        '/quick-add': this.t('quickAdd'),
        '/settings': this.t('settings')
      };
      return titles[this.$route.path] || this.t('appName') || 'Expense';
    }
  },

  created() {
    this.darkMode = this.$root.darkMode;
    this.currentUser = this.$root.currentUser;

    // Watch for dark mode changes
    this.$watch(() => this.$root.darkMode, (newVal) => {
      this.darkMode = newVal;
    });

    // Watch for user changes
    this.$watch(() => this.$root.currentUser, (newVal) => {
      this.currentUser = newVal;
    });
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push('/dashboard');
      }
    },

    toggleDarkMode() {
      this.$root.darkMode = !this.$root.darkMode;
      localStorage.setItem('darkMode', this.$root.darkMode);
      
      if (this.$root.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    toggleMenu() {
      this.showMenuDropdown = !this.showMenuDropdown;
    },

    handleLogout() {
      this.showMenuDropdown = false;
      this.$root.logout();
    }
  }
};
