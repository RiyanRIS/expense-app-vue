// Delete Confirmation Modal Component
const DeleteConfirmModal = {
  props: {
    show: Boolean,
    item: Object,
    deleting: Boolean,
    message: String,
    itemType: {
      type: String,
      default: 'expense' // 'expense', 'category', 'paymentSource', 'quickAdd'
    }
  },
  
  emits: ['cancel', 'confirm'],
  
  template: `
    <div 
      v-if="show" 
      class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="$emit('cancel')"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
            {{ t('confirmDelete') || 'Konfirmasi Hapus' }}
          </h3>
        </div>

        <!-- Modal Body -->
        <div v-if="item" class="px-6 py-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ message || getDefaultMessage() }}
          </p>
          
          <!-- Expense Details -->
          <div v-if="itemType === 'expense'" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('item') }}:</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('amount') }}:</span>
              <span class="text-sm font-bold text-red-600 dark:text-red-400">{{ formatCurrency(item.amount) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('category') }}:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ item.category }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('paymentSource') }}:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ item.payment_source }}</span>
            </div>
            <div v-if="item.store" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('store') }}:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ item.store }}</span>
            </div>
          </div>

          <!-- Category Details -->
          <div v-else-if="itemType === 'category'" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div class="flex items-center justify-center">
              <i class="fas fa-tag text-3xl text-indigo-600 dark:text-indigo-400 mr-3"></i>
              <div>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ item.name }}</p>
                <p v-if="item.type" class="text-sm text-gray-600 dark:text-gray-400">
                  {{ item.type === 'expense' ? t('expense') : t('income') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Source Details -->
          <div v-else-if="itemType === 'paymentSource'" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div class="flex items-center justify-center">
              <i class="fas fa-wallet text-3xl text-green-600 dark:text-green-400 mr-3"></i>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ item.name }}</p>
            </div>
          </div>

          <!-- Quick Add Item Details -->
          <div v-else-if="itemType === 'quickAdd'" class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('item') }}:</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('amount') }}:</span>
              <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ formatCurrency(item.amount) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('category') }}:</span>
              <span class="text-sm text-gray-900 dark:text-white">{{ item.category }}</span>
            </div>
          </div>

          <!-- Generic Item Details (fallback) -->
          <div v-else class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div class="flex items-center justify-center">
              <i class="fas fa-exclamation-circle text-3xl text-yellow-600 dark:text-yellow-400 mr-3"></i>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ item.name || item.title }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            @click="$emit('cancel')"
            v-haptic:light
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
          >
            {{ t('cancel') || 'Batal' }}
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="deleting"
            v-haptic:delete
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-transform"
          >
            {{ deleting ? t('deleting') || 'Menghapus...' : t('delete') || 'Hapus' }}
          </button>
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
    },

    getDefaultMessage() {
      const messages = {
        expense: this.t('confirmDeleteExpense') || 'Apakah Anda yakin ingin menghapus pengeluaran ini?',
        category: this.t('confirmDeleteCategory') || 'Apakah Anda yakin ingin menghapus kategori ini?',
        paymentSource: this.t('confirmDeletePaymentSource') || 'Apakah Anda yakin ingin menghapus sumber pembayaran ini?',
        quickAdd: this.t('confirmDeleteQuickAdd') || 'Apakah Anda yakin ingin menghapus item ini?'
      };
      return messages[this.itemType] || this.t('confirmDelete') || 'Apakah Anda yakin ingin menghapus item ini?';
    }
  }
};
