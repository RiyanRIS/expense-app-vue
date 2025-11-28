// Quick Add Items View Component
const QuickAddView = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Header with Description -->
        <div class="mb-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ t('quickAddItems') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('quickAddDescription') }}
          </p>
        </div>

        <!-- Add Quick Add Item Form -->
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
                  v-model="itemForm.name"
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
                  v-model="itemForm.category"
                  required
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
                  v-model="itemForm.paymentSource"
                  required
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="">{{ t('selectPaymentSource') }}</option>
                  <option v-for="source in paymentSources" :key="source._id || source.name" :value="source.name">
                    {{ source.name }}
                  </option>
                </select>
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
                @click="cancelEdit"
                class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
              >
                {{ t('cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Add Items List -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('quickAddItemsList') }}
            </h3>
          </div>

          <!-- Loading State -->
          <div v-if="loadingItems" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
          </div>

          <!-- Empty State -->
          <div v-else-if="quickAddItems.length === 0" class="p-8 text-center">
            <i class="fas fa-bolt text-5xl text-gray-300 dark:text-gray-600"></i>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              {{ t('noQuickAddItems') }}
            </p>
          </div>

          <!-- Items List -->
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="item in quickAddItems"
              :key="item._id"
              class="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <h4 class="text-base font-medium text-gray-900 dark:text-white truncate">
                    {{ item.name }}
                  </h4>
                  <div class="mt-1.5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div class="font-semibold text-red-600 dark:text-red-400">
                      Rp {{ formatAmount(item.amount) }}
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="flex items-center">
                        <i class="fas fa-tag mr-1.5 text-xs"></i>
                        {{ item.category }}
                      </span>
                      <span class="flex items-center">
                        <i class="fas fa-credit-card mr-1.5 text-xs"></i>
                        {{ item.paymentSource }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button
                    @click="useQuickAdd(item)"
                    class="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-transform whitespace-nowrap"
                    :title="t('useTemplate') || 'Gunakan Template'"
                  >
                    <i class="fas fa-plus mr-1"></i>
                    {{ t('use') || 'Gunakan' }}
                  </button>
                  <button
                    @click="startEdit(item)"
                    class="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg active:scale-95 transition"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="handleDelete(item)"
                    class="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      quickAddItems: [],
      categories: [],
      paymentSources: [],
      itemForm: {
        name: '',
        amount: 0,
        category: '',
        paymentSource: ''
      },
      displayAmount: '',
      editingItem: null,
      loading: false,
      loadingItems: false
    };
  },

  async created() {
    await Promise.all([
      this.fetchQuickAddItems(),
      this.fetchCategories(),
      this.fetchPaymentSources()
    ]);
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    formatAmount(amount) {
      return new Intl.NumberFormat('id-ID').format(amount);
    },

    handleAmountInput(event) {
      let value = event.target.value.replace(/\D/g, '');
      this.itemForm.amount = parseInt(value) || 0;
      this.displayAmount = this.formatAmount(this.itemForm.amount);
    },

    async fetchQuickAddItems() {
      this.loadingItems = true;
      try {
        const response = await apiClient.quickAddItems.getAll();
        this.quickAddItems = response.quickAddItems || [];
      } catch (error) {
        console.error('Failed to fetch quick add items:', error);
      } finally {
        this.loadingItems = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await apiClient.categories.getAll();
        this.categories = response.categories || [];
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },

    async fetchPaymentSources() {
      try {
        const response = await apiClient.paymentSources.getAll();
        this.paymentSources = response.paymentSources || [];
      } catch (error) {
        console.error('Failed to fetch payment sources:', error);
      }
    },

    async handleSubmit() {
      this.loading = true;

      try {
        if (this.editingItem) {
          // Update existing item
          await apiClient.quickAddItems.update(this.editingItem._id, this.itemForm);
          this.$root.showNotification(this.t('quickAddItemUpdatedSuccessfully') || 'Item berhasil diperbarui!', 'success');
        } else {
          // Create new item
          await apiClient.quickAddItems.create(this.itemForm);
          this.$root.showNotification(this.t('quickAddItemAddedSuccessfully') || 'Item berhasil ditambahkan!', 'success');
        }
        
        this.resetForm();
        await this.fetchQuickAddItems();
      } catch (error) {
        this.$root.showNotification(
          error.message || this.t('failedToSaveQuickAddItem') || 'Gagal menyimpan item',
          'error'
        );
      } finally {
        this.loading = false;
      }
    },

    startEdit(item) {
      this.editingItem = item;
      this.itemForm = {
        name: item.name,
        amount: item.amount,
        category: item.category,
        paymentSource: item.paymentSource
      };
      this.displayAmount = this.formatAmount(item.amount);
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.editingItem = null;
      this.itemForm = {
        name: '',
        amount: 0,
        category: '',
        paymentSource: ''
      };
      this.displayAmount = '';
    },

    async handleDelete(item) {
      const confirmed = confirm(this.t('confirmDeleteQuickAddItem'));
      if (!confirmed) return;

      try {
        await apiClient.quickAddItems.delete(item._id);
        this.$root.showNotification(this.t('quickAddItemDeletedSuccessfully'), 'success');
        await this.fetchQuickAddItems();
      } catch (error) {
        this.$root.showNotification(
          error.message || this.t('failedToDeleteQuickAddItem'),
          'error'
        );
      }
    },

    async useQuickAdd(item) {
      // Create expense from quick add template
      try {
        const expenseData = {
          date: new Date().toISOString().slice(0, 10),
          item: item.name,
          amount: item.amount,
          category: item.category,
          payment_source: item.paymentSource,
          store: ''
        };

        await apiClient.expenses.create(expenseData);
        this.$root.showNotification(
          this.t('expenseCreatedFromTemplate') || 'Pengeluaran berhasil dibuat dari template!',
          'success'
        );
        
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        this.$root.showNotification(
          error.message || this.t('failedToCreateExpense') || 'Gagal membuat pengeluaran',
          'error'
        );
      }
    }
  }
};
