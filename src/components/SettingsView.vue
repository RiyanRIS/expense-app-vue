<template>
  <div class="space-y-4">
    <section class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <div class="flex items-center gap-3">
        <img :src="currentUser?.photo || 'https://i.pravatar.cc/100?img=5'" alt="user" class="w-12 h-12 rounded-full object-cover" />
        <div>
          <div class="font-semibold text-gray-900 dark:text-gray-100">{{ currentUser?.name || 'User' }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Level {{ currentUser?.level || 'Standard' }}</div>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl px-4 shadow space-y-3 mt-4">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="flex items-center justify-between py-3">
          <span class="text-gray-900 dark:text-gray-100">{{ t('theme') }}</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" :checked="darkMode" @change="$emit('toggle-dark')" class="sr-only peer" />
            <div @click="$emit('toggle-dark')" class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </li>
        <li class="flex items-center justify-between py-3">
          <span class="text-gray-900 dark:text-gray-100">{{ t('accentColor') }}</span>
          <select :value="tone" @change="$emit('update-tone', $event.target.value)" :class="['px-1.5 py-1 border rounded text-white', accentBgClass]">
            <option value="indigo">Indigo</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="rose">Rose</option>
            <option value="amber">Amber</option>
          </select>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('clear-cache')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('clearCache') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('test-notification')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('testNotification') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('change-tab', 'backup-restore')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('backupRestore') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
      </ul>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl px-4 shadow space-y-3 mt-4">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('change-tab', 'category')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('manageCategories') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('change-tab', 'payment-source')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('managePaymentSources') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('change-tab', 'quick-add')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('quickAddItems') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
      </ul>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-xl px-4 shadow space-y-3 mt-4">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('action','profil')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('manageProfile') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('change-tab', 'change-password')">
          <span class="text-gray-900 dark:text-gray-100">{{ t('changePassword') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
        <li class="flex items-center justify-between py-3 cursor-pointer" @click="$emit('action','logout')">
          <span class="text-red-600 hover:underline dark:text-red-400">{{ t('logout') }}</span>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "SettingsView",
  props: {
    currentUser: Object,
    darkMode: Boolean,
    tone: String,
    accentBgClass: String,
    accentTextClass: String,
    t: Function,
  },
};
</script>
