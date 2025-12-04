// Mobile Bottom Navigation Component
const MobileBottomNav = {
  template: `
    <!-- Bottom Navigation - Mobile First (Simplified: Home, Add, Profile) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div class="grid grid-cols-3 h-16">
        <!-- Home -->
        <router-link
          to="/dashboard"
          class="flex flex-col items-center justify-center space-y-1 text-xs transition-colors"
          :class="isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'"
        >
          <i class="text-2xl" :class="isActive('/dashboard') ? 'fas fa-home' : 'far fa-home'"></i>
          <span class="text-[10px] font-medium">{{ t('home') }}</span>
        </router-link>

        <!-- Add Expense (Center FAB) -->
        <button
          @click="showAddExpense"
          v-haptic:medium
          class="relative flex flex-col items-center justify-center -mt-6"
        >
          <div class="w-14 h-14 bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all">
            <i class="fas fa-plus text-white text-2xl"></i>
          </div>
          <span class="text-[10px] font-medium text-gray-600 dark:text-gray-400 mt-1">{{ t('add') }}</span>
        </button>

        <!-- Profile -->
        <router-link
          to="/profile"
          class="flex flex-col items-center justify-center space-y-1 text-xs transition-colors"
          :class="isActive('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'"
        >
          <i class="text-2xl" :class="isActive('/profile') ? 'fas fa-user-circle' : 'far fa-user-circle'"></i>
          <span class="text-[10px] font-medium">{{ t('profile') }}</span>
        </router-link>
      </div>
    </nav>
  `,

  data() {
    return {
      currentPath: this.$route.path
    };
  },

  watch: {
    '$route.path'(newPath) {
      this.currentPath = newPath;
    }
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    isActive(path) {
      return this.currentPath === path || this.currentPath.startsWith(path + '/');
    },

    showAddExpense() {
      // Navigate to dashboard with query parameter to trigger add form
      this.$router.push({ 
        path: '/dashboard', 
        query: { action: 'add' } 
      });
    }
  }
};
