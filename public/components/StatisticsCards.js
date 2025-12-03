// Statistics Card Component
const StatisticsCards = {
  props: {
    totalToday: Number,
    expensesToday: Number,
    totalMonth: Number,
    expensesMonth: Number,
    topCategory: String,
    topCategoryAmount: Number,
    topPaymentSource: String,
    topPaymentAmount: Number
  },
  
  template: `
    <div class="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div class="flex space-x-3 pb-2">
        <!-- Total Today -->
        <div class="flex-shrink-0 w-40 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-calendar-day text-white text-xl opacity-80"></i>
            <span class="text-xs text-white opacity-75">{{ t('today') }}</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ formatCurrency(totalToday) }}</p>
          <p class="text-xs text-white opacity-75 mt-1">{{ expensesToday }} {{ t('items') }}</p>
        </div>

        <!-- Total This Month -->
        <div class="flex-shrink-0 w-40 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-calendar-alt text-white text-xl opacity-80"></i>
            <span class="text-xs text-white opacity-75">{{ t('thisMonth') }}</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ formatCurrency(totalMonth) }}</p>
          <p class="text-xs text-white opacity-75 mt-1">{{ expensesMonth }} {{ t('items') }}</p>
        </div>

        <!-- Top Category -->
        <div class="flex-shrink-0 w-40 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-tag text-white text-xl opacity-80"></i>
            <span class="text-xs text-white opacity-75">{{ t('topCategory') }}</span>
          </div>
          <p class="text-base font-bold text-white truncate">{{ topCategory || '-' }}</p>
          <p class="text-xs text-white opacity-75 mt-1">{{ formatCurrency(topCategoryAmount) }}</p>
        </div>

        <!-- Top Payment -->
        <div class="flex-shrink-0 w-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-credit-card text-white text-xl opacity-80"></i>
            <span class="text-xs text-white opacity-75">{{ t('topPayment') }}</span>
          </div>
          <p class="text-base font-bold text-white truncate">{{ topPaymentSource || '-' }}</p>
          <p class="text-xs text-white opacity-75 mt-1">{{ formatCurrency(topPaymentAmount) }}</p>
        </div>
      </div>
    </div>
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
