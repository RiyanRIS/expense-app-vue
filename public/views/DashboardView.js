// Mobile-Optimized Dashboard View
const DashboardView = {
  components: {
    'statistics-cards': StatisticsCards,
    'filter-tabs': FilterTabs,
    'expense-list': ExpenseList,
    'quick-add-modal': QuickAddModal,
    'expense-form-modal': ExpenseFormModal,
    'delete-confirm-modal': DeleteConfirmModal
  },

  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-14">
      <mobile-top-bar></mobile-top-bar>

      <div class="px-4 py-4 space-y-4">
        <!-- Pull to Refresh Indicator -->
        <div v-if="isRefreshing" class="flex justify-center py-2">
          <i class="fas fa-spinner fa-spin text-2xl text-indigo-600"></i>
        </div>

        <!-- Statistics Cards -->
        <statistics-cards
          :total-today="totalToday"
          :expenses-today="expensesToday"
          :total-month="totalMonth"
          :expenses-month="expensesMonth"
          :top-category="topCategory"
          :top-category-amount="topCategoryAmount"
          :top-payment-source="topPaymentSource"
          :top-payment-amount="topPaymentAmount"
        />

        <!-- Filter Tabs -->
        <filter-tabs
          :active-filter="filter"
          :filter-options="filterOptions"
          @update:active-filter="filter = $event"
        />

        <!-- Expenses List -->
        <expense-list
          :expenses="filteredExpenses"
          :swiped-expense-id="swipedExpense"
          :swipe-offset="swipeOffset"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @select="selectExpense"
          @menu="toggleExpenseMenu"
        />
      </div>

      <!-- Quick Add FAB Button -->
      <button
        v-if="!showExpenseModal && !showQuickAddModal"
        @click="showQuickAddModal = true"
        class="fixed right-4 bottom-20 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-full shadow-2xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all z-40"
      >
        <i class="fas fa-bolt text-white text-2xl"></i>
      </button>

      <!-- Quick Add Modal -->
      <quick-add-modal
        :show="showQuickAddModal"
        :quick-add-items="quickAddItems"
        :saving="saving"
        @close="closeQuickAddModal"
        @use-item="useQuickAddItem"
        @manage="$router.push('/quick-add')"
      />

      <!-- Expense Form Modal -->
      <expense-form-modal
        :show="showExpenseModal"
        :expense="selectedExpense"
        :categories="categories"
        :payment-sources="paymentSources"
        :saving="saving"
        @close="closeExpenseModal"
        @save="saveExpense"
        @delete="deleteCurrentExpense"
        @category-created="loadCategories"
      />

      <!-- Delete Confirmation Modal -->
      <delete-confirm-modal
        :show="showDeleteConfirmation"
        :item="expenseToDelete"
        :deleting="deleting"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />

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
      showDeleteConfirmation: false,
      expenseToDelete: null,
      deleting: false,
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
    
    // Add keyboard listener for modal
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('popstate', this.handleBackButton);
    document.removeEventListener('keydown', this.handleKeydown);
    this.$root.$off('show-add-expense');
    
    if (this.backPressTimeout) {
      clearTimeout(this.backPressTimeout);
    }
  },

  methods: {
    t(key) {
      return this.$root.t(key);
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

    async loadCategories() {
      try {
        const categoriesRes = await apiClient.categories.getAll();
        this.categories = categoriesRes.categories || [];
      } catch (error) {
        console.error('Failed to reload categories:', error);
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
        if (!expense) return;
        this.deleteExpense(expense);
      }
      
      this.swipedExpense = null;
      this.swipeOffset = 0;
    },

    selectExpense(expense) {
      this.selectedExpense = expense;
      this.showExpenseModal = true;
    },

    closeExpenseModal() {
      this.showExpenseModal = false;
      this.selectedExpense = null;
      
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
      this.showExpenseModal = true;
    },

    async useQuickAddItem(quickItem) {
      this.saving = true;
      try {
        const expenseData = {
          name: quickItem.name,
          amount: parseFloat(quickItem.amount),
          store: quickItem.store || '',
          category: quickItem.category || '',
          payment_source: quickItem.payment_source || '',
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

    async saveExpense(data) {
      this.saving = true;
      try {
        const isIncome = data.type === 'income';
        const apiEndpoint = isIncome ? apiClient.incomes : apiClient.expenses;
        
        // Format category name to ucfirst
        const formattedCategory = this.ucFirst(data.category);
        
        // Check if category exists
        const categoryExists = this.categories.some(
          cat => cat.name.toLowerCase() === formattedCategory.toLowerCase()
        );

        // Create category if it doesn't exist
        if (!categoryExists && formattedCategory) {
          try {
            const categoryType = isIncome ? 'income' : 'expense';
            await apiClient.categories.create(formattedCategory, categoryType);
            await this.loadCategories(); // Refresh categories list
          } catch (error) {
            console.error('Failed to create category:', error);
            // Continue even if category creation fails
          }
        }

        // Remove type from data before sending and add formatted category
        const { type, ...transactionData } = {
          ...data,
          category: formattedCategory
        };
        
        if (this.selectedExpense) {
          // Check if editing existing transaction
          const isEditingIncome = this.selectedExpense.source !== undefined;
          const editEndpoint = isEditingIncome ? apiClient.incomes : apiClient.expenses;
          await editEndpoint.update(this.selectedExpense._id, transactionData);
        } else {
          // Creating new transaction
          await apiEndpoint.create(transactionData);
        }

        await this.loadData();
        const message = isIncome 
          ? (this.t('incomeSaved') || 'Pemasukan berhasil disimpan')
          : this.t('expenseSaved');
        this.$root.showNotification(message, 'success');
        this.closeExpenseModal();
      } catch (error) {
        this.$root.showNotification(error.message, 'error');
      } finally {
        this.saving = false;
      }
    },

    ucFirst(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    async deleteCurrentExpense() {
      if (!this.selectedExpense) return;
      this.showDeleteModal(this.selectedExpense);
    },

    async deleteExpense(expense) {
      // Legacy method - now redirects to modal
      this.showDeleteModal(expense);
    },

    showDeleteModal(expense) {
      this.expenseToDelete = expense;
      this.showDeleteConfirmation = true;
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.expenseToDelete = null;
      this.deleting = false;
    },

    async confirmDelete() {
      if (!this.expenseToDelete) return;

      this.deleting = true;

      try {
        await apiClient.expenses.delete(this.expenseToDelete._id);
        
        // Close expense modal if it's open and we're deleting the current expense
        if (this.selectedExpense && this.selectedExpense._id === this.expenseToDelete._id) {
          this.closeExpenseModal();
        }
        
        await this.loadData();
        this.$root.showNotification(this.t('expenseDeleted'), 'success');
        this.cancelDelete();
      } catch (error) {
        this.$root.showNotification(error.message, 'error');
        this.deleting = false;
      }
    },

    toggleExpenseMenu(expenseId) {
      // Simple implementation - just show edit modal
      const expense = this.expenses.find(e => e._id === expenseId);
      if (expense) {
        this.selectExpense(expense);
      }
    },

    handleKeydown(event) {
      // Close delete modal on ESC key
      if (event.key === 'Escape' && this.showDeleteConfirmation) {
        this.cancelDelete();
      }
    }
  }
};
