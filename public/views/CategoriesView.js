// Categories View Component
const CategoriesView = {
  components: {
    'category-form': CategoryForm,
    'category-list': CategoryList,
    'delete-confirm-modal': DeleteConfirmModal
  },

  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Header with Description -->
        <div class="mb-2">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {{ t('manageCategoriesTitle') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('categoriesDescription') }}
          </p>
        </div>

        <!-- Type Filter Toggle -->
        <div class="flex gap-2 p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="categoryType = 'expense'; fetchCategories();"
            v-haptic:medium
            class="flex-1 py-2.5 rounded-lg font-medium transition-all"
            :class="categoryType === 'expense' 
              ? 'bg-red-500 text-white shadow-md' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
          >
            <i class="fas fa-minus-circle mr-2"></i>
            {{ t('expenseCategories') || 'Kategori Pengeluaran' }}
          </button>
          <button
            type="button"
            @click="categoryType = 'income'; fetchCategories();"
            v-haptic:medium
            class="flex-1 py-2.5 rounded-lg font-medium transition-all"
            :class="categoryType === 'income' 
              ? 'bg-green-500 text-white shadow-md' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
          >
            <i class="fas fa-plus-circle mr-2"></i>
            {{ t('incomeCategories') || 'Kategori Pemasukan' }}
          </button>
        </div>

        <!-- Category Form Component -->
        <category-form
          :editing-category="editingCategory"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="cancelEdit"
        />

        <!-- Category List Component -->
        <category-list
          :categories="categories"
          :loading="loadingCategories"
          @edit="startEdit"
          @delete="showDeleteModal"
        />

        <!-- Delete Confirmation Modal -->
        <delete-confirm-modal
          :show="showDeleteConfirmation"
          :item="categoryToDelete"
          :deleting="deleting"
          @cancel="cancelDelete"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  `,

  data() {
    return {
      categoryType: 'expense', // 'expense' or 'income'
      categories: [],
      editingCategory: null,
      loading: false,
      loadingCategories: false,
      showDeleteConfirmation: false,
      categoryToDelete: null,
      deleting: false
    };
  },

  async created() {
    await this.fetchCategories();
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

    async fetchCategories() {
      this.loadingCategories = true;
      try {
        const response = await apiClient.categories.getAll(this.categoryType);
        this.categories = response.categories || [];
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.$root.showNotification(this.t('failedToLoadCategories') || 'Gagal memuat kategori', 'error');
      } finally {
        this.loadingCategories = false;
      }
    },

    async handleSubmit(name) {
      this.loading = true;

      try {
        if (this.editingCategory) {
          // Update existing category
          await apiClient.categories.update(this.editingCategory.name, name);
          this.$root.showNotification(this.t('categoryUpdatedSuccessfully'), 'success');
        } else {
          // Create new category with current type
          await apiClient.categories.create(name, this.categoryType);
          this.$root.showNotification(this.t('categoryAddedSuccessfully'), 'success');
        }
        
        this.editingCategory = null;
        await this.fetchCategories();
      } catch (error) {
        this.$root.showNotification(
          error.message || (this.editingCategory ? this.t('failedToUpdateCategory') : this.t('failedToAddCategory')),
          'error'
        );
      } finally {
        this.loading = false;
      }
    },

    startEdit(category) {
      this.editingCategory = category;
      this.categoryForm.name = category.name;
    },

    cancelEdit() {
      this.editingCategory = null;
    },

    showDeleteModal(category) {
      this.categoryToDelete = category;
      this.showDeleteConfirmation = true;
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.categoryToDelete = null;
      this.deleting = false;
    },

    async confirmDelete() {
      if (!this.categoryToDelete) return;

      this.deleting = true;

      try {
        await apiClient.categories.delete(this.categoryToDelete.name);
        this.editingCategory = null;
        this.$root.showNotification(this.t('categoryDeletedSuccessfully'), 'success');
        await this.fetchCategories();
        this.cancelDelete();
      } catch (error) {
        this.$root.showNotification(
          error.message || this.t('failedToDeleteCategory'),
          'error'
        );
        this.deleting = false;
      }
    },

    async handleDelete(category) {
      // Legacy method - now redirects to modal
      this.showDeleteModal(category);
    },

    handleKeydown(event) {
      // Close modal on ESC key
      if (event.key === 'Escape' && this.showDeleteConfirmation) {
        this.cancelDelete();
      }
    }
  }
};
