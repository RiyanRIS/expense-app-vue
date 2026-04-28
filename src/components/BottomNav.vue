<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-xl mx-auto grid grid-cols-3" v-if="isAuthenticated">
      <router-link
        to="/home"
        :class="['py-3 text-sm flex flex-col items-center', $route.path === '/home' || $route.path.startsWith('/detail') || $route.path.startsWith('/edit') ? accentTextClass : 'text-gray-600 dark:text-gray-300']"
      >
        <i class="fas fa-home text-lg"></i>
        <span>{{ t('home') }}</span>
      </router-link>
      <router-link
        to="/create"
        :class="['py-3 text-sm flex flex-col items-center', $route.path === '/create' ? accentTextClass : 'text-gray-600 dark:text-gray-300']"
      >
        <i class="fas fa-plus-circle text-lg"></i>
        <span>{{ t('createNew') }}</span>
      </router-link>
      <router-link
        to="/settings"
        :class="['py-3 text-sm flex flex-col items-center', $route.path === '/settings' || $route.path === '/payment-source' || $route.path === '/category' || $route.path === '/backup-restore' || $route.path === '/quick-add' || $route.path === '/profile' || $route.path === '/change-password' ? accentTextClass : 'text-gray-600 dark:text-gray-300']"
      >
        <i class="fas fa-cog text-lg"></i>
        <span>{{ t('settings') }}</span>
      </router-link>
    </div>
    <div class="max-w-xl mx-auto grid grid-cols-2" v-else>
      <router-link
        to="/login"
        :class="['py-3 text-sm flex flex-col items-center', $route.path === '/login' ? accentTextClass : 'text-gray-600 dark:text-gray-300']"
      >
        <i class="fas fa-sign-in-alt text-lg"></i>
        <span>{{ t('login') }}</span>
      </router-link>
      <router-link
        to="/signup"
        :class="['py-3 text-sm flex flex-col items-center', $route.path === '/signup' ? accentTextClass : 'text-gray-600 dark:text-gray-300']"
      >
        <i class="fas fa-user-plus text-lg"></i>
        <span>{{ t('signup') }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    isAuthenticated: Boolean,
    accentTextClass: String,
    t: Function,
  },
};
</script>
