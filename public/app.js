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
      return date.toLocaleString("id-ID", { month: "long" });
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
          this.showToast("Tekan sekali lagi untuk keluar.", "info");
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
          this.showToast("Data offline tersinkron!", "success");
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
        this.showToast("Kategori berhasil ditambahkan!", "success");
      } catch (error) {
        console.error("Error adding category:", error);
        this.showToast("Gagal menambahkan kategori.", "error");
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
        this.showToast("Kategori berhasil dihapus!", "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        this.showToast("Gagal menghapus kategori.", "error");
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
          this.showToast("Kategori berhasil diperbarui!", "success");
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
          this.showToast("Kategori berhasil ditambahkan!", "success");
        }
        this.newCategoryName = "";
        this.editingCategory = null;
        await this.fetchCategories();
      } catch (error) {
        console.error("Error saving category:", error);
        this.showToast("Gagal menyimpan kategori.", "error");
      }
    },
    cancelEditCategory() {
      this.editingCategory = null;
      this.newCategoryName = "";
    },
    deleteCategoryConfirm(category) {
      if (
        confirm(`Apakah Anda yakin ingin menghapus kategori "${category}"?`)
      ) {
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
        this.showToast("Sumber dana berhasil ditambahkan!", "success");
      } catch (error) {
        console.error("Error adding payment source:", error);
        this.showToast("Gagal menambahkan sumber dana.", "error");
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
        this.showToast("Sumber dana berhasil dihapus!", "success");
      } catch (error) {
        console.error("Error deleting payment source:", error);
        this.showToast("Gagal menghapus sumber dana.", "error");
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
          this.showToast("Sumber dana berhasil diperbarui!", "success");
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
          this.showToast("Sumber dana berhasil ditambahkan!!", "success");
        }
        this.newPaymentSourceName = "";
        this.editingPaymentSource = null;
        await this.fetchPaymentSources();
      } catch (error) {
        console.error("Error saving payment source:", error);
        this.showToast("Gagal menyimpan sumber dana.", "error");
      }
    },
    cancelEditPaymentSource() {
      this.editingPaymentSource = null;
      this.newPaymentSourceName = "";
    },
    deletePaymentSourceConfirm(source) {
      if (
        confirm(`Apakah Anda yakin ingin menghapus sumber dana "${source}"?`)
      ) {
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
      if (confirm("Apakah Anda yakin ingin menghapus item Quick Add ini?")) {
        this.deleteQuickAddItem(index);
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
        return Math.floor(interval) + " tahun yang lalu";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " bulan yang lalu";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " hari yang lalu";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " jam yang lalu";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " menit yang lalu";
      }
      return "baru saja";
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
    async requestNotificationPermission() {
      if (!("Notification" in window)) {
        this.showToast("Browser ini tidak mendukung notifikasi.", "error");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.showToast("Izin notifikasi diberikan.", "success");
      } else {
        this.showToast("Izin notifikasi ditolak.", "error");
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
            title: "Test Notifikasi",
            body: "Ini adalah notifikasi percobaan dari Expense View.",
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.showToast("Notifikasi percobaan berhasil dikirim!", "success");
      } catch (error) {
        console.error("Error sending test notification:", error);
        this.showToast("Gagal mengirim notifikasi percobaan.", "error");
      }
    },
    toggleDark() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode);
      this.applyTheme(this.darkMode);
    },
    async requestNotificationPermission() {
      if (!("Notification" in window)) {
        this.showToast("Browser ini tidak mendukung notifikasi.", "error");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.showToast("Izin notifikasi diberikan!", "success");
      } else if (permission === "denied") {
        this.showToast("Izin notifikasi ditolak.", "error");
      } else {
        this.showToast("Izin notifikasi tidak diberikan.", "info");
      }
    },
    async subscribeToPushNotifications() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        this.showToast(
          "Push notifikasi tidak didukung oleh browser ini.",
          "error"
        );
        return;
      }

      if (Notification.permission !== "granted") {
        this.showToast(
          "Anda perlu memberikan izin notifikasi terlebih dahulu.",
          "info"
        );
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
        this.showToast("Berhasil berlangganan notifikasi push!", "success");
      } catch (error) {
        console.error("Gagal berlangganan notifikasi push:", error);
        this.showToast("Gagal berlangganan notifikasi push.", "error");
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
        this.showToast("Browser Anda tidak mendukung Clipboard API.", "error");
        return;
      }

      const ym = new Date().toISOString().slice(0, 7);
      const monthlyExpenses = this.expenses.filter(
        (e) => (e.input_date || "").slice(0, 7) === ym
      );

      let summaryText = `Ringkasan Pengeluaran Bulan Ini (${
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

      summaryText += `\nTotal: Rp ${this.formatNumber(total)}`;

      try {
        await navigator.clipboard.writeText(summaryText);
        this.showToast("Ringkasan bulan ini berhasil disalin!", "success");
      } catch (err) {
        console.error("Gagal menyalin ringkasan: ", err);
        this.showToast("Gagal menyalin ringkasan.", "error");
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
        this.showToast("Backup berhasil diunduh!", "success");
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
        this.showToast("Backup lokal berhasil diunduh!", "success");
      }
    },
    handleRestoreFile(ev) {
      const f = ev.target.files && ev.target.files[0];
      this.restoreFile = f || null;
      this.restoreStatus = this.restoreFile ? this.restoreFile.name : "";
    },
    async restoreData() {
      if (!this.restoreFile) return;
      this.restoreStatus = "Memproses...";
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
        this.showToast("Restore berhasil!", "success");
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
          this.restoreStatus = `Selesai: ${cnt} pengeluaran (fallback).`;
          await this.fetchExpenses();
          await this.fetchCategories();
          await this.fetchPaymentSources();
          this.showToast("Restore fallback berhasil!", "success");
        } catch (err) {
          this.restoreStatus = "Gagal memulihkan data";
          this.showToast("Restore gagal.", "error");
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
        this.showToast("Pengeluaran berhasil diperbarui!", "success");
        this.haptic("success");
      } catch (error) {
        console.error("Error updating expense:", error);
        this.showToast("Gagal memperbarui pengeluaran.", "error");
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
        this.showToast("Pengeluaran berhasil dihapus!", "success");
        this.haptic("success");
        this.changeTab("home", false);
      } catch (error) {
        console.error("Error deleting expense:", error);
        this.showToast("Gagal menghapus pengeluaran.", "error");
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
        this.showToast(
          "Pengeluaran disimpan offline, akan tersinkron.",
          "success"
        );
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
        this.showToast("Pengeluaran berhasil ditambahkan!", "success");
        this.haptic("success");
        this.resetNewForm();
      } catch (error) {
        console.error("Error adding expense:", error);
        try {
          await this.addPendingExpense(this.newForm);
          this.showToast(
            "Pengeluaran disimpan offline, akan tersinkron.",
            "success"
          );
          await this.triggerSync();
          this.resetNewForm();
          await this.getPendingExpenses();
        } catch (e) {
          this.showToast("Gagal menambahkan pengeluaran.", "error");
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

      this.showToast(
        `Cache berhasil dihapus dan halaman akan dimuat ulang. (${count})`
      );
      setTimeout(() => {
        window.location.reload(true);
      }, count * 1000);
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
