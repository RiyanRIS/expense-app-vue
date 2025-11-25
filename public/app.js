const { createApp } = Vue;
createApp({
  data() {
    return {
      currentTab: "home",
      darkMode: null,
      tone: "indigo",
      user: {
        name: "User Demo",
        level: "Standard",
        photo: "https://i.pravatar.cc/100?img=5",
      },
      expenses: [],
      selectedExpense: null,
      newForm: {
        date: new Date().toISOString().slice(0, 10),
      },
      categories: [], // Add categories array
      paymentSources: [], // Add paymentSources array
      newCategoryName: "", // Add newCategoryName for category input
      editingCategory: null,
      newPaymentSourceName: "", // Add newPaymentSourceName for payment source input
      editingPaymentSource: null,
      quickAddItems: [],
      newQuickAddItem: {
        name: "",
        amount: 0,
        displayAmount: "",
        category: "",
        paymentSource: "",
      },
      quickAddEditIndex: null,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      backPressCount: 0,
      pendingCount: 0,
      pendingExpenses: [],
      restoreFile: null,
      restoreStatus: "",
      itemError: false,
      amountError: false,
      isOnline: true,
      loadingExpenses: false,
      filter: "all", // Add filter data property
      currentLang: localStorage.getItem("language") || "id",
      translations: {
        id: {
          offlineSyncNotice:
            "Mode offline, data akan disinkronkan saat online.",
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
          backupNotice:
            "Unduh semua data pengeluaran, kategori, dan sumber dana.",
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
          confirmDeleteCategory:
            'Apakah Anda yakin ingin menghapus kategori "%s"?',

          paymentSourceAddedSuccessfully: "Sumber dana berhasil ditambahkan!",
          failedToAddPaymentSource: "Gagal menambahkan sumber dana.",
          paymentSourceDeletedSuccessfully: "Sumber dana berhasil dihapus!",
          failedToDeletePaymentSource: "Gagal menghapus sumber dana.",
          paymentSourceUpdatedSuccessfully: "Sumber dana berhasil diperbarui!",
          failedToUpdatePaymentSource: "Gagal memperbarui sumber dana.",
          confirmDeletePaymentSource:
            'Apakah Anda yakin ingin menghapus sumber dana "%s"?',

          quickAddItemDeletedSuccessfully: "Item Quick Add berhasil dihapus!",
          failedToDeleteQuickAddItem: "Gagal menghapus item Quick Add.",
          confirmDeleteQuickAddItem:
            "Apakah Anda yakin ingin menghapus item Quick Add ini?",

          yearsAgo: "tahun lalu",
          monthsAgo: "bulan lalu",
          daysAgo: "hari lalu",
          hoursAgo: "jam lalu",
          minutesAgo: "menit lalu",
          justNow: "baru saja",

          testNotificationTitle: "Test Notifikasi",
          testNotificationBody:
            "Ini adalah notifikasi percobaan dari Expense View.",
          testNotificationSuccess: "Notifikasi berhasil dikirim!",
          testNotificationError: "Gagal mengirim notifikasi.",

          browserNotSupportNotification:
            "Browser ini tidak mendukung notifikasi.",
          notificationPermissionGranted: "Izin notifikasi diberikan!",
          notificationPermissionDenied: "Izin notifikasi ditolak.",
          notificationPermissionNotGranted: "Izin notifikasi tidak diberikan.",
          pushNotificationNotSupportedByBrowser:
            "Push notifikasi tidak didukung oleh browser ini.",
          notificationPermissionNotGrantedForPush:
            "Anda perlu memberikan izin notifikasi terlebih dahulu.",
          pushSubscriptionSuccess: "Berlangganan push notifikasi berhasil!",
          pushSubscriptionError: "Gagal berlangganan push notifikasi.",
          testNotificationSent: "Notifikasi uji coba berhasil dikirim!",
          testNotificationFailed: "Gagal mengirim notifikasi uji coba.",

          monthlySummary: "Monthly Summary",
          browserNotSupportClipboard:
            "Browser ini tidak mendukung Clipboard API.",
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
          addExpenseSuccessOffline:
            "Pengeluaran berhasil disimpan offline, akan tersinkron.",
          addExpenseFailedOffline: "Gagal menambahkan pengeluaran offline.",
          clearCacheSuccess:
            "Cache berhasil dihapus dan halaman akan dimuat ulang.",
        },
        en: {
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
          backupNotice:
            "Download all expense, category, and payment source data.",
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
          confirmDeleteCategory:
            'Are you sure you want to delete the category "%s"?',

          paymentSourceAddedSuccessfully: "Payment source added successfully!",
          failedToAddPaymentSource: "Failed to add payment source.",
          paymentSourceDeletedSuccessfully:
            "Payment source deleted successfully!",
          failedToDeletePaymentSource: "Failed to delete payment source.",
          paymentSourceUpdatedSuccessfully:
            "Payment source updated successfully!",
          failedToUpdatePaymentSource: "Failed to update payment source.",
          confirmDeletePaymentSource:
            'Are you sure you want to delete the payment source "%s"?',

          quickAddItemDeletedSuccessfully:
            "Quick Add item deleted successfully!",
          failedToDeleteQuickAddItem: "Failed to delete Quick Add item.",
          confirmDeleteQuickAddItem:
            "Are you sure you want to delete this Quick Add item?",

          yearsAgo: "years ago",
          monthsAgo: "months ago",
          daysAgo: "days ago",
          hoursAgo: "hours ago",
          minutesAgo: "minutes ago",
          justNow: "just now",

          testNotificationTitle: "Test Notification",
          testNotificationBody:
            "This is a test notification from Expense View.",
          testNotificationSuccess: "Test notification sent!",
          testNotificationError: "Failed to send test notification.",

          browserNotSupportNotification:
            "This browser does not support notifications.",
          notificationPermissionGranted: "Notification permission granted!",
          notificationPermissionDenied: "Notification permission denied.",
          notificationPermissionNotGranted:
            "Notification permission not granted.",
          pushNotificationNotSupportedByBrowser:
            "Push notifications are not supported by this browser.",
          notificationPermissionNotGrantedForPush:
            "You need to grant notification permission first.",
          pushSubscriptionSuccess: "Push notification subscription successful!",
          pushSubscriptionError: "Failed to subscribe to push notifications.",
          testNotificationSent: "Test notification sent successfully!",
          testNotificationFailed: "Failed to send test notification.",

          monthlySummary: "Monthly Summary",
          browserNotSupportClipboard:
            "This browser does not support the Clipboard API.",
          monthlySummaryCopied: "This month's summary copied!",
          monthlySummaryCopyFailed: "Failed to copy summary.",
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
          deleteExpenseFailed: "Failed to delete expense.",

          addExpenseSuccess: "Expense saved successfully",
          addExpenseSuccessOffline: "Expense saved offline, will sync later.",
          addExpenseFailedOffline: "Failed to add offline expense.",
          clearCacheSuccess: "Cache cleared and page will reload.",
        },
      },
      vapidPublicKey:
        "BIt2q9mIdxGqhVYsISG4JrKNl8gmfUUfMY49csaHSm0KM2ItJdqlVEQkFk_k6S_EtFoOudeE0GuwaYvqODZlpaI",
      pushSubscription: null,
    };
  },
  computed: {
    accentBgClass() {
      const m = {
        indigo: "bg-indigo-600",
        blue: "bg-blue-600",
        green: "bg-green-600",
        rose: "bg-rose-600",
        amber: "bg-amber-600",
      };
      return m[this.tone] || m.indigo;
    },
    accentTextClass() {
      const m = {
        indigo: "text-indigo-600",
        blue: "text-blue-600",
        green: "text-green-600",
        rose: "text-rose-600",
        amber: "text-amber-600",
      };
      return m[this.tone] || m.indigo;
    },
    calendarDays() {
      const daysInMonth = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0
      ).getDate();
      const firstDayOfMonth = new Date(
        this.currentYear,
        this.currentMonth,
        1
      ).getDay();
      const days = [];

      // Add empty slots for days before the 1st of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }

      // Add actual days
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      return days;
    },
    monthName() {
      const date = new Date(this.currentYear, this.currentMonth);
      return date.toLocaleString(
        this.currentLang === "id" ? "id-ID" : "en-US",
        { month: "long" }
      );
    },
    latestTen() {
      return this.filteredExpenses;
    },
    filteredExpenses() {
      let filtered = [...this.expenses];
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      switch (this.filter) {
        case "today":
          filtered = filtered.filter((e) =>
            this.isSameDay(new Date(e.input_date), today)
          );
          break;
        case "yesterday":
          filtered = filtered.filter((e) =>
            this.isSameDay(new Date(e.input_date), yesterday)
          );
          break;
        case "this_week":
          filtered = filtered.filter((e) =>
            this.isThisWeek(new Date(e.input_date), today)
          );
          break;
        case "this_month":
          filtered = filtered.filter((e) =>
            this.isSameMonth(new Date(e.input_date), today)
          );
          break;
        case "all":
        default:
          // No filter, return all expenses
          break;
      }
      return filtered.sort(
        (a, b) => new Date(b.input_date) - new Date(a.input_date)
      );
    },
    totalToday() {
      const today = new Date();
      return this.filteredExpenses
        .filter((e) => this.isSameDay(new Date(e.input_date), today))
        .reduce((s, e) => s + this.toNumber(e.amount), 0);
    },
    totalMonth() {
      const ym = new Date().toISOString().slice(0, 7);
      return this.filteredExpenses
        .filter((e) => (e.input_date || "").slice(0, 7) === ym)
        .reduce((s, e) => s + this.toNumber(e.amount), 0);
    },
    topCategory() {
      return this.topByKey("category");
    },
    topSource() {
      return this.topByKey("payment_source");
    },
    topStore() {
      return this.topByKey("store");
    },
  },
  mounted() {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      this.darkMode = savedTheme === "true";
    } else {
      this.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    this.applyTheme(this.darkMode);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (localStorage.getItem("darkMode") === null) {
          this.darkMode = e.matches;
          this.applyTheme(this.darkMode);
        }
      });
    this.isOnline = navigator.onLine;
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.triggerSync();
      this.getPendingExpenses();
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
    setInterval(() => {
      this.fetchExpenses();
    }, 10000);
    this.fetchExpenses();
    this.fetchCategories();
    this.fetchPaymentSources();
    this.loadQuickAddItems();
    this.changeTab(this.currentTab);
    this.getPendingExpenses();
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("ServiceWorker registered: ", registration);
          })
          .catch((error) => {
            console.error("ServiceWorker registration failed: ", error);
          });
        this.requestNotificationPermission();
        this.subscribeToPushNotifications();
      });
    }
    window.addEventListener("popstate", (event) => {
      if (this.currentTab === "detail") {
        this.changeTab("home");
      } else if (this.currentTab === "edit") {
        this.changeTab("detail");
      } else if (
        this.currentTab === "category" ||
        this.currentTab === "payment-source"
      ) {
        this.changeTab("settings");
      } else if (
        this.currentTab === "home" ||
        this.currentTab === "create" ||
        this.currentTab === "settings"
      ) {
        this.backPressCount++;
        if (this.backPressCount === 1) {
          this.showToast(this.t("pressAgainToExit"), "info");
          setTimeout(() => {
            this.backPressCount = 0;
          }, 2000);
        } else if (this.backPressCount === 2) {
          window.history.back();
        }
      } else {
        this.changeTab("home");
      }
    });
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "expenses-synced") {
          this.fetchExpenses();
          this.showToast(this.t("dataOfflineSynced"), "success");
          this.getPendingExpenses();
        }
      });
    }
  },
  methods: {
    openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("expense_view_db", 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains("pending-expenses")) {
            db.createObjectStore("pending-expenses", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },
    async addPendingExpense(data) {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("pending-expenses", "readwrite");
        const store = tx.objectStore("pending-expenses");
        const toSave = { ...data, _local: true, createdAt: Date.now() };
        const req = store.add(toSave);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    },
    async getPendingExpenses() {
      try {
        const db = await this.openDB();
        const items = await new Promise((resolve, reject) => {
          const tx = db.transaction("pending-expenses", "readonly");
          const store = tx.objectStore("pending-expenses");
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
        this.pendingExpenses = items;
        this.pendingCount = items.length;
      } catch (e) {
        this.pendingExpenses = [];
        this.pendingCount = 0;
      }
    },
    async triggerSync() {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if ("sync" in reg) {
          try {
            await reg.sync.register("sync-expenses");
          } catch (e) {}
        } else if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "sync-expenses",
          });
        }
      }
    },
    async fetchExpenses() {
      this.loadingExpenses = true;
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.expenses = data;
      } catch (error) {
        console.error("Error fetching expenses:", error);
        this.haptic("error");
      } finally {
        this.loadingExpenses = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.categories = data.map((cat) => cat.name);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async fetchPaymentSources() {
      try {
        const response = await fetch("/api/payment-sources");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.paymentSources = data.map((ps) => ps.name);
      } catch (error) {
        console.error("Error fetching payment sources:", error);
      }
    },
    async addCategory() {
      try {
        if (!this.newCategoryName) return;
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: this.newCategoryName }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.newCategoryName = "";
        await this.fetchCategories();
        this.showToast(this.t("categoryAddedSuccessfully"), "success");
      } catch (error) {
        console.error("Error adding category:", error);
        this.showToast(this.t("failedToAddCategory"), "error");
      }
    },
    async deleteCategory(categoryName) {
      try {
        const response = await fetch(`/api/categories/${categoryName}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchCategories();
        this.showToast(this.t("categoryDeletedSuccessfully"), "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        this.showToast(this.t("failedToDeleteCategory"), "error");
      }
    },
    editCategory(category) {
      this.editingCategory = category;
      this.newCategoryName = category;
    },
    async saveCategory() {
      try {
        if (!this.newCategoryName) return;
        if (this.editingCategory) {
          // Update existing category
          const response = await fetch(
            `/api/categories/${this.editingCategory}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ newName: this.newCategoryName }),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.showToast(this.t("categoryUpdatedSuccessfully"), "success");
        } else {
          // Add new category
          const response = await fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: this.newCategoryName }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.showToast(this.t("categoryAddedSuccessfully"), "success");
        }
        this.newCategoryName = "";
        this.editingCategory = null;
        await this.fetchCategories();
      } catch (error) {
        console.error("Error saving category:", error);
        this.showToast(this.t("failedToSaveCategory"), "error");
      }
    },
    cancelEditCategory() {
      this.editingCategory = null;
      this.newCategoryName = "";
    },
    deleteCategoryConfirm(category) {
      if (confirm(this.t("confirmDeleteCategory", category))) {
        this.deleteCategory(category);
      }
    },
    async addPaymentSource() {
      try {
        if (!this.newPaymentSourceName) return;
        const response = await fetch("/api/payment-sources", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: this.newPaymentSourceName }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.newPaymentSourceName = "";
        await this.fetchPaymentSources();
        this.showToast(this.t("paymentSourceAddedSuccessfully"), "success");
      } catch (error) {
        console.error("Error adding payment source:", error);
        this.showToast(this.t("failedToAddPaymentSource"), "error");
      }
    },
    async deletePaymentSource(sourceName) {
      try {
        const response = await fetch(`/api/payment-sources/${sourceName}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchPaymentSources();
        this.showToast(this.t("paymentSourceDeletedSuccessfully"), "success");
      } catch (error) {
        console.error("Error deleting payment source:", error);
        this.showToast(this.t("failedToDeletePaymentSource"), "error");
      }
    },
    editPaymentSource(source) {
      this.editingPaymentSource = source;
      this.newPaymentSourceName = source;
    },
    async savePaymentSource() {
      try {
        if (!this.newPaymentSourceName) return;
        if (this.editingPaymentSource) {
          // Update existing payment source
          const response = await fetch(
            `/api/payment-sources/${this.editingPaymentSource}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ newName: this.newPaymentSourceName }),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.showToast(this.t("paymentSourceUpdatedSuccessfully"), "success");
        } else {
          // Add new payment source
          const response = await fetch("/api/payment-sources", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: this.newPaymentSourceName }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.showToast(this.t("paymentSourceAddedSuccessfully"), "success");
        }
        this.newPaymentSourceName = "";
        this.editingPaymentSource = null;
        await this.fetchPaymentSources();
      } catch (error) {
        console.error("Error saving payment source:", error);
        this.showToast(this.t("failedToSavePaymentSource"), "error");
      }
    },
    cancelEditPaymentSource() {
      this.editingPaymentSource = null;
      this.newPaymentSourceName = "";
    },
    deletePaymentSourceConfirm(source) {
      if (confirm(this.t("confirmDeletePaymentSource", source))) {
        this.deletePaymentSource(source);
      }
    },
    loadQuickAddItems() {
      const items = localStorage.getItem("quickAddItems");
      this.quickAddItems = items ? JSON.parse(items) : [];
    },
    saveQuickAddItems() {
      localStorage.setItem("quickAddItems", JSON.stringify(this.quickAddItems));
    },
    addQuickAddItem(item) {
      this.quickAddItems.push(item);
      this.saveQuickAddItems();
    },
    editQuickAddItem(index, updatedItem) {
      this.quickAddItems.splice(index, 1, updatedItem);
      this.saveQuickAddItems();
    },
    deleteQuickAddItem(index) {
      this.quickAddItems.splice(index, 1);
      this.saveQuickAddItems();
    },
    saveQuickAddItem() {
      if (this.quickAddEditIndex !== null) {
        this.editQuickAddItem(this.quickAddEditIndex, {
          ...this.newQuickAddItem,
        });
      } else {
        this.addQuickAddItem({
          ...this.newQuickAddItem,
        });
      }
      this.resetQuickAddItemForm();
    },
    editQuickAddItemForm(index) {
      const itemToEdit = this.quickAddItems[index];
      this.newQuickAddItem = {
        ...itemToEdit,
        displayAmount: this.formatNumber(itemToEdit.amount),
      };
      this.quickAddEditIndex = index;
    },
    deleteQuickAddItemConfirm(index) {
      if (confirm(this.t("confirmDeleteQuickAddItem"))) {
        this.deleteQuickAddItem(index);
        this.showToast(this.t("quickAddItemDeletedSuccessfully"), "success");
      }
    },
    cancelEditQuickAddItem() {
      this.resetQuickAddItemForm();
    },
    resetQuickAddItemForm() {
      this.newQuickAddItem = {
        name: "",
        amount: 0,
        displayAmount: "",
        category: "",
        paymentSource: "",
      };
      this.quickAddEditIndex = null;
    },
    handleQuickAddAmountInput(event) {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, "");
      value = value.replace(/^0+/, "");
      const numericValue = parseFloat(value) || 0;
      this.newQuickAddItem.amount = numericValue;
      this.newQuickAddItem.displayAmount = this.formatNumber(numericValue);
    },
    applyQuickAddItem(item) {
      this.newForm.item = item.name;
      this.newForm.amount = item.amount;
      this.newForm.displayAmount = this.formatNumber(item.amount);
      this.newForm.category = item.category;
      this.newForm.payment_source = item.paymentSource;
      // Optionally, scroll to the top of the form or focus on an input
    },
    toNumber(v) {
      try {
        return typeof v === "number"
          ? v
          : parseFloat(String(v).replace(/[^0-9.-]/g, "")) || 0;
      } catch (e) {
        return 0;
      }
    },
    formatNumber(n) {
      return (n || 0).toLocaleString("id-ID");
    },
    timeAgo(dateString, timeString) {
      if (!dateString) return "";
      const dateTimeString = `${dateString} ${timeString || "00:00:00"}`;
      const date = new Date(dateTimeString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      let interval = seconds / 31536000;
      if (interval > 1) {
        return Math.floor(interval) + " " + this.t("yearsAgo");
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " " + this.t("monthsAgo");
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " " + this.t("daysAgo");
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " " + this.t("hoursAgo");
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " " + this.t("minutesAgo");
      }
      return this.t("justNow");
    },
    applyTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    haptic(type) {
      if (!navigator.vibrate) return;
      if (type === "success") {
        navigator.vibrate(30);
      } else if (type === "error") {
        navigator.vibrate([60, 30, 60]);
      } else {
        navigator.vibrate(20);
      }
    },
    async testNotification() {
      try {
        const response = await fetch("/api/push-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: this.t("testNotificationTitle"),
            body: this.t("testNotificationBody"),
            subscription: this.pushSubscription,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.showToast(this.t("testNotificationSuccess"), "success");
      } catch (error) {
        console.error("Error sending test notification:", error);
        this.showToast(this.t("testNotificationError"), "error");
      }
    },
    toggleDark() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode);
      this.applyTheme(this.darkMode);
    },
    async requestNotificationPermission() {
      if (!("Notification" in window)) {
        this.showToast(this.t("browserNotSupportNotification"), "error");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.showToast(this.t("notificationPermissionGranted"), "success");
      } else if (permission === "denied") {
        this.showToast(this.t("notificationPermissionDenied"), "error");
      } else {
        this.showToast(this.t("notificationPermissionNotGranted"), "info");
      }
    },
    async subscribeToPushNotifications() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        this.showToast(
          this.t("pushNotificationNotSupportedByBrowser"),
          "error"
        );
        return;
      }

      if (Notification.permission !== "granted") {
        this.showToast(this.t("notificationPermissionNotGranted"), "info");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription =
          await registration.pushManager.getSubscription();

        if (existingSubscription) {
          this.pushSubscription = existingSubscription;
          return;
        }

        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        };

        const subscription = await registration.pushManager.subscribe(
          subscribeOptions
        );
        console.log("User is subscribed:", subscription);

        // Send subscription to your backend
        await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        this.pushSubscription = subscription;
        this.showToast(this.t("pushSubscriptionSuccess"), "success");
      } catch (error) {
        console.error("Gagal berlangganan notifikasi push:", error);
        this.showToast(this.t("pushSubscriptionError"), "error");
      }
    },
    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    manualRefresh() {
      this.fetchExpenses();
      this.haptic("tap");
    },
    setFilter(newFilter) {
      this.filter = newFilter;
      this.haptic("tap");
    },
    isSameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },
    isSameMonth(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
      );
    },
    isThisWeek(d, now) {
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay())
      ); // Sunday
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      return d >= firstDayOfWeek && d <= lastDayOfWeek;
    },
    async copyMonthlySummary() {
      if (!navigator.clipboard) {
        this.showToast(this.t("browserNotSupportClipboard"), "error");
        return;
      }

      const ym = new Date().toISOString().slice(0, 7);
      const monthlyExpenses = this.expenses.filter(
        (e) => (e.input_date || "").slice(0, 7) === ym
      );

      let summaryText = `${this.t("monthlySummary")} (${
        this.monthName
      } ${new Date().getFullYear()}):`;
      let total = 0;

      // Group by category
      const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
        acc[expense.category] =
          (acc[expense.category] || 0) + this.toNumber(expense.amount);
        return acc;
      }, {});

      for (const category in expensesByCategory) {
        summaryText += `- ${category}: Rp ${this.formatNumber(
          expensesByCategory[category]
        )}\n`;
        total += expensesByCategory[category];
      }

      summaryText += `\n${this.t("total")}: Rp ${this.formatNumber(total)}`;

      try {
        await navigator.clipboard.writeText(summaryText);
        this.showToast(this.t("monthlySummaryCopied"), "success");
      } catch (err) {
        console.error("Gagal menyalin ringkasan: ", err);
        this.showToast(this.t("monthlySummaryCopyFailed"), "error");
      }
    },
    async downloadBackup() {
      try {
        const res = await fetch("/api/backup");
        if (!res.ok) throw new Error("backup api unavailable");
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
        a.download = `backup-expense-view-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.showToast(this.t("backupDownloaded"), "success");
      } catch (e) {
        const fallback = {
          expenses: this.expenses,
          categories: this.categories,
          paymentSources: this.paymentSources,
        };
        const blob = new Blob([JSON.stringify(fallback)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
        a.download = `backup-expense-view-local-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.showToast(this.t("backupDownloadedFallback"), "success");
      }
    },
    handleRestoreFile(ev) {
      const f = ev.target.files && ev.target.files[0];
      this.restoreFile = f || null;
      this.restoreStatus = this.restoreFile ? this.restoreFile.name : "";
    },
    async restoreData() {
      if (!this.restoreFile) return;
      this.restoreStatus = this.t("restoreProcessing");
      try {
        const text = await this.restoreFile.text();
        const payload = JSON.parse(text);
        const res = await fetch("/api/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("restore api unavailable");
        const out = await res.json();
        this.restoreStatus = `Selesai: ${
          out.expensesInserted || 0
        } pengeluaran, ${out.categoriesUpserted || 0} kategori, ${
          out.paymentSourcesUpserted || 0
        } sumber dana.`;
        await this.fetchExpenses();
        await this.fetchCategories();
        await this.fetchPaymentSources();
        this.showToast(this.t("restoreSuccess"), "success");
      } catch (e) {
        try {
          const text = await this.restoreFile.text();
          const data = JSON.parse(text);
          const cats = Array.isArray(data.categories) ? data.categories : [];
          const srcs = Array.isArray(data.paymentSources)
            ? data.paymentSources
            : [];
          for (const name of cats) {
            await fetch("/api/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
          }
          for (const name of srcs) {
            await fetch("/api/payment-sources", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
          }
          const exps = Array.isArray(data.expenses) ? data.expenses : [];
          let cnt = 0;
          for (const exp of exps) {
            await fetch("/api/expenses", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(exp),
            });
            cnt++;
          }
          this.restoreStatus = this.t("restoreSuccessFallback", { cnt });
          await this.fetchExpenses();
          await this.fetchCategories();
          await this.fetchPaymentSources();
          this.showToast(this.t("restoreSuccessFallback"), "success");
        } catch (err) {
          this.restoreStatus = this.t("restoreFailed");
          this.showToast(this.t("restoreFailed"), "error");
        }
      }
      this.restoreFile = null;
    },
    changeTab(tabName, pushState = true) {
      this.currentTab = tabName;
      if (pushState) {
        history.pushState({ tab: tabName }, "", `#${tabName}`);
      }
      this.haptic("tap");
    },
    async showDetail(expenseId) {
      try {
        const response = await fetch(`/api/expenses/${expenseId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.selectedExpense = data;
        this.changeTab("detail");
      } catch (error) {
        console.error("Error fetching expense detail:", error);
      }
    },
    editExpense(expense) {
      this.selectedExpense.displayAmount = this.formatNumber(
        this.toNumber(this.selectedExpense.amount)
      );
      this.changeTab("edit");
    },
    async submitEdit() {
      try {
        const response = await fetch(
          `/api/expenses/${this.selectedExpense._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.selectedExpense),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.showDetail(this.selectedExpense._id);
        this.showToast(this.t("editExpenseSuccess"), "success");
        this.haptic("success");
      } catch (error) {
        console.error("Error updating expense:", error);
        this.showToast(this.t("editExpenseFailed"), "error");
        this.haptic("error");
      }
    },
    async deleteExpense(expenseId) {
      try {
        const response = await fetch(`/api/expenses/${expenseId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.showToast(this.t("deleteExpenseSuccess"), "success");
        this.haptic("success");
        this.changeTab("home", false);
      } catch (error) {
        console.error("Error deleting expense:", error);
        this.showToast(this.t("deleteExpenseFailed"), "error");
        this.haptic("error");
      }
    },
    topByKey(k) {
      const m = {};
      for (const e of this.expenses) {
        const key = e[k];
        if (!key) continue;
        m[key] = (m[key] || 0) + 1;
      }
      let best = "",
        cnt = 0;
      for (const [key, val] of Object.entries(m)) {
        if (val > cnt) {
          cnt = val;
          best = key;
        }
      }
      return best || "-";
    },
    async submitNew() {
      this.itemError = false;
      this.amountError = false;
      let hasError = false;

      if (!this.newForm.item) {
        this.itemError = true;
        hasError = true;
      }
      if (!this.newForm.amount) {
        this.amountError = true;
        hasError = true;
      }
      if (hasError) {
        return;
      }

      if (!navigator.onLine) {
        await this.addPendingExpense(this.newForm);
        this.showToast(this.t("addExpenseSuccessOffline"), "success");
        await this.triggerSync();
        this.resetNewForm();
        await this.getPendingExpenses();
        return;
      }
      try {
        const response = await fetch(`/api/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newForm),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.showToast(this.t("addExpenseSuccess"), "success");
        this.haptic("success");
        this.resetNewForm();
      } catch (error) {
        console.error("Error adding expense:", error);
        try {
          await this.addPendingExpense(this.newForm);
          this.showToast(this.t("addExpenseSuccessOffline"), "success");
          await this.triggerSync();
          this.resetNewForm();
          await this.getPendingExpenses();
        } catch (e) {
          this.showToast(this.t("addExpenseFailedOffline"), "error");
          this.haptic("error");
        }
      }
    },
    action(t) {
      if (t === "logout") {
        this.user = { ...this.user };
        this.changeTab("settings");
      } else if (t === "kategori") {
        this.changeTab("category");
      } else if (t === "sumber-dana") {
        this.changeTab("payment-source");
      }
    },
    resetNewForm() {
      this.newForm.store = "";
      this.newForm.item = "";
      this.newForm.amount = "";
      this.newForm.displayAmount = "";
      this.newForm.category = "";
      this.newForm.payment_source = "";
      this.itemError = false;
      this.amountError = false;
    },
    selectDay(day) {
      if (day) {
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.newForm.date = selectedDate.toISOString().slice(0, 10);
      }
    },
    selectDayEdit(day) {
      if (day) {
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.selectedExpense.date = selectedDate.toISOString().slice(0, 10);
      }
    },
    handleAmountInput(event) {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, "");
      value = value.replace(/^0+/, "");
      const numericValue = parseFloat(value) || 0;
      this.newForm.amount = numericValue;
      this.newForm.displayAmount = this.formatNumber(numericValue);
    },
    handleEditAmountInput(event) {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, "");
      value = value.replace(/^0+/, "");
      const numericValue = parseFloat(value) || 0;
      this.selectedExpense.amount = numericValue;
      this.selectedExpense.displayAmount = this.formatNumber(numericValue);
    },
    showToast(message, type = "info") {
      const toastContainer =
        document.getElementById("toast-container") ||
        (() => {
          const div = document.createElement("div");
          div.id = "toast-container";
          Object.assign(div.style, {
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000",
            display: "flex",
            flexDirection: "column-reverse",
            gap: "10px",
            pointerEvents: "none",
            width: "max-content",
            maxWidth: "90%",
          });
          document.body.appendChild(div);
          return div;
        })();

      const toast = document.createElement("div");
      Object.assign(toast.style, {
        backgroundColor:
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#F44336"
            : "#2196F3",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        opacity: "0",
        transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
        transform: "translateY(20px)",
        pointerEvents: "auto",
      });
      toast.textContent = message;

      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      }, 10);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.addEventListener("transitionend", () => toast.remove());
      }, 3500);
    },
    async clearCacheAndReload() {
      let count = 0;
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        console.log("All caches cleared.");
        count += 1;
      }

      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister())
        );
        console.log("All service workers unregistered.");
        count += 2;
      }

      this.showToast(this.t("clearCacheSuccess"), "success");
      setTimeout(() => {
        window.location.reload(true);
      }, count * 1000);
    },
    setLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem("language", lang);
    },
    t(key, ...replacements) {
      let translation = (this.translations[this.currentLang] || {})[key];
      if (translation === undefined) return key;
      replacements.forEach((rep) => {
        const k = Object.keys(rep)[0];
        const v = rep[k];
        translation = translation.replace(
          new RegExp(`\\{\\{${k}\\}\\}`, "g"),
          v
        );
      });
      return translation;
    },
  },
  watch: {
    currentMonth(newMonth, oldMonth) {
      if (newMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else if (newMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
    },
  },
}).mount("#app");
