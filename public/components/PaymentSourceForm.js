// Payment Source Form Component
const PaymentSourceForm = {
  props: {
    editingSource: Object,
    loading: Boolean
  },
  
  emits: ['submit', 'cancel'],
  
  data() {
    return {
      name: ''
    };
  },
  
  watch: {
    editingSource: {
      immediate: true,
      handler(newSource) {
        this.name = newSource ? newSource.name : '';
      }
    }
  },
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        {{ editingSource ? t('edit') + ' ' + t('paymentSource') : t('createNew') + ' ' + t('paymentSource') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <input
          v-model="name"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          :placeholder="t('newPaymentSourceNamePlaceholder')"
        />
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            v-haptic:success
            class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 font-medium active:scale-95 transition-transform"
          >
            {{ loading ? t('saving') : (editingSource ? t('save') : t('createNew')) }}
          </button>
          <button
            v-if="editingSource"
            type="button"
            @click="$emit('cancel')"
            v-haptic:light
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
          >
            {{ t('cancel') }}
          </button>
        </div>
      </form>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    handleSubmit() {
      this.$emit('submit', this.name);
      if (!this.editingSource) {
        this.name = '';
      }
    }
  }
};
