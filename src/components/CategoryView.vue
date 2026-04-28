<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('manageCategoriesTitle') }}</h2>
        <button @click="$emit('change-tab', 'settings')" class="text-gray-500 dark:text-gray-400"><i class="fas fa-times"></i></button>
      </div>
      <form @submit.prevent="saveCategory" class="space-y-3">
        <input type="text" v-model="localCategoryName" :placeholder="t('newCategoryNamePlaceholder')" required class="text-sm p-2 border border-gray-300 rounded-md shadow-sm w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
        <div class="flex space-x-2">
          <button type="button" @click="$emit('cancel-edit-category')" class="text-sm w-full py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 mt-2">{{ t('cancel') }}</button>
          <button type="submit" :class="['text-sm w-full py-2 rounded text-white mt-2', accentBgClass]"><i class="fas fa-save"></i> {{ t('save') }}</button>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
      <h2 class="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">{{ t('manageCategoriesListTitle') }}</h2>
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="category in categories" :key="category" @click="$emit('edit-category', category)" class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ category }}</span>
          <button @click.stop="$emit('delete-category-confirm', category)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><i class="fas fa-trash"></i></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryView",
  props: {
    newCategoryName: String,
    categories: Array,
    editingCategory: String,
    accentBgClass: String,
    t: Function,
  },
  data() {
    return {
      localCategoryName: this.newCategoryName || "",
    };
  },
  watch: {
    newCategoryName(value) {
      this.localCategoryName = value || "";
    },
  },
  methods: {
    saveCategory() {
      this.$emit('save-category', this.localCategoryName);
    },
  },
};
</script>
