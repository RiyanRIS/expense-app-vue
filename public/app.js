const { createApp } = Vue;
createApp({
  data() {
    return {
      currentTab: "home",
      darkMode: false,
      tone: "indigo",
      user: {
        name: "User Demo",
        level: "Standard",
        photo: "https://i.pravatar.cc/100?img=5",
      },
      expenses: [],
      refreshTick: 0,
      selectedExpense: null,
      editedExpense: null,
      newForm: {
        date: new Date().toISOString().slice(0, 10),
        store: "",
        item: "",
        amount: "",
        displayAmount: "",
        category: "",
        payment_source: "",
      },
      categories: [], // Add categories array
      paymentSources: [], // Add paymentSources array
      newCategoryName: "", // Add newCategoryName for category input
      newPaymentSourceName: "", // Add newPaymentSourceName for payment source input
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      itemError: false,
      amountError: false,
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
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
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
      return date.toLocaleString('id-ID', { month: 'long' });
    },
    latestTen() {
      const arr = [...this.expenses];
      return arr;
    },
    totalToday() {
      const today = new Date().toISOString().slice(0, 10);
      return this.expenses
        .filter((e) => e.input_date === today)
        .reduce((s, e) => s + this.toNumber(e.amount), 0);
    },
    totalMonth() {
      const ym = new Date().toISOString().slice(0, 7);
      return this.expenses
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
  methods: {
    async fetchExpenses() {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.expenses = data;
      } catch (error) {
        console.error("Error fetching expenses:", error);
        this.showToast("Gagal mengambil pengeluaran.", "error");
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
    toggleDark() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode);
      if (this.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    manualRefresh() {
      this.fetchExpenses();
      this.showToast("Pengeluaran berhasil diambil!", "success");
    },
    changeTab(tabName, pushState = true) {
      this.currentTab = tabName;
      if (pushState) {
        history.pushState({ tab: tabName }, "", `#${tabName}`);
      }
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
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
      this.editedExpense = { ...expense };
      this.changeTab("edit");
    },
    async submitEdit() {
      try {
        const response = await fetch(
          `/api/expenses/${this.editedExpense._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.editedExpense),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.showDetail(this.editedExpense._id);
        this.showToast("Pengeluaran berhasil diperbarui!", "success");
      } catch (error) {
        console.error("Error updating expense:", error);
        this.showToast("Gagal memperbarui pengeluaran.", "error");
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
        this.changeTab("home", false);
      } catch (error) {
        console.error("Error deleting expense:", error);
        this.showToast("Gagal menghapus pengeluaran.", "error");
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

      try {
        const response = await fetch(
          `/api/expenses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.newForm),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.showToast("Pengeluaran berhasil ditambahkan!", "success");
        this.changeTab("home");
        this.resetNewForm();
      } catch (error) {
        console.error("Error adding expense:", error);
        this.showToast("Gagal menambahkan pengeluaran.", "error");
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
      this.newForm.category = "Makanan & Minuman";
      this.newForm.payment_source = "Bank JAGO";
      this.itemError = false;
      this.amountError = false;
    },
    selectDay(day) {
      if (day) {
        const selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.newForm.date = selectedDate.toISOString().slice(0, 10);
      }
    },
    handleAmountInput(event) {
      let value = event.target.value;
      // Remove non-numeric characters and leading zeros
      value = value.replace(/[^0-9]/g, '');
      value = value.replace(/^0+/, '');

      // Convert to number for internal storage
      const numericValue = parseFloat(value) || 0;
      this.newForm.amount = numericValue;

      // Format for display with thousand separators
      this.newForm.displayAmount = this.formatNumber(numericValue);
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
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('All caches cleared.');
        count += 1;
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('All service workers unregistered.');
        count += 2;
      }

      this.showToast(`Cache berhasil dihapus dan halaman akan dimuat ulang. (${count})`);
      setTimeout(() => {
        window.location.reload(true);
      }, 2500);
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
  mounted() {
    this.darkMode = localStorage.getItem("darkMode") === "true";
    if (this.darkMode) {
      document.documentElement.classList.add("dark");
    }
    setInterval(() => {
      this.refreshTick++;
    }, 10000);
    const initial =
      (window.location.hash || "").replace("#", "") || this.currentTab;
    this.currentTab = initial;
    this.fetchExpenses();
    this.fetchCategories(); // Fetch categories on mount
    this.fetchPaymentSources(); // Fetch payment sources on mount
    this.changeTab(this.currentTab, false); // Load initial tab content

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registered: ', registration);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }

    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.tab) {
        this.changeTab(event.state.tab, false);
      } else {
        this.changeTab("settings", false);
      }
    });
  },
}).mount("#app");
