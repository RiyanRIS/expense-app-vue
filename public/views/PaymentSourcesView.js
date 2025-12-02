// Payment Sources View Component
const PaymentSourcesView = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Header with Description -->
        <div class="mb-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ t('managePaymentSourcesTitle') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('paymentSourcesDescription') }}
          </p>
        </div>
        <!-- Add Payment Source Form -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            {{ editingSource ? t('edit') + ' ' + t('paymentSource') : t('createNew') + ' ' + t('paymentSource') }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-3">
            <input
              v-model="sourceForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              :placeholder="t('newPaymentSourceNamePlaceholder')"
            />
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
              >
                {{ loading ? t('saving') : (editingSource ? t('save') : t('createNew')) }}
              </button>
              <button
                v-if="editingSource"
                type="button"
                @click="cancelEdit"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
              >
                {{ t('cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Payment Sources List -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('listOfPaymentSources') }}
            </h3>
          </div>

          <!-- Loading State -->
          <div v-if="loadingSources" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
          </div>

          <!-- Empty State -->
          <div v-else-if="paymentSources.length === 0" class="p-8 text-center">
            <i class="fas fa-credit-card text-5xl text-gray-300 dark:text-gray-600"></i>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              {{ t('noPaymentSources') || 'Belum ada sumber pembayaran' }}
            </p>
          </div>

          <!-- Payment Sources List -->
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="source in paymentSources"
              :key="source._id || source.name"
              class="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition"
            >
              <div class="flex items-center min-w-0 flex-1" @click="startEdit(source)">
                <i class="fas fa-credit-card text-indigo-600 dark:text-indigo-400 mr-3 text-lg"></i>
                <span class="text-gray-900 dark:text-white font-medium truncate">
                  {{ source.name }}
                </span>
              </div>

              <div class="flex gap-2 ml-3">
                <button
                  @click="showDeleteModal(source)"
                  class="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition"
                >
                  <i class="fas fa-trash"></i>
                </button>
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
      paymentSources: [],
      sourceForm: {
        name: ''
      },
      editingSource: null,
      loading: false,
      loadingSources: false,
      showDeleteConfirmation: false,
      sourceToDelete: null,
      deleting: false
    };
  },

  async created() {
    await this.fetchPaymentSources();
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

    async fetchPaymentSources() {
      this.loadingSources = true;
      try {
        const response = await apiClient.paymentSources.getAll();
        this.paymentSources = response.paymentSources || [];
      } catch (error) {
        console.error('Failed to fetch payment sources:', error);
        this.$root.showNotification(this.t('failedToLoadPaymentSources') || 'Gagal memuat sumber pembayaran', 'error');
      } finally {
        this.loadingSources = false;
      }
    },

    async handleSubmit() {
      this.loading = true;

      try {
        if (this.editingSource) {
          // Update existing payment source
          await apiClient.paymentSources.update(this.editingSource.name, this.sourceForm.name);
          this.$root.showNotification(this.t('paymentSourceUpdatedSuccessfully'), 'success');
        } else {
          // Create new payment source
          await apiClient.paymentSources.create(this.sourceForm.name);
          this.$root.showNotification(this.t('paymentSourceAddedSuccessfully'), 'success');
        }
        
        this.sourceForm.name = '';
        this.editingSource = null;
        await this.fetchPaymentSources();
      } catch (error) {
        this.$root.showNotification(
          error.message || (this.editingSource ? this.t('failedToUpdatePaymentSource') : this.t('failedToAddPaymentSource')),
          'error'
        );
      } finally {
        this.loading = false;
      }
    },

    startEdit(source) {
      this.editingSource = source;
      this.sourceForm.name = source.name;
    },

    cancelEdit() {
      this.editingSource = null;
      this.sourceForm.name = '';
    },

    showDeleteModal(source) {
      this.sourceToDelete = source;
      this.showDeleteConfirmation = true;
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.sourceToDelete = null;
      this.deleting = false;
    },

    async confirmDelete() {
      if (!this.sourceToDelete) return;

      this.deleting = true;

      try {
        await apiClient.paymentSources.delete(this.sourceToDelete.name);
        this.sourceForm.name = '';
        this.editingSource = null;
        this.$root.showNotification(this.t('paymentSourceDeletedSuccessfully'), 'success');
        await this.fetchPaymentSources();
        this.cancelDelete();
      } catch (error) {
        this.$root.showNotification(
          error.message || this.t('failedToDeletePaymentSource'),
          'error'
        );
        this.deleting = false;
      }
    },

    async handleDelete(source) {
      // Legacy method - now redirects to modal
      this.showDeleteModal(source);
    },

    handleKeydown(event) {
      // Close modal on ESC key
      if (event.key === 'Escape' && this.showDeleteConfirmation) {
        this.cancelDelete();
      }
    }
  }
};
