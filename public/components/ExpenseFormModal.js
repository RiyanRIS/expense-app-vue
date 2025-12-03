// Expense Form Modal Component
const ExpenseFormModal = {
  props: {
    show: Boolean,
    expense: Object,
    categories: Array,
    paymentSources: Array,
    saving: Boolean
  },
  
  emits: ['close', 'save', 'delete'],
  
  data() {
    return {
      formData: {
        name: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        date: new Date().toISOString().slice(0, 10)
      },
      displayAmount: ''
    };
  },
  
  watch: {
    expense: {
      immediate: true,
      handler(newExpense) {
        if (newExpense) {
          this.formData = {
            name: newExpense.name,
            amount: newExpense.amount,
            store: newExpense.store,
            category: newExpense.category,
            payment_source: newExpense.payment_source,
            date: newExpense.date
          };
          this.displayAmount = this.formatAmount(newExpense.amount);
        } else {
          this.resetForm();
        }
      }
    }
  },
  
  template: `
    <transition name="slide-up">
      <div v-if="show" class="fixed inset-0 z-[60] flex items-end">
        <div @click="$emit('close')" class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div @click.stop class="relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <!-- Handle Bar -->
          <div class="flex justify-center pt-3 pb-2">
            <div @click="$emit('close')" class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          
          <!-- Form Content -->
          <div class="px-5 pb-8">
            <div class="space-y-4 pt-4">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {{ expense ? t('edit') : t('createNew') }}
              </h2>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Item Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('item') }}
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    :placeholder="t('itemPlaceholder')"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <!-- Amount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('amount') }}
                  </label>
                  <input
                    v-model="displayAmount"
                    @input="handleAmountInput"
                    type="text"
                    :placeholder="t('amountPlaceholder')"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <!-- Store (Optional) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('storePlaceholder') }} ({{ t('optional') }})
                  </label>
                  <input
                    v-model="formData.store"
                    type="text"
                    :placeholder="t('storePlaceholder')"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('category') }}
                  </label>
                  <select
                    v-model="formData.category"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">{{ t('selectCategory') }}</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>

                <!-- Payment Source -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('selectPaymentSource') }}
                  </label>
                  <select
                    v-model="formData.payment_source"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">{{ t('selectPaymentSource') }}</option>
                    <option v-for="source in paymentSources" :key="source._id" :value="source.name">
                      {{ source.name }}
                    </option>
                  </select>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    {{ t('cancel') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {{ saving ? t('saving') : t('save') }}
                  </button>
                </div>

                <!-- Delete Button (if editing) -->
                <button
                  v-if="expense"
                  type="button"
                  @click="$emit('delete')"
                  class="w-full px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all"
                >
                  {{ t('delete') }}
                </button>
              </form>
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
    
    formatAmount(amount) {
      return new Intl.NumberFormat('id-ID').format(amount);
    },
    
    handleAmountInput(event) {
      let value = event.target.value.replace(/\D/g, '');
      this.formData.amount = parseInt(value) || 0;
      this.displayAmount = this.formatAmount(this.formData.amount);
    },
    
    handleSubmit() {
      const expenseData = {
        ...this.formData,
        amount: parseFloat(this.formData.amount)
      };
      this.$emit('save', expenseData);
    },
    
    resetForm() {
      this.formData = {
        name: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        date: new Date().toISOString().slice(0, 10)
      };
      this.displayAmount = '';
    }
  }
};
