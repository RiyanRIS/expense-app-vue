// Expense List Component
const ExpenseList = {
  props: {
    expenses: Array,
    swipedExpenseId: String,
    swipeOffset: Number
  },
  
  emits: ['touchstart', 'touchmove', 'touchend', 'select', 'menu'],
  
  template: `
    <div class="space-y-3">
      <div
        v-for="expense in expenses"
        :key="expense._id"
        @touchstart="$emit('touchstart', $event, expense)"
        @touchmove="$emit('touchmove', $event)"
        @touchend="$emit('touchend', $event)"
        class="relative overflow-hidden rounded-2xl"
      >
        <!-- Swipe Actions Background - Only show when swiping -->
        <div 
          v-if="swipedExpenseId === expense._id"
          class="absolute inset-0 flex items-center justify-between px-6 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl"
        >
          <i class="fas fa-trash text-white text-xl"></i>
          <i class="fas fa-trash text-white text-xl"></i>
        </div>

        <!-- Expense Card -->
        <div
          :style="{ transform: swipedExpenseId === expense._id ? \`translateX(\${swipeOffset}px)\` : '' }"
          class="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform"
          @click="$emit('select', expense)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {{ expense.category }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {{ expense.payment_source }}
                </span>
              </div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {{ expense.name }}
              </h3>
              <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center">
                  <i class="far fa-calendar mr-1"></i>
                  {{ formatDate(expense.date) }}
                </span>
                <span v-if="expense.store" class="flex items-center">
                  <i class="far fa-building mr-1"></i>
                  {{ expense.store }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end ml-4">
              <p class="text-lg font-bold text-red-600 dark:text-red-400">
                {{ formatCurrency(expense.amount) }}
              </p>
              <button
                @click.stop="$emit('menu', expense._id)"
                class="mt-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
              >
                <i class="fas fa-ellipsis-v text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="expenses.length === 0" class="text-center py-16">
        <i class="fas fa-receipt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">
          {{ t('noExpenses') }}
        </p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">
          {{ t('tapPlusToAdd') }}
        </p>
      </div>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    formatCurrency(amount) {
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    }
  }
};
