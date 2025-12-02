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
                  v-model="itemForm.payment_source"
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
                  v-model="itemForm.store"
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
              <div class="flex items-start justify-between gap-3" @click="startEdit(item)">
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
                    @click="showDeleteModal(item)"
                    class="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div 
          v-if="showDeleteConfirmation" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          @click.self="cancelDelete"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
                {{ t('confirmDelete') || 'Konfirmasi Hapus' }}
              </h3>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                @click="cancelDelete"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
              >
                {{ t('cancel') || 'Batal' }}
              </button>
              <button
                @click="confirmDelete"
                :disabled="deleting"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-transform"
              >
                {{ deleting ? t('deleting') || 'Menghapus...' : t('delete') || 'Hapus' }}
              </button>
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
        payment_source: '',
        store: ''
      },
      displayAmount: '',
      editingItem: null,
      loading: false,
      loadingItems: false,
      showDeleteConfirmation: false,
      itemToDelete: null,
      deleting: false
    };
  },

  async created() {
    await Promise.all([
      this.fetchQuickAddItems(),
      this.fetchCategories(),
      this.fetchPaymentSources()
    ]);
    // Add keyboard listener for modal
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount() {
    // Clean up keyboard listener
    document.removeEventListener('keydown', this.handleKeydown);
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
        payment_source: item.payment_source,
        store: item.store || ''
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
        payment_source: '',
        store: ''
      };
      this.displayAmount = '';
    },

    showDeleteModal(item) {
      this.itemToDelete = item;
      this.showDeleteConfirmation = true;
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.itemToDelete = null;
      this.deleting = false;
    },

    async confirmDelete() {
      if (!this.itemToDelete) return;

      this.deleting = true;

      try {
        await apiClient.quickAddItems.delete(this.itemToDelete._id);
        this.resetForm();
        this.$root.showNotification(this.t('quickAddItemDeletedSuccessfully'), 'success');
        await this.fetchQuickAddItems();
        this.cancelDelete();
      } catch (error) {
        this.$root.showNotification(
          error.message || this.t('failedToDeleteQuickAddItem'),
          'error'
        );
        this.deleting = false;
      }
    },

    async handleDelete(item) {
      // Legacy method - now redirects to modal
      this.showDeleteModal(item);
    },

    handleKeydown(event) {
      // Close modal on ESC key
      if (event.key === 'Escape' && this.showDeleteConfirmation) {
        this.cancelDelete();
      }
    },
  }
};
