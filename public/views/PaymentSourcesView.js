// Payment Sources View Component
const PaymentSourcesView = {
  components: {
    'payment-source-form': PaymentSourceForm,
    'payment-source-list': PaymentSourceList,
    'delete-confirm-modal': DeleteConfirmModal
  },

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

        <!-- Payment Source Form Component -->
        <payment-source-form
          :editing-source="editingSource"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="cancelEdit"
        />

        <!-- Payment Source List Component -->
        <payment-source-list
          :payment-sources="paymentSources"
          :loading="loadingSources"
          @edit="startEdit"
          @delete="showDeleteModal"
        />

        <!-- Delete Confirmation Modal -->
        <delete-confirm-modal
          :show="showDeleteConfirmation"
          :item="sourceToDelete"
          :deleting="deleting"
          item-type="paymentSource"
          @cancel="cancelDelete"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  `,

  data() {
    return {
      paymentSources: [],
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

    async handleSubmit(name) {
      this.loading = true;

      try {
        if (this.editingSource) {
          // Update existing payment source
          await apiClient.paymentSources.update(this.editingSource.name, name);
          this.$root.showNotification(this.t('paymentSourceUpdatedSuccessfully'), 'success');
        } else {
          // Create new payment source
          await apiClient.paymentSources.create(name);
          this.$root.showNotification(this.t('paymentSourceAddedSuccessfully'), 'success');
        }
        
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
