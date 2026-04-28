import { defineStore } from 'pinia';
import {
  getExpenses,
  getCategories,
  getPaymentSources,
  getQuickAddItems,
  createExpense,
  updateExpense,
  deleteExpense,
  createCategory,
  updateCategory,
  deleteCategory,
  createPaymentSource,
  updatePaymentSource,
  deletePaymentSource,
  createQuickAddItem,
  updateQuickAddItem,
  deleteQuickAddItem,
  downloadBackup,
  restoreBackup,
} from './services/dataService.js';
import { addPendingExpense, getPendingExpenses } from './services/localDataService.js';
import { showToast } from './services/utilityService.js';

export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: false,
    tone: 'indigo',
    currentLang: localStorage.getItem('language') || 'id',
    translations: {
      id: {
        loginTitle: "Masuk ke Akun Anda",
        loginSubtitle: "Kelola pengeluaran Anda dengan mudah",
        login: "Masuk",
        loggingIn: "Memproses...",
        noAccount: "Belum punya akun?",
        signupNow: "Daftar Sekarang",
        createAccount: "Buat Akun Baru",
        signup: "Daftar",
        signupSubtitle: "Mulai kelola keuangan Anda hari ini",
        fullName: "Nama Lengkap",
        fullNamePlaceholder: "John Doe",
        email: "Email",
        emailPlaceholder: "email@example.com",
        password: "Password",
        confirmPassword: "Konfirmasi Password",
        passwordRequirement: "Minimal 6 karakter",
        creatingAccount: "Membuat akun...",
        haveAccount: "Sudah punya akun?",
        loginNow: "Masuk Sekarang",
        passwordMismatch: "Password tidak sama",
        signupFailed: "Pendaftaran gagal",
        loginFailed: "Login gagal",
        signupSuccess: "Akun berhasil dibuat!",
        loginSuccess: "Selamat datang kembali!",
        logoutSuccess: "Berhasil logout",
        offlineSyncNotice: "Mode offline, data akan disinkronkan saat online.",
        pendingSyncNotice: "Menunggu Sinkronisasi",
        pendingSyncNoticeDetail: "data akan dikirim saat online",
        triggerSync: "Kirim Sekarang",
        totalTodayNotice: "Total Hari Ini",
        totalMonthNotice: "Total Bulan Ini",
        topCategoryNotice: "Kategori Paling Sering",
        topSourceNotice: "Sumber Dana Paling Sering",
        topStoreNotice: "Toko Paling Sering",
        filterNotice: "Filter Pengeluaran",
        allNotice: "Semua",
        todayNotice: "Hari Ini",
        yesterdayNotice: "Kemarin",
        thisWeekNotice: "Minggu Ini",
        thisMonthNotice: "Bulan Ini",
        latestNotice: "Transaksi Terbaru",
        backupRestore: "Backup & Restore",
        backupData: "Backup Data",
        backupNotice: "Unduh semua data pengeluaran, kategori, dan sumber dana.",
        downloadBackup: "Unduh Backup",
        restoreData: "Restore Data",
        restoreNotice: "Unggah file backup (.json) untuk mengembalikan data.",
        uploadRestore: "Unggah Restore",
        quickAddItems: "Quick Add Items",
        quickAddItemsList: "Daftar Quick Add Items",
        noQuickAddItems: "Belum ada Quick Add item.",
        itemError: "Nama barang tidak boleh kosong.",
        amountError: "Jumlah tidak boleh kosong.",
        amountPlaceholder: "Jumlah (e.g., 15.000)",
        itemPlaceholder: "Nama Barang*",
        selectCategory: "Pilih Kategori",
        selectPaymentSource: "Pilih Sumber Pembayaran",
        dayNames: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
        expenseDetail: "Detail Pengeluaran",
        item: "Nama Barang",
        amount: "Jumlah",
        category: "Kategori",
        paymentSource: "Sumber Dana",
        date: "Tanggal",
        time: "Waktu Input",
        noExpenseSelected: "Tidak ada pengeluaran yang sedang dipilih.",
        editExpense: "Edit Pengeluaran",
        theme: "Tema Aplikasi",
        accentColor: "Warna Aksen",
        clearCache: "Hapus Cache",
        testNotification: "Tes Notifikasi",
        notificationSuccess: "Notifikasi Berhasil",
        notificationError: "Notifikasi Gagal",
        manageCategories: "Kelola Kategori",
        managePaymentSources: "Kelola Sumber Dana",
        manageProfile: "Manajemen Profil",
        changePassword: "Ubah Password",
        forgotPassword: "Lupa Password",
        logout: "Logout",
        manageCategoriesTitle: "Atur Kategori",
        manageCategoriesListTitle: "Daftar Kategori",
        newCategoryNamePlaceholder: "Nama Kategori Baru",
        listOfCategories: "Daftar Kategori",
        managePaymentSourcesTitle: "Atur Sumber Dana",
        newPaymentSourceNamePlaceholder: "Nama Sumber Dana",
        listOfPaymentSources: "Daftar Sumber Dana",
        cancel: "Batal",
        save: "Simpan",
        edit: "Edit",
        delete: "Hapus",
        home: "Beranda",
        createNew: "Buat Baru",
        settings: "Pengaturan",
        pressAgainToExit: "Tekan sekali lagi untuk keluar.",
        dataOfflineSynced: "Data offline tersinkron!",
        categoryAddedSuccessfully: "Kategori berhasil ditambahkan!",
        failedToAddCategory: "Gagal menambahkan kategori.",
        categoryDeletedSuccessfully: "Kategori berhasil dihapus!",
        failedToDeleteCategory: "Gagal menghapus kategori.",
        categoryUpdatedSuccessfully: "Kategori berhasil diperbarui!",
        failedToUpdateCategory: "Gagal memperbarui kategori.",
        confirmDeleteCategory: 'Apakah Anda yakin ingin menghapus kategori "%s"?',
        paymentSourceAddedSuccessfully: "Sumber dana berhasil ditambahkan!",
        failedToAddPaymentSource: "Gagal menambahkan sumber dana.",
        paymentSourceDeletedSuccessfully: "Sumber dana berhasil dihapus!",
        failedToDeletePaymentSource: "Gagal menghapus sumber dana.",
        paymentSourceUpdatedSuccessfully: "Sumber dana berhasil diperbarui!",
        failedToUpdatePaymentSource: "Gagal memperbarui sumber dana.",
        confirmDeletePaymentSource: 'Apakah Anda yakin ingin menghapus sumber dana "%s"?',
        quickAddItemDeletedSuccessfully: "Item Quick Add berhasil dihapus!",
        failedToDeleteQuickAddItem: "Gagal menghapus item Quick Add.",
        confirmDeleteQuickAddItem: "Apakah Anda yakin ingin menghapus item Quick Add ini?",
        profileManagement: "Manajemen Profil",
        updateProfile: "Perbarui Profil",
        profilePhoto: "Foto Profil",
        profilePhotoPlaceholder: "URL foto profil (opsional)",
        profileUpdatedSuccessfully: "Profil berhasil diperbarui!",
        failedToUpdateProfile: "Gagal memperbarui profil.",
        passwordChangedSuccessfully: "Password berhasil diubah!",
        failedToChangePassword: "Gagal mengubah password.",
        forgotPasswordTitle: "Lupa Password",
        forgotPasswordSubtitle: "Masukkan email Anda untuk mendapatkan link reset password",
        resetPassword: "Reset Password",
        resetPasswordTitle: "Reset Password",
        resetPasswordSubtitle: "Masukkan password baru Anda",
        newPassword: "Password Baru",
        confirmNewPassword: "Konfirmasi Password Baru",
        resetLinkSent: "Link reset password telah dikirim ke email Anda",
        resetPasswordSuccess: "Password berhasil direset!",
        resetPasswordFailed: "Gagal mereset password.",
        invalidResetToken: "Token reset tidak valid atau sudah kadaluarsa",
        yearsAgo: "tahun lalu",
        monthsAgo: "bulan lalu",
        daysAgo: "hari lalu",
        hoursAgo: "jam lalu",
        minutesAgo: "menit lalu",
        justNow: "baru saja",
        testNotificationTitle: "Test Notifikasi",
        testNotificationBody: "Ini adalah notifikasi percobaan dari Expense View.",
        testNotificationSuccess: "Notifikasi berhasil dikirim!",
        testNotificationError: "Gagal mengirim notifikasi.",
        browserNotSupportNotification: "Browser ini tidak mendukung notifikasi.",
        notificationPermissionGranted: "Izin notifikasi diberikan!",
        notificationPermissionDenied: "Izin notifikasi ditolak.",
        notificationPermissionNotGranted: "Izin notifikasi tidak diberikan.",
        pushNotificationNotSupportedByBrowser: "Push notifikasi tidak didukung oleh browser ini.",
        notificationPermissionNotGrantedForPush: "Anda perlu memberikan izin notifikasi terlebih dahulu.",
        pushSubscriptionSuccess: "Berlangganan push notifikasi berhasil!",
        pushSubscriptionError: "Gagal berlangganan push notifikasi.",
        testNotificationSent: "Notifikasi uji coba berhasil dikirim!",
        testNotificationFailed: "Gagal mengirim notifikasi uji coba.",
        monthlySummary: "Monthly Summary",
        browserNotSupportClipboard: "Browser ini tidak mendukung Clipboard API.",
        monthlySummaryCopied: "Ringkasan bulan ini berhasil disalin!",
        monthlySummaryCopyFailed: "Gagal menyalin ringkasan.",
        total: "Total",
        backupDownloaded: "Backup berhasil diunduh!",
        backupDownloadedFallback: "Backup lokal berhasil diunduh!",
        restoreProcessing: "Memproses...",
        restoreSuccess: "Backup berhasil dipulihkan!",
        restoreSuccessFallback: "Backup fallback berhasil dipulihkan!",
        restoreFailed: "Gagal memulihkan backup.",
        editExpenseSuccess: "Pengeluaran berhasil diperbarui!",
        editExpenseFailed: "Gagal memperbarui pengeluaran.",
        deleteExpenseSuccess: "Pengeluaran berhasil dihapus!",
        deleteExpenseFailed: "Gagal menghapus pengeluaran.",
        addExpenseSuccess: "Pengeluaran berhasil disimpan",
        addExpenseSuccessOffline: "Pengeluaran berhasil disimpan offline, akan tersinkron.",
        addExpenseFailedOffline: "Gagal menambahkan pengeluaran offline.",
        clearCacheSuccess: "Cache berhasil dihapus dan halaman akan dimuat ulang.",
      },
      en: {
        loginTitle: "Login to Your Account",
        loginSubtitle: "Manage your expenses easily",
        login: "Login",
        loggingIn: "Processing...",
        noAccount: "Don't have an account?",
        signupNow: "Sign Up Now",
        createAccount: "Create New Account",
        signup: "Sign Up",
        signupSubtitle: "Start managing your finances today",
        fullName: "Full Name",
        fullNamePlaceholder: "John Doe",
        email: "Email",
        emailPlaceholder: "email@example.com",
        password: "Password",
        confirmPassword: "Confirm Password",
        passwordRequirement: "Minimum 6 characters",
        creatingAccount: "Creating account...",
        haveAccount: "Already have an account?",
        loginNow: "Login Now",
        passwordMismatch: "Passwords do not match",
        signupFailed: "Sign up failed",
        loginFailed: "Login failed",
        signupSuccess: "Account created successfully!",
        loginSuccess: "Welcome back!",
        logoutSuccess: "Successfully logged out",
        offlineSyncNotice: "Offline mode, data will sync when online.",
        pendingSyncNotice: "Waiting for Sync",
        pendingSyncNoticeDetail: "data will be sent when online",
        triggerSync: "Sync Now",
        totalTodayNotice: "Today's Total",
        totalMonthNotice: "This Month's Total",
        topCategoryNotice: "Most Frequent Category",
        topSourceNotice: "Most Used Payment Source",
        topStoreNotice: "Most Frequent Store",
        filterNotice: "Filter Expenses",
        allNotice: "All",
        todayNotice: "Today",
        yesterdayNotice: "Yesterday",
        thisWeekNotice: "This Week",
        thisMonthNotice: "This Month",
        latestNotice: "Latest Transactions",
        backupRestore: "Backup & Restore",
        backupData: "Backup Data",
        backupNotice: "Download all expense, category, and payment source data.",
        downloadBackup: "Download Backup",
        restoreData: "Restore Data",
        restoreNotice: "Upload a backup file (.json) to restore data.",
        uploadRestore: "Upload Restore",
        quickAddItems: "Quick Add Items",
        quickAddItemsList: "Quick Add Items List",
        noQuickAddItems: "No Quick Add items yet.",
        itemError: "Item name cannot be empty.",
        amountError: "Amount cannot be empty.",
        amountPlaceholder: "Amount (e.g., 15,000)",
        itemPlaceholder: "Item Name*",
        selectCategory: "Select Category",
        selectPaymentSource: "Select Payment Source",
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        expenseDetail: "Expense Detail",
        item: "Item Name",
        amount: "Amount",
        category: "Category",
        paymentSource: "Payment Source",
        date: "Date",
        time: "Input Time",
        noExpenseSelected: "No expense selected.",
        editExpense: "Edit Expense",
        theme: "App Theme",
        accentColor: "Accent Color",
        clearCache: "Clear Cache",
        testNotification: "Test Notification",
        notificationSuccess: "Notification Sent",
        notificationError: "Notification Failed",
        manageCategories: "Manage Categories",
        managePaymentSources: "Manage Payment Sources",
        manageProfile: "Profile Management",
        changePassword: "Change Password",
        forgotPassword: "Forgot Password",
        logout: "Logout",
        manageCategoriesTitle: "Manage Categories",
        manageCategoriesListTitle: "Category List",
        newCategoryNamePlaceholder: "New Category Name",
        listOfCategories: "List of Categories",
        managePaymentSourcesTitle: "Manage Payment Sources",
        newPaymentSourceNamePlaceholder: "New Payment Source Name",
        listOfPaymentSources: "List of Payment Sources",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        home: "Home",
        createNew: "Create New",
        settings: "Settings",
        pressAgainToExit: "Press again to exit.",
        dataOfflineSynced: "Offline data synced!",
        categoryAddedSuccessfully: "Category added successfully!",
        failedToAddCategory: "Failed to add category.",
        categoryDeletedSuccessfully: "Category deleted successfully!",
        failedToDeleteCategory: "Failed to delete category.",
        categoryUpdatedSuccessfully: "Category updated successfully!",
        failedToUpdateCategory: "Failed to update category.",
        confirmDeleteCategory: 'Are you sure you want to delete category "%s"?',
        paymentSourceAddedSuccessfully: "Payment source added successfully!",
        failedToAddPaymentSource: "Failed to add payment source.",
        paymentSourceDeletedSuccessfully: "Payment source deleted successfully!",
        failedToDeletePaymentSource: "Failed to delete payment source.",
        paymentSourceUpdatedSuccessfully: "Payment source updated successfully!",
        failedToUpdatePaymentSource: "Failed to update payment source.",
        confirmDeletePaymentSource: 'Are you sure you want to delete payment source "%s"?',
        quickAddItemDeletedSuccessfully: "Quick Add item deleted successfully!",
        failedToDeleteQuickAddItem: "Failed to delete Quick Add item.",
        confirmDeleteQuickAddItem: "Are you sure you want to delete this Quick Add item?",
        profileManagement: "Profile Management",
        updateProfile: "Update Profile",
        profilePhoto: "Profile Photo",
        profilePhotoPlaceholder: "Profile photo URL (optional)",
        profileUpdatedSuccessfully: "Profile updated successfully!",
        failedToUpdateProfile: "Failed to update profile.",
        passwordChangedSuccessfully: "Password changed successfully!",
        failedToChangePassword: "Failed to change password.",
        forgotPasswordTitle: "Forgot Password",
        forgotPasswordSubtitle: "Enter your email to get reset password link",
        resetPassword: "Reset Password",
        resetPasswordTitle: "Reset Password",
        resetPasswordSubtitle: "Enter your new password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        resetLinkSent: "Reset password link has been sent to your email",
        resetPasswordSuccess: "Password reset successfully!",
        resetPasswordFailed: "Failed to reset password.",
        invalidResetToken: "Invalid or expired reset token",
        yearsAgo: "years ago",
        monthsAgo: "months ago",
        daysAgo: "days ago",
        hoursAgo: "hours ago",
        minutesAgo: "minutes ago",
        justNow: "just now",
        testNotificationTitle: "Test Notification",
        testNotificationBody: "This is a test notification from Expense View.",
        testNotificationSuccess: "Test notification sent successfully!",
        testNotificationError: "Failed to send test notification.",
        browserNotSupportNotification: "This browser does not support notifications.",
        notificationPermissionGranted: "Notification permission granted!",
        notificationPermissionDenied: "Notification permission denied.",
        notificationPermissionNotGranted: "Notification permission not granted.",
        pushNotificationNotSupportedByBrowser: "Push notifications are not supported by this browser.",
        notificationPermissionNotGrantedForPush: "You need to grant notification permission first.",
        pushSubscriptionSuccess: "Push notification subscription successful!",
        pushSubscriptionError: "Failed to subscribe to push notifications.",
        testNotificationSent: "Test notification sent successfully!",
        testNotificationFailed: "Failed to send test notification.",
        monthlySummary: "Monthly Summary",
        browserNotSupportClipboard: "This browser does not support Clipboard API.",
        monthlySummaryCopied: "Monthly summary copied successfully!",
        monthlySummaryCopyFailed: "Failed to copy monthly summary.",
        total: "Total",
        backupDownloaded: "Backup downloaded successfully!",
        backupDownloadedFallback: "Local backup downloaded successfully!",
        restoreProcessing: "Processing...",
        restoreSuccess: "Backup restored successfully!",
        restoreSuccessFallback: "Fallback backup restored successfully!",
        restoreFailed: "Failed to restore backup.",
        editExpenseSuccess: "Expense updated successfully!",
        editExpenseFailed: "Failed to update expense.",
        deleteExpenseSuccess: "Expense deleted successfully!",
        editExpenseFailed: "Failed to delete expense.",
        addExpenseSuccess: "Expense saved successfully",
        addExpenseSuccessOffline: "Expense saved offline, will sync when online.",
        addExpenseFailedOffline: "Failed to add offline expense.",
        clearCacheSuccess: "Cache cleared successfully and page will reload.",
      },
    },
    expenses: [],
    categories: [],
    paymentSources: [],
    quickAddItems: [],
    selectedExpense: null,
    newForm: { date: new Date().toISOString().slice(0, 10) },
    profileForm: { name: '', avatar: '' },
    changePasswordForm: { newPassword: '', confirmPassword: '' },
    forgotPasswordForm: { email: '' },
    newCategoryName: '',
    editingCategory: null,
    newPaymentSourceName: '',
    editingPaymentSource: null,
    newQuickAddItem: { name: '', amount: 0, displayAmount: '', category: '', paymentSource: '' },
    quickAddEditIndex: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    pendingCount: 0,
    pendingExpenses: [],
    restoreFile: null,
    restoreStatus: '',
    itemError: false,
    amountError: false,
    isOnline: navigator.onLine,
    loadingExpenses: false,
    filter: 'all',
  }),
  getters: {
    accentBgClass: (state) => {
      const m = {
        indigo: 'bg-indigo-600',
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        rose: 'bg-rose-600',
        amber: 'bg-amber-600',
      };
      return m[state.tone] || m.indigo;
    },
    accentTextClass: (state) => {
      const m = {
        indigo: 'text-indigo-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        rose: 'text-rose-600',
        amber: 'text-amber-600',
      };
      return m[state.tone] || m.indigo;
    },
    accentRingClass: (state) => {
      const m = {
        indigo: 'focus:ring-indigo-500',
        blue: 'focus:ring-blue-500',
        green: 'focus:ring-green-500',
        rose: 'focus:ring-rose-500',
        amber: 'focus:ring-amber-500',
      };
      return m[state.tone] || m.indigo;
    },
    calendarDays: (state) => {
      const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(state.currentYear, state.currentMonth, 1).getDay();
      const days = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      return days;
    },
    monthName: (state) => {
      const date = new Date(state.currentYear, state.currentMonth);
      return date.toLocaleString(state.currentLang === 'id' ? 'id-ID' : 'en-US', { month: 'long' });
    },
    latestTen: (state) => state.filteredExpenses,
    filteredExpenses: (state) => {
      let filtered = [...state.expenses];
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      switch (state.filter) {
        case 'today':
          filtered = filtered.filter((e) => state.isSameDay(new Date(e.input_date), today));
          break;
        case 'yesterday':
          filtered = filtered.filter((e) => state.isSameDay(new Date(e.input_date), yesterday));
          break;
        case 'this_week':
          filtered = filtered.filter((e) => state.isThisWeek(new Date(e.input_date), today));
          break;
        case 'this_month':
          filtered = filtered.filter((e) => state.isSameMonth(new Date(e.input_date), today));
          break;
        case 'all':
        default:
          break;
      }
      return filtered.sort((a, b) => new Date(b.input_date) - new Date(a.input_date));
    },
    totalToday: (state) => {
      const today = new Date();
      return state.filteredExpenses.filter((e) => state.isSameDay(new Date(e.input_date), today)).reduce((s, e) => s + state.toNumber(e.amount), 0);
    },
    totalMonth: (state) => {
      const ym = new Date().toISOString().slice(0, 7);
      return state.filteredExpenses.filter((e) => (e.input_date || '').slice(0, 7) === ym).reduce((s, e) => s + state.toNumber(e.amount), 0);
    },
    topCategory: (state) => state.topByKey('category'),
    topSource: (state) => state.topByKey('payment_source'),
    topStore: (state) => state.topByKey('store'),
  },
  actions: {
    // Auth actions
    checkAuth() {
      const authStore = useAuthStore();
      authStore.checkAuth();
    },
    // App actions
    toggleDark() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      this.applyTheme(this.darkMode);
    },
    setTone(tone) {
      this.tone = tone;
    },
    setLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem('language', lang);
    },
    applyTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    // Data actions
    async fetchExpenses() {
      this.loadingExpenses = true;
      try {
        this.expenses = await getExpenses();
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        this.loadingExpenses = false;
      }
    },
    async fetchCategories() {
      try {
        const data = await getCategories();
        this.categories = data.map((cat) => cat.name);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchPaymentSources() {
      try {
        const data = await getPaymentSources();
        this.paymentSources = data.map((ps) => ps.name);
      } catch (error) {
        console.error('Error fetching payment sources:', error);
      }
    },
    loadQuickAddItems() {
      getQuickAddItems().then((data) => {
        this.quickAddItems = data;
      }).catch((error) => {
        console.error('Failed to load quick add items:', error);
      });
    },
    // Tambahkan actions lainnya sesuai kebutuhan
    toNumber(v) {
      try {
        return typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, '')) || 0;
      } catch (e) {
        return 0;
      }
    },
    isSameDay(d1, d2) {
      return d1.toDateString() === d2.toDateString();
    },
    isSameMonth(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    },
    isThisWeek(d, now) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return d >= startOfWeek && d <= endOfWeek;
    },
    topByKey(k) {
      const m = {};
      for (const e of this.expenses) {
        const key = e[k];
        if (!key) continue;
        m[key] = (m[key] || 0) + 1;
      }
      let best = '';
      let cnt = 0;
      for (const [key, val] of Object.entries(m)) {
        if (val > cnt) {
          cnt = val;
          best = key;
        }
      }
      return best || '-';
    },
  },
});