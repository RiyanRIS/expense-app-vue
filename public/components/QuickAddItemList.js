// Quick Add Item List Component
const QuickAddItemList = {
  props: {
    items: Array,
    loading: Boolean
  },
  
  emits: ['edit', 'delete'],
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('quickAddItemsList') }}
        </h3>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="p-8 text-center">
        <i class="fas fa-bolt text-5xl text-gray-300 dark:text-gray-600"></i>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          {{ t('noQuickAddItems') }}
        </p>
      </div>

      <!-- Items List -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="item in items"
          :key="item._id"
          class="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition"
        >
          <div class="flex items-start justify-between gap-3" @click="$emit('edit', item)">
            <div class="flex-1 min-w-0">
              <h4 class="text-base font-medium text-gray-900 dark:text-white truncate">
                {{ item.name }}
              </h4>
              <div class="mt-1.5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div class="font-semibold text-red-600 dark:text-red-400">
                  Rp {{ formatAmount(item.amount) }}
                </div>
                <div class="flex items-center gap-3 flex-wrap">
                  <span v-if="item.category" class="flex items-center">
                    <i class="fas fa-tag mr-1.5 text-xs"></i>
                    {{ item.category }}
                  </span>
                  <span v-if="item.payment_source" class="flex items-center">
                    <i class="fas fa-credit-card mr-1.5 text-xs"></i>
                    {{ item.payment_source }}
                  </span>
                  <span v-if="item.store" class="flex items-center">
                    <i class="fas fa-store mr-1.5 text-xs"></i>
                    {{ item.store }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <button
                @click.stop="$emit('delete', item)"
                class="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    formatAmount(amount) {
      return new Intl.NumberFormat('id-ID').format(amount);
    }
  }
};
