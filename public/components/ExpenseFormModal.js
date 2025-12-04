// Expense Form Modal Component
const ExpenseFormModal = {
  props: {
    show: Boolean,
    expense: Object,
    categories: Array,
    paymentSources: Array,
    saving: Boolean
  },
  
  emits: ['close', 'save', 'delete', 'category-created'],
  
  data() {
    return {
      transactionType: 'expense', // 'expense' or 'income'
      formData: {
        name: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        source: '', // for income
        description: '', // for income
        date: new Date().toISOString().slice(0, 10)
      },
      displayAmount: '',
      showCategorySuggestions: false,
      categorySuggestions: []
    };
  },
  
  computed: {
    filteredCategories() {
      // Filter categories based on transaction type
      return this.categories.filter(cat => cat.type === this.transactionType);
    }
  },
  
  watch: {
    transactionType() {
      // Reset suggestions when switching transaction type
      this.categorySuggestions = [];
      this.showCategorySuggestions = false;
      // Reset category input when switching type
      this.formData.category = '';
    },
    
    expense: {
      immediate: true,
      handler(newExpense) {
        if (newExpense) {
          // Detect type based on presence of store (expense) or source (income)
          this.transactionType = newExpense.source !== undefined ? 'income' : 'expense';
          
          this.formData = {
            name: newExpense.name,
            amount: newExpense.amount,
            store: newExpense.store || '',
            category: newExpense.category || '',
            payment_source: newExpense.payment_source || '',
            source: newExpense.source || '',
            description: newExpense.description || '',
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
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {{ expense ? t('edit') : t('createNew') }}
              </h2>

              <!-- Transaction Type Toggle -->
              <div v-if="!expense" class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <button
                  type="button"
                  @click="transactionType = 'expense'"
                  class="flex-1 py-2.5 rounded-lg font-medium transition-all"
                  :class="transactionType === 'expense' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
                >
                  <i class="fas fa-minus-circle mr-2"></i>
                  {{ t('expense') || 'Pengeluaran' }}
                </button>
                <button
                  type="button"
                  @click="transactionType = 'income'"
                  class="flex-1 py-2.5 rounded-lg font-medium transition-all"
                  :class="transactionType === 'income' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
                >
                  <i class="fas fa-plus-circle mr-2"></i>
                  {{ t('income') || 'Pemasukan' }}
                </button>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Item Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ transactionType === 'expense' ? t('item') : (t('incomeName') || 'Nama Pemasukan') }}
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    :placeholder="transactionType === 'expense' ? t('itemPlaceholder') : (t('incomeNamePlaceholder') || 'Misal: Gaji, Bonus')"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <!-- Amount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ transactionType === 'expense' ? t('amount') : (t('incomeAmount') || 'Jumlah Pemasukan') }}
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

                <!-- Expense Fields -->
                <template v-if="transactionType === 'expense'">
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

                  <!-- Category with Autocomplete -->
                  <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('category') }}
                    </label>
                    <input
                      v-model="formData.category"
                      type="text"
                      @input="handleCategoryInput"
                      @focus="handleCategoryFocus"
                      @blur="hideCategorySuggestions"
                      :placeholder="t('selectCategory') || 'Pilih atau ketik kategori baru'"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      {{ t('selectPaymentSource') }} ({{ t('optional') }})
                    </label>
                    <select
                      v-model="formData.payment_source"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">{{ t('selectPaymentSource') }}</option>
                      <option v-for="source in paymentSources" :key="source._id" :value="source.name">
                        {{ source.name }}
                      </option>
                    </select>
                  </div>
                </template>

                <!-- Income Fields -->
                <template v-else>
                  <!-- Category (Optional for Income) with Autocomplete -->
                  <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('category') }} ({{ t('optional') }})
                    </label>
                    <input
                      v-model="formData.category"
                      type="text"
                      @input="handleCategoryInput"
                      @focus="handleCategoryFocus"
                      @blur="hideCategorySuggestions"
                      :placeholder="t('categoryPlaceholder') || 'Misal: Gaji, Freelance'"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      autocomplete="off"
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
                        <i class="fas fa-tag text-green-600 dark:text-green-400 mr-2"></i>
                        {{ suggestion.name }}
                      </button>
                    </div>
                  </div>

                  <!-- Source (Optional for Income) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('source') || 'Sumber' }} ({{ t('optional') }})
                    </label>
                    <input
                      v-model="formData.source"
                      type="text"
                      :placeholder="t('sourcePlaceholder') || 'Misal: PT ABC, Klien XYZ'"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Description (Optional for Income) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('description') || 'Keterangan' }} ({{ t('optional') }})
                    </label>
                    <textarea
                      v-model="formData.description"
                      rows="3"
                      :placeholder="t('descriptionPlaceholder') || 'Keterangan tambahan'"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </template>

                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                  <button
                    type="button"
                    v-haptic:light
                    @click="$emit('close')"
                    class="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    {{ t('cancel') }}
                  </button>
                  <button
                    type="submit"
                    v-haptic:success
                    :disabled="saving"
                    class="flex-1 px-6 py-3 rounded-xl text-white font-medium active:scale-95 transition-all disabled:opacity-50"
                    :class="transactionType === 'expense' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'"
                  >
                    {{ saving ? t('saving') : t('save') }}
                  </button>
                </div>

                <!-- Delete Button (if editing) -->
                <button
                  v-if="expense"
                  v-haptic:delete
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
    
    async handleSubmit() {
      // Check if category is new and save it first
      if (this.formData.category) {
        const categoryExists = this.filteredCategories.some(
          cat => cat.name.toLowerCase() === this.formData.category.toLowerCase()
        );
        
        if (!categoryExists) {
          try {
            await apiClient.categories.create(this.formData.category, this.transactionType);
            // Emit event to parent to reload categories
            this.$emit('category-created');
          } catch (error) {
            console.error('Failed to create category:', error);
            // Continue with submission even if category creation fails
          }
        }
      }
      
      const data = {
        ...this.formData,
        amount: parseFloat(this.formData.amount),
        type: this.transactionType
      };
      
      // Clean up fields based on type
      if (this.transactionType === 'expense') {
        delete data.source;
        delete data.description;
      } else {
        delete data.store;
        delete data.payment_source;
      }
      
      this.$emit('save', data);
    },
    
    handleCategoryInput() {
      const searchTerm = this.formData.category.toLowerCase();
      
      if (searchTerm.length > 0) {
        this.categorySuggestions = this.filteredCategories.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm)
        );
      } else {
        this.categorySuggestions = this.filteredCategories;
      }
      
      // Show suggestions when typing
      this.showCategorySuggestions = true;
    },
    
    handleCategoryFocus() {
      // Show all categories when focused
      this.categorySuggestions = this.filteredCategories;
      this.showCategorySuggestions = true;
    },
    
    selectCategory(categoryName) {
      this.formData.category = categoryName;
      this.showCategorySuggestions = false;
    },
    
    hideCategorySuggestions() {
      // Delay to allow click event to fire
      setTimeout(() => {
        this.showCategorySuggestions = false;
      }, 200);
    },
    
    resetForm() {
      this.transactionType = 'expense';
      this.formData = {
        name: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        source: '',
        description: '',
        date: new Date().toISOString().slice(0, 10)
      };
      this.displayAmount = '';
      this.categorySuggestions = [];
      this.showCategorySuggestions = false;
    }
  }
};
