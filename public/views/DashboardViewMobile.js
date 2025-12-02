// Mobile-Optimized Dashboard View
const DashboardViewMobile = {
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Pull to Refresh Indicator -->
        <div v-if="isRefreshing" class="flex justify-center py-2">
          <i class="fas fa-spinner fa-spin text-2xl text-indigo-600"></i>
        </div>

        <!-- Statistics Cards - Swipeable -->
        <div class="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div class="flex space-x-3 pb-2">
            <!-- Total Today -->
            <div class="flex-shrink-0 w-40 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <i class="fas fa-calendar-day text-white text-xl opacity-80"></i>
                <span class="text-xs text-white opacity-75">{{ t('today') }}</span>
              </div>
              <p class="text-2xl font-bold text-white">{{ formatCurrency(totalToday) }}</p>
              <p class="text-xs text-white opacity-75 mt-1">{{ expensesToday }} {{ t('items') }}</p>
            </div>

            <!-- Total This Month -->
            <div class="flex-shrink-0 w-40 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <i class="fas fa-calendar-alt text-white text-xl opacity-80"></i>
                <span class="text-xs text-white opacity-75">{{ t('thisMonth') }}</span>
              </div>
              <p class="text-2xl font-bold text-white">{{ formatCurrency(totalMonth) }}</p>
              <p class="text-xs text-white opacity-75 mt-1">{{ expensesMonth }} {{ t('items') }}</p>
            </div>

            <!-- Top Category -->
            <div class="flex-shrink-0 w-40 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <i class="fas fa-tag text-white text-xl opacity-80"></i>
                <span class="text-xs text-white opacity-75">{{ t('topCategory') }}</span>
              </div>
              <p class="text-base font-bold text-white truncate">{{ topCategory || '-' }}</p>
              <p class="text-xs text-white opacity-75 mt-1">{{ formatCurrency(topCategoryAmount) }}</p>
            </div>

            <!-- Top Payment -->
            <div class="flex-shrink-0 w-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <i class="fas fa-credit-card text-white text-xl opacity-80"></i>
                <span class="text-xs text-white opacity-75">{{ t('topPayment') }}</span>
              </div>
              <p class="text-base font-bold text-white truncate">{{ topPaymentSource || '-' }}</p>
              <p class="text-xs text-white opacity-75 mt-1">{{ formatCurrency(topPaymentAmount) }}</p>
            </div>
          </div>
        </div>

        <!-- Filter Tabs - Touch Optimized -->
        <div class="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div class="flex space-x-2 pb-2">
            <button
              v-for="filterOption in filterOptions"
              :key="filterOption.value"
              @click="filter = filterOption.value"
              class="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
              :class="filter === filterOption.value 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
            >
              {{ filterOption.label }}
            </button>
          </div>
        </div>

        <!-- Expenses List - Swipeable Items -->
        <div class="space-y-3">
          <div
            v-for="expense in filteredExpenses"
            :key="expense._id"
            @touchstart="handleTouchStart($event, expense)"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            class="relative"
          >
            <!-- Swipe Actions Background -->
            <div class="absolute inset-0 flex items-center justify-between px-6 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl">
              <i class="fas fa-trash text-white text-xl"></i>
              <i class="fas fa-trash text-white text-xl"></i>
            </div>

            <!-- Expense Card -->
            <div
              :style="{ transform: swipedExpense === expense._id ? \`translateX(\${swipeOffset}px)\` : '' }"
              class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform"
              @click="selectExpense(expense)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {{ expense.category }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {{ expense.payment_source }}
                    </span>
                  </div>
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {{ expense.item }}
                  </h3>
                  <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    <span class="flex items-center">
                      <i class="far fa-calendar mr-1"></i>
                      {{ formatDate(expense.date) }}
                    </span>
                    <span v-if="expense.store" class="flex items-center">
                      <i class="far fa-building mr-1"></i>
                      {{ expense.store }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col items-end ml-4">
                  <p class="text-lg font-bold text-red-600 dark:text-red-400">
                    {{ formatCurrency(expense.amount) }}
                  </p>
                  <button
                    @click.stop="toggleExpenseMenu(expense._id)"
                    class="mt-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    <i class="fas fa-ellipsis-v text-gray-400"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredExpenses.length === 0" class="text-center py-16">
            <i class="fas fa-receipt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">
              {{ t('noExpenses') }}
            </p>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {{ t('tapPlusToAdd') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Add FAB Button -->
      <button
        v-if="!showExpenseModal && !showQuickAddModal"
        @click="showQuickAddModal = true"
        class="fixed right-4 bottom-20 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-full shadow-2xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40"
      >
        <i class="fas fa-bolt text-white text-2xl"></i>
      </button>

      <!-- Quick Add Bottom Sheet -->
      <transition name="slide-up">
        <div v-if="showQuickAddModal" class="fixed inset-0 z-[60] flex items-end">
          <div @click="closeQuickAddModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
          <div @click.stop class="relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
            <!-- Handle Bar -->
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            <!-- Quick Add Content -->
            <div class="px-5 pb-8">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('quickAddItems') }}</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('quickAddDescription') }}</p>
                </div>
                <button
                  @click="$router.push('/quick-add')"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <i class="fas fa-cog text-gray-600 dark:text-gray-400"></i>
                </button>
              </div>

              <!-- Quick Add Items List -->
              <div v-if="quickAddItems.length > 0" class="space-y-3">
                <button
                  v-for="item in quickAddItems"
                  :key="item._id"
                  @click="useQuickAddItem(item)"
                  class="w-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 active:scale-98 transition-all text-left"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                          {{ item.category }}
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          {{ item.payment_source }}
                        </span>
                      </div>
                      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {{ item.item }}
                      </h3>
                      <p v-if="item.store" class="text-sm text-gray-500 dark:text-gray-400">
                        {{ item.store }}
                      </p>
                    </div>
                    <div class="ml-4">
                      <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {{ formatCurrency(item.amount) }}
                      </p>
                      <div class="flex items-center justify-end mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <i class="fas fa-bolt mr-1"></i>
                        <span>{{ t('use') }}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-12">
                <i class="fas fa-bolt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                  {{ t('noQuickAddItems') }}
                </p>
                <button
                  @click="$router.push('/quick-add')"
                  class="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  <i class="fas fa-plus mr-2"></i>
                  {{ t('createNew') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Bottom Sheet - Add/Edit Expense -->
      <transition name="slide-up">
        <div v-if="showExpenseModal" class="fixed inset-0 z-[60] flex items-end">
          <div @click="closeExpenseModal" class="absolute inset-0 bg-black bg-opacity-50"></div>
          <div @click.stop class="relative w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <!-- Handle Bar -->
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            <!-- Form Content -->
            <div class="px-5 pb-8">
              <!-- Inline Expense Form -->
              <div class="space-y-4 pt-4">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {{ selectedExpense ? t('edit') : t('createNew') }}
                </h2>

                <form @submit.prevent="saveExpense" class="space-y-4">
                  <!-- Item Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('itemPlaceholder') }}
                    </label>
                    <input
                      v-model="formData.item"
                      type="text"
                      :placeholder="t('itemPlaceholder')"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <!-- Amount -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('amountPlaceholder') }}
                    </label>
                    <input
                      v-model="formData.amount"
                      type="number"
                      :placeholder="t('amountPlaceholder')"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <!-- Store (Optional) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('storePlaceholder') }} ({{ t('optional') }})
                    </label>
                    <input
                      v-model="formData.store"
                      type="text"
                      :placeholder="t('storePlaceholder')"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Category -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('selectCategory') }}
                    </label>
                    <select
                      v-model="formData.category"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">{{ t('selectCategory') }}</option>
                      <option v-for="cat in categories" :key="cat._id" :value="cat.name">
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Payment Source -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('selectPaymentSource') }}
                    </label>
                    <select
                      v-model="formData.payment_source"
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">{{ t('selectPaymentSource') }}</option>
                      <option v-for="source in paymentSources" :key="source._id" :value="source.name">
                        {{ source.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex space-x-3 pt-4">
                    <button
                      type="button"
                      @click="closeExpenseModal"
                      class="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
                    >
                      {{ t('cancel') }}
                    </button>
                    <button
                      type="submit"
                      :disabled="saving"
                      class="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {{ saving ? t('saving') : t('save') }}
                    </button>
                  </div>

                  <!-- Delete Button (if editing) -->
                  <button
                    v-if="selectedExpense"
                    type="button"
                    @click="deleteCurrentExpense"
                    class="w-full px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all"
                  >
                    {{ t('delete') }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <mobile-bottom-nav v-if="!showExpenseModal"></mobile-bottom-nav>
    </div>
  `,

  data() {
    return {
      expenses: [],
      categories: [],
      paymentSources: [],
      quickAddItems: [],
      filter: 'all',
      loading: false,
      isRefreshing: false,
      selectedExpense: null,
      showExpenseModal: false,
      showQuickAddModal: false,
      swipedExpense: null,
      swipeOffset: 0,
      touchStartX: 0,
      touchStartY: 0,
      saving: false,
      lastBackPress: 0,
      backPressTimeout: null,
      formData: {
        item: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        date: new Date().toISOString().slice(0, 10)
      },
      filterOptions: [
        { value: 'all', label: this.t('all') || 'Semua' },
        { value: 'today', label: this.t('today') || 'Hari Ini' },
        { value: 'yesterday', label: this.t('yesterday') || 'Kemarin' },
        { value: 'thisWeek', label: this.t('thisWeek') || 'Minggu Ini' },
        { value: 'thisMonth', label: this.t('thisMonth') || 'Bulan Ini' }
      ]
    };
  },

  computed: {
    filteredExpenses() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      return this.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        switch (this.filter) {
          case 'today':
            return expenseDate >= today;
          case 'yesterday':
            return expenseDate >= yesterday && expenseDate < today;
          case 'thisWeek':
            return expenseDate >= thisWeekStart;
          case 'thisMonth':
            return expenseDate >= thisMonthStart;
          default:
            return true;
        }
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    totalToday() {
      const today = new Date().toISOString().slice(0, 10);
      return this.expenses
        .filter(e => e.date === today)
        .reduce((sum, e) => sum + e.amount, 0);
    },

    expensesToday() {
      const today = new Date().toISOString().slice(0, 10);
      return this.expenses.filter(e => e.date === today).length;
    },

    totalMonth() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      return this.expenses
        .filter(e => e.date >= monthStart)
        .reduce((sum, e) => sum + e.amount, 0);
    },

    expensesMonth() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      return this.expenses.filter(e => e.date >= monthStart).length;
    },

    topCategory() {
      const categories = {};
      this.expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
      });
      return Object.keys(categories).sort((a, b) => categories[b] - categories[a])[0];
    },

    topCategoryAmount() {
      if (!this.topCategory) return 0;
      return this.expenses
        .filter(e => e.category === this.topCategory)
        .reduce((sum, e) => sum + e.amount, 0);
    },

    topPaymentSource() {
      const sources = {};
      this.expenses.forEach(e => {
        sources[e.payment_source] = (sources[e.payment_source] || 0) + e.amount;
      });
      return Object.keys(sources).sort((a, b) => sources[b] - sources[a])[0];
    },

    topPaymentAmount() {
      if (!this.topPaymentSource) return 0;
      return this.expenses
        .filter(e => e.payment_source === this.topPaymentSource)
        .reduce((sum, e) => sum + e.amount, 0);
    }
  },

  watch: {
    '$route.query.action'(newAction) {
      if (newAction === 'add') {
        // Use nextTick to avoid navigation during navigation
        this.$nextTick(() => {
          this.openNewExpenseForm();
          // Clean up the URL without causing navigation loop
          if (this.$route.query.action) {
            const query = { ...this.$route.query };
            delete query.action;
            this.$router.replace({ path: '/dashboard', query });
          }
        });
      }
    },
    

  },

  async created() {
    await this.loadData();
    
    // Check if we should show add form from query parameter
    if (this.$route.query.action === 'add') {
      // Use nextTick to ensure component is fully mounted
      this.$nextTick(() => {
        this.openNewExpenseForm();
        // Clean up the URL without navigation loop
        const query = { ...this.$route.query };
        delete query.action;
        this.$router.replace({ path: '/dashboard', query });
      });
    }
    
    // Listen for add expense event from bottom nav (fallback)
    this.$root.$on('show-add-expense', () => {
      this.openNewExpenseForm();
    });

    // Pull to refresh
    this.setupPullToRefresh();
    
    // Handle browser back button
    this.setupBackButtonHandler();
  },

  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('popstate', this.handleBackButton);
    this.$root.$off('show-add-expense');
    
    if (this.backPressTimeout) {
      clearTimeout(this.backPressTimeout);
    }
  },

  methods: {
    t(key) {
      return this.$root.t(key);
    },

    formatCurrency(amount) {
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    },

    async loadData() {
      this.loading = true;
      try {
        const [expensesRes, categoriesRes, sourcesRes, quickAddRes] = await Promise.all([
          apiClient.expenses.getAll(),
          apiClient.categories.getAll(),
          apiClient.paymentSources.getAll(),
          apiClient.quickAddItems.getAll()
        ]);

        this.expenses = expensesRes.expenses || [];
        this.categories = categoriesRes.categories || [];
        this.paymentSources = sourcesRes.paymentSources || [];
        this.quickAddItems = quickAddRes.quickAddItems || [];
      } catch (error) {
        this.$root.showNotification(error.message || 'Failed to load data', 'error');
      } finally {
        this.loading = false;
        this.isRefreshing = false;
      }
    },

    setupBackButtonHandler() {
      this.handleBackButton = (event) => {
        // If expense modal is open, close it
        if (this.showExpenseModal) {
          this.closeExpenseModal();
          return;
        }
        
        // If quick add modal is open, close it
        if (this.showQuickAddModal) {
          this.showQuickAddModal = false;
          return;
        }
        
        // If no modals open and on dashboard, handle exit confirmation
        if (this.$route.path === '/dashboard') {
          const currentTime = Date.now();
          const timeSinceLastBack = currentTime - this.lastBackPress;
          
          if (timeSinceLastBack < 2000) {
            // Double back press detected - allow exit
            this.lastBackPress = 0;
            if (this.backPressTimeout) {
              clearTimeout(this.backPressTimeout);
            }
            // Let the browser handle the back
            return;
          } else {
            // First back press - prevent default
            event.preventDefault();
            this.lastBackPress = currentTime;
            
            // Show notification
            this.$root.showNotification(
              this.t('pressBackAgainToExit') || 'Tekan sekali lagi untuk keluar',
              'info'
            );
            
            // Reset after 2 seconds
            this.backPressTimeout = setTimeout(() => {
              this.lastBackPress = 0;
            }, 2000);
          }
        }
      };
      
      window.addEventListener('popstate', this.handleBackButton);
    },

    setupPullToRefresh() {
      let startY = 0;
      let currentY = 0;

      window.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
          startY = e.touches[0].clientY;
        }
      });

      window.addEventListener('touchmove', (e) => {
        if (startY > 0) {
          currentY = e.touches[0].clientY;
          if (currentY - startY > 100 && !this.isRefreshing) {
            this.isRefreshing = true;
            this.loadData();
          }
        }
      });

      window.addEventListener('touchend', () => {
        startY = 0;
        currentY = 0;
      });
    },

    handleTouchStart(e, expense) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.swipedExpense = expense._id;
    },

    handleTouchMove(e) {
      if (!this.swipedExpense) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - this.touchStartX;
      const deltaY = currentY - this.touchStartY;

      // Only swipe horizontally if the swipe is more horizontal than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
        this.swipeOffset = Math.max(-100, Math.min(0, deltaX));
      }
    },

    handleTouchEnd() {
      if (this.swipeOffset < -60) {
        // Delete expense
        const expense = this.expenses.find(e => e._id === this.swipedExpense);
        if (expense && confirm(this.t('confirmDelete'))) {
          this.deleteExpense(expense);
        }
      }
      
      this.swipedExpense = null;
      this.swipeOffset = 0;
    },

    selectExpense(expense) {
      this.selectedExpense = expense;
      this.formData = {
        item: expense.item,
        amount: expense.amount,
        store: expense.store || '',
        category: expense.category,
        payment_source: expense.payment_source,
        date: expense.date
      };
      this.showExpenseModal = true;
    },

    closeExpenseModal() {
      this.showExpenseModal = false;
      this.selectedExpense = null;
      this.formData = {
        item: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        date: new Date().toISOString().slice(0, 10)
      };
      
      // Pop the history state if it was added by modal
      if (window.history.state?.modal === 'expense') {
        window.history.back();
      }
    },

    closeQuickAddModal() {
      this.showQuickAddModal = false;
      
      // Pop the history state if it was added by modal
      if (window.history.state?.modal === 'quickAdd') {
        window.history.back();
      }
    },

    openNewExpenseForm() {
      this.selectedExpense = null;
      this.formData = {
        item: '',
        amount: '',
        store: '',
        category: '',
        payment_source: '',
        date: new Date().toISOString().slice(0, 10)
      };
      this.showExpenseModal = true;
    },

    async useQuickAddItem(quickItem) {
      this.saving = true;
      try {
        const expenseData = {
          item: quickItem.item,
          amount: parseFloat(quickItem.amount),
          store: quickItem.store || '',
          category: quickItem.category,
          payment_source: quickItem.payment_source,
          date: new Date().toISOString().slice(0, 10)
        };

        await apiClient.expenses.create(expenseData);
        await this.loadData();
        this.$root.showNotification(this.t('expenseSaved'), 'success');
        this.closeQuickAddModal();
      } catch (error) {
        this.$root.showNotification(error.message, 'error');
      } finally {
        this.saving = false;
      }
    },

    async saveExpense() {
      this.saving = true;
      try {
        const expenseData = {
          ...this.formData,
          amount: parseFloat(this.formData.amount)
        };

        if (this.selectedExpense) {
          await apiClient.expenses.update(this.selectedExpense._id, expenseData);
        } else {
          await apiClient.expenses.create(expenseData);
        }

        await this.loadData();
        this.$root.showNotification(this.t('expenseSaved'), 'success');
        this.closeExpenseModal();
      } catch (error) {
        this.$root.showNotification(error.message, 'error');
      } finally {
        this.saving = false;
      }
    },

    async deleteCurrentExpense() {
      if (!this.selectedExpense) return;
      
      if (confirm(this.t('confirmDelete'))) {
        try {
          await apiClient.expenses.delete(this.selectedExpense._id);
          await this.loadData();
          this.$root.showNotification(this.t('expenseDeleted'), 'success');
          this.closeExpenseModal();
        } catch (error) {
          this.$root.showNotification(error.message, 'error');
        }
      }
    },

    async deleteExpense(expense) {
      try {
        await apiClient.expenses.delete(expense._id);
        await this.loadData();
        this.$root.showNotification(this.t('expenseDeleted'), 'success');
      } catch (error) {
        this.$root.showNotification(error.message, 'error');
      }
    },

    toggleExpenseMenu(expenseId) {
      // Simple implementation - just show edit modal
      const expense = this.expenses.find(e => e._id === expenseId);
      if (expense) {
        this.selectExpense(expense);
      }
    }
  }
};
