// Category List Component
const CategoryList = {
  props: {
    categories: Array,
    loading: Boolean
  },
  
  emits: ['edit', 'delete'],
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('listOfCategories') }}
        </h3>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
      </div>

      <!-- Empty State -->
      <div v-else-if="categories.length === 0" class="p-8 text-center">
        <i class="fas fa-tags text-5xl text-gray-300 dark:text-gray-600"></i>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          {{ t('noCategories') || 'Belum ada kategori' }}
        </p>
      </div>

      <!-- Categories List -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="category in categories"
          :key="category._id || category.name"
          class="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition"
        >
          <div class="flex items-center min-w-0 flex-1" @click="$emit('edit', category)">
            <i class="fas fa-tag text-indigo-600 dark:text-indigo-400 mr-3 text-lg"></i>
            <span class="text-gray-900 dark:text-white font-medium truncate">
              {{ category.name }}
            </span>
          </div>

          <div class="flex gap-2 ml-3">
            <button
              @click="$emit('delete', category)"
              class="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
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
