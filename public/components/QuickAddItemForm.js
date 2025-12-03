// Quick Add Item Form Component
const QuickAddItemForm = {
  props: {
    editingItem: Object,
    categories: Array,
    paymentSources: Array,
    loading: Boolean
  },
  
  emits: ['submit', 'cancel'],
  
  data() {
    return {
      name: '',
      amount: 0,
      category: '',
      payment_source: '',
      store: '',
      displayAmount: ''
    };
  },
  
  watch: {
    editingItem: {
      immediate: true,
      handler(newItem) {
        if (newItem) {
          this.name = newItem.name;
          this.amount = newItem.amount;
          this.category = newItem.category;
          this.payment_source = newItem.payment_source;
          this.store = newItem.store || '';
          this.displayAmount = this.formatAmount(newItem.amount);
        } else {
          this.resetForm();
        }
      }
    }
  },
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        {{ editingItem ? t('edit') + ' Item' : t('createNew') + ' Item' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('item') }}
            </label>
            <input
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              :placeholder="t('itemPlaceholder')"
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
              required
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              :placeholder="t('amountPlaceholder')"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('category') }}
            </label>
            <select
              v-model="category"
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            >
              <option value="">{{ t('selectCategory') }}</option>
              <option v-for="cat in categories" :key="cat._id || cat.name" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Payment Source -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('paymentSource') }}
            </label>
            <select
              v-model="payment_source"
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            >
              <option value="">{{ t('selectPaymentSource') }}</option>
              <option v-for="source in paymentSources" :key="source._id || source.name" :value="source.name">
                {{ source.name }}
              </option>
            </select>
          </div>

          <!-- Store -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('store') || 'Toko' }}
            </label>
            <input
              v-model="store"
              type="text"
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              :placeholder="t('storePlaceholder') || 'Masukkan nama toko (opsional)'"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
          >
            {{ loading ? t('saving') : (editingItem ? t('save') : t('createNew')) }}
          </button>
          <button
            v-if="editingItem"
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
          >
            {{ t('cancel') }}
          </button>
        </div>
      </form>
    </div>
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
      this.amount = parseInt(value) || 0;
      this.displayAmount = this.formatAmount(this.amount);
    },
    
    handleSubmit() {
      this.$emit('submit', {
        name: this.name,
        amount: this.amount,
        category: this.category,
        payment_source: this.payment_source,
        store: this.store
      });
      
      if (!this.editingItem) {
        this.resetForm();
      }
    },
    
    resetForm() {
      this.name = '';
      this.amount = 0;
      this.category = '';
      this.payment_source = '';
      this.store = '';
      this.displayAmount = '';
    }
  }
};
