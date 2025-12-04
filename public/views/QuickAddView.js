// Quick Add Items View Component
const QuickAddView = {
  components: {
    'quick-add-item-form': QuickAddItemForm,
    'quick-add-item-list': QuickAddItemList,
    'delete-confirm-modal': DeleteConfirmModal
  },

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

        <!-- Quick Add Item Form Component -->
        <quick-add-item-form
          :editing-item="editingItem"
          :categories="categories"
          :payment-sources="paymentSources"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="cancelEdit"
        />

        <!-- Quick Add Item List Component -->
        <quick-add-item-list
          :items="quickAddItems"
          :loading="loadingItems"
          @edit="startEdit"
          @delete="showDeleteModal"
        />

        <!-- Delete Confirmation Modal -->
        <delete-confirm-modal
          :show="showDeleteConfirmation"
          :item="itemToDelete"
          :deleting="deleting"
          item-type="quickAdd"
          @cancel="cancelDelete"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  `,

  data() {
    return {
      quickAddItems: [],
      categories: [],
      paymentSources: [],
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

    async handleSubmit(itemData) {
      this.loading = true;

      try {
        if (this.editingItem) {
          // Update existing item
          await apiClient.quickAddItems.update(this.editingItem._id, itemData);
          this.$root.showNotification(this.t('quickAddItemUpdatedSuccessfully') || 'Item berhasil diperbarui!', 'success');
        } else {
          // Create new item
          await apiClient.quickAddItems.create(itemData);
          this.$root.showNotification(this.t('quickAddItemAddedSuccessfully') || 'Item berhasil ditambahkan!', 'success');
        }
        
        this.editingItem = null;
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
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cancelEdit() {
      this.editingItem = null;
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
        this.editingItem = null;
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
