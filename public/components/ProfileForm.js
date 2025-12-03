// Profile Form Component
const ProfileForm = {
  props: {
    user: Object,
    loading: Boolean,
    error: String,
    success: String
  },
  
  emits: ['submit', 'clear-error', 'clear-success'],
  
  data() {
    return {
      name: '',
      email: ''
    };
  },
  
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.name = newUser.name || '';
          this.email = newUser.email || '';
        }
      }
    }
  },
  
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        {{ t('updateProfile') }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>{{ error }}</span>
          <button type="button" @click="$emit('clear-error')" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>{{ success }}</span>
          <button type="button" @click="$emit('clear-success')" class="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('email') }}
          </label>
          <input
            v-model="email"
            type="email"
            disabled
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            :placeholder="t('emailPlaceholder')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('fullName') }}
          </label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            :placeholder="t('fullNamePlaceholder')"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 active:scale-95 transition-all"
        >
          {{ loading ? (t('saving') || 'Menyimpan...') : t('save') }}
        </button>
      </form>
    </div>
  `,
  
  methods: {
    t(key) {
      return this.$root.t(key);
    },
    
    handleSubmit() {
      this.$emit('submit', { name: this.name, email: this.email });
    }
  }
};
