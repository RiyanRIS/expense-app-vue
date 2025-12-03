// Appearance Settings Component
const AppearanceSettings = {
  props: {
    darkMode: Boolean,
    language: String
  },
  
  emits: ['toggle-dark-mode', 'change-language'],
  
  data() {
    return {
      selectedLanguage: this.language
    };
  },
  
  watch: {
    language(newLang) {
      this.selectedLanguage = newLang;
    }
  },
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          <i class="fas fa-palette mr-2"></i>
          {{ t('appearance') }}
        </h3>
      </div>
      
      <div class="p-5 space-y-4">
        <!-- Dark Mode Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t('darkMode') }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('darkModeDescription') || 'Gunakan tema gelap untuk mengurangi kelelahan mata' }}
            </p>
          </div>
          <button
            @click="$emit('toggle-dark-mode')"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :class="darkMode ? 'bg-indigo-600' : 'bg-gray-200'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="darkMode ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
        </div>

        <!-- Language Selector -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t('language') }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('languageDescription') || 'Pilih bahasa antarmuka aplikasi' }}
            </p>
          </div>
          <select
            v-model="selectedLanguage"
            @change="$emit('change-language', selectedLanguage)"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    }
  }
};
