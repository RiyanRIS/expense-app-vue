// Quick Add Modal Component
const QuickAddModal = {
  props: {
    show: Boolean,
    quickAddItems: Array,
    saving: Boolean
  },
  
  emits: ['close', 'use-item', 'manage'],
  
  template: `
    <transition name="slide-up">
      <div v-if="show" class="fixed inset-0 z-[60] flex items-end">
        <div @click="$emit('close')" class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div @click.stop class="relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
          <!-- Handle Bar -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          
          <!-- Quick Add Content -->
          <div class="px-5 pb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('quickAddItems') }}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('quickAddDescription') }}</p>
              </div>
              <button
                @click="$emit('manage')"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-cog text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>

            <!-- Quick Add Items List -->
            <div v-if="quickAddItems.length > 0" class="space-y-3">
              <button
                v-for="item in quickAddItems"
                :key="item._id"
                @click="$emit('use-item', item)"
                :disabled="saving"
                class="w-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 active:scale-98 transition-all text-left disabled:opacity-50"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {{ item.name }}
                    </h3>
                    <div class="flex items-center space-x-2 mb-1 flex-wrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        {{ item.category }}
                      </span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {{ item.payment_source }}
                      </span>
                      <span v-if="item.store" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {{ item.store }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {{ formatCurrency(item.amount) }}
                    </p>
                    <div class="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <i class="fas fa-bolt mr-1"></i>
                      <span>{{ t('use') }}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <i class="fas fa-bolt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
              <p class="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                {{ t('noQuickAddItems') }}
              </p>
              <button
                @click="$emit('manage')"
                class="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <i class="fas fa-plus mr-2"></i>
                {{ t('createNew') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    formatCurrency(amount) {
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    }
  }
};
