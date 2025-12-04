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
      displayAmount: '',
      showCategorySuggestions: false,
      categorySuggestions: []
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
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('category') }}
            </label>
            <input
              v-model="category"
              type="text"
              @input="handleCategoryInput"
              @focus="handleCategoryFocus"
              @blur="hideCategorySuggestions"
              :placeholder="t('selectCategory') || 'Pilih atau ketik kategori baru'"
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              autocomplete="off"
              required
            />
            <!-- Autocomplete Dropdown -->
            <div
              v-if="showCategorySuggestions && categorySuggestions.length > 0"
              class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-48 overflow-y-auto"
            >
              <button
                v-for="suggestion in categorySuggestions"
                :key="suggestion._id"
                type="button"
                @mousedown.prevent="selectCategory(suggestion.name)"
                class="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
              >
                <i class="fas fa-tag text-indigo-600 dark:text-indigo-400 mr-2"></i>
                {{ suggestion.name }}
              </button>
            </div>
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
            v-haptic:success
            class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
          >
            {{ loading ? t('saving') : (editingItem ? t('save') : t('createNew')) }}
          </button>
          <button
            v-if="editingItem"
            type="button"
            @click="$emit('cancel')"
            v-haptic:light
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

    handleCategoryInput(event) {
      const input = event.target.value.toLowerCase();
      if (input.length > 0) {
        this.categorySuggestions = this.categories.filter(cat =>
          cat.name.toLowerCase().includes(input)
        );
        this.showCategorySuggestions = true;
      } else {
        this.categorySuggestions = [...this.categories];
        this.showCategorySuggestions = true;
      }
    },

    handleCategoryFocus() {
      this.categorySuggestions = [...this.categories];
      this.showCategorySuggestions = true;
    },

    hideCategorySuggestions() {
      setTimeout(() => {
        this.showCategorySuggestions = false;
      }, 200);
    },

    selectCategory(categoryName) {
      this.category = categoryName;
      this.showCategorySuggestions = false;
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
      this.showCategorySuggestions = false;
      this.categorySuggestions = [];
    }
  }
};
