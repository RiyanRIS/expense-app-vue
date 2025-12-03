// Filter Tabs Component
const FilterTabs = {
  props: {
    activeFilter: String,
    filterOptions: Array
  },
  
  emits: ['update:activeFilter'],
  
  template: `
    <div class="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div class="flex space-x-2 pb-2">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          @click="$emit('update:activeFilter', filterOption.value)"
          class="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
          :class="activeFilter === filterOption.value 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
        >
          {{ filterOption.label }}
        </button>
      </div>
    </div>
  `
};
