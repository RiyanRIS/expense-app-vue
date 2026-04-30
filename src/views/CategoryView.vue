<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('manageCategoriesTitle') }}</h2>
        <button @click="handleGoBack" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>
      <form @submit.prevent="handleSaveCategory" class="space-y-3">
        <input type="text" v-model="newCategoryName" :placeholder="t('newCategoryNamePlaceholder')" required class="text-sm p-2 border border-gray-300 rounded-md shadow-sm w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
        <div class="flex space-x-2">
          <button type="button" @click="handleCancelEdit" class="text-sm w-full py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 mt-2">{{ t('cancel') }}</button>
          <button type="submit" :class="['text-sm w-full py-2 rounded text-white mt-2', accentBgClass]"><i class="fas fa-save"></i> {{ t('save') }}</button>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <h2 class="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('manageCategoriesListTitle') }}</h2>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="category in categories" :key="category" @click="handleEditCategory(category)" class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ category }}</span>
          <button @click.stop="handleDeleteCategory(category)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><i class="fas fa-trash"></i></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useAppStore } from '../stores/app.js';
import { createCategory, updateCategory, deleteCategory } from '../services/dataService.js';
import { showToast } from '../services/utilityService.js';
import Swal from 'sweetalert2';

export default {
  name: "CategoryView",
  data() {
    return {
      newCategoryName: '',
      editingCategory: null,
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    categories() {
      return this.appStore.categories;
    },
    accentBgClass() {
      return this.appStore.accentBgClass;
    },
  },
  methods: {
    t(key, ...replacements) {
      return this.appStore.t(key, ...replacements);
    },
    handleGoBack() {
      this.$router.push('/settings');
    },
    handleEditCategory(category) {
      this.editingCategory = category;
      this.newCategoryName = category;
    },
    handleCancelEdit() {
      this.editingCategory = null;
      this.newCategoryName = '';
    },
    async handleSaveCategory() {
      if (!this.newCategoryName.trim()) {
        showToast('Category name cannot be empty', 'error');
        return;
      }

      try {
        if (this.editingCategory) {
          // Update existing category
          await updateCategory(this.editingCategory, { name: this.newCategoryName });
        } else {
          // Create new category
          await createCategory({ name: this.newCategoryName });
        }
        
        await this.appStore.fetchCategories();
        showToast('Category saved successfully');
        this.newCategoryName = '';
        this.editingCategory = null;
      } catch (error) {
        console.error('Error saving category:', error);
        showToast('Error saving category', 'error');
      }
    },
    async handleDeleteCategory(category) {
      const result = await Swal.fire({
        title: this.t('confirmDelete'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.t('delete'),
        cancelButtonText: this.t('cancel'),
      });

      if (result.isConfirmed) {
        try {
          await deleteCategory(category);
          await this.appStore.fetchCategories();
          showToast('Category deleted');
        } catch (error) {
          console.error('Error deleting category:', error);
          showToast('Error deleting category', 'error');
        }
      }
    },
  },
};
</script>
