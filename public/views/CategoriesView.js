// Categories View Component
const CategoriesView = {
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
        <!-- Add Category Form -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            {{ editingCategory ? t('edit') + ' ' + t('category') : t('createNew') + ' ' + t('category') }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-3">
            <input
              v-model="categoryForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              :placeholder="t('newCategoryNamePlaceholder')"
            />
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
              >
                {{ loading ? t('saving') : (editingCategory ? t('save') : t('createNew')) }}
              </button>
              <button
                v-if="editingCategory"
                type="button"
                @click="cancelEdit"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
              >
                {{ t('cancel') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Categories List -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('listOfCategories') }}
            </h3>
          </div>

          <!-- Loading State -->
          <div v-if="loadingCategories" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-3xl text-indigo-600 dark:text-indigo-400"></i>
          </div>

          <!-- Empty State -->
          <div v-else-if="categories.length === 0" class="p-8 text-center">
            <i class="fas fa-tags text-5xl text-gray-300 dark:text-gray-600"></i>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              {{ t('noCategories') || 'Belum ada kategori' }}
            </p>
          </div>

          <!-- Categories List -->
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="category in categories"
              :key="category._id || category.name"
              class="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700 transition"
            >
              <div class="flex items-center min-w-0 flex-1" @click="startEdit(category)">
                <i class="fas fa-tag text-indigo-600 dark:text-indigo-400 mr-3 text-lg"></i>
                <span class="text-gray-900 dark:text-white font-medium truncate">
                  {{ category.name }}
                </span>
              </div>

              <div class="flex gap-2 ml-3">
                <button
                  @click="showDeleteModal(category)"
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
      </div>
    </div>
  `,

  data() {
    return {
      categories: [],
      categoryForm: {
        name: ''
      },
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
        const response = await apiClient.categories.getAll();
        this.categories = response.categories || [];
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.$root.showNotification(this.t('failedToLoadCategories') || 'Gagal memuat kategori', 'error');
      } finally {
        this.loadingCategories = false;
      }
    },

    async handleSubmit() {
      this.loading = true;

      try {
        if (this.editingCategory) {
          // Update existing category
          await apiClient.categories.update(this.editingCategory.name, this.categoryForm.name);
          this.$root.showNotification(this.t('categoryUpdatedSuccessfully'), 'success');
        } else {
          // Create new category
          await apiClient.categories.create(this.categoryForm.name);
          this.$root.showNotification(this.t('categoryAddedSuccessfully'), 'success');
        }
        
        this.categoryForm.name = '';
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
      this.categoryForm.name = '';
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
        this.categoryForm.name = '';
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
