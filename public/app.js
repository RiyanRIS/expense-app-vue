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
        Date: "",
        Store: "",
        Item: "",
        Amount: "",
        Category: "Makanan & Minuman",
        "Payment Source": "Bank JAGO",
      },
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
    latestTen() {
      const arr = [...this.expenses];
      return arr;
    },
    totalToday() {
      const today = new Date().toISOString().slice(0, 10);
      return this.expenses
        .filter((e) => e.Date === today)
        .reduce((s, e) => s + this.toNumber(e.Amount), 0);
    },
    totalMonth() {
      const ym = new Date().toISOString().slice(0, 7);
      return this.expenses
        .filter((e) => (e.Date || "").slice(0, 7) === ym)
        .reduce((s, e) => s + this.toNumber(e.Amount), 0);
    },
    topCategory() {
      return this.topByKey("Category");
    },
    topSource() {
      return this.topByKey("Payment Source");
    },
    topStore() {
      return this.topByKey("Store");
    },
  },
  methods: {
    async fetchExpenses() {
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.expenses = data;
      } catch (error) {
        console.error("Error fetching expenses:", error);
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
      if (!dateString) return '';
      const dateTimeString = `${dateString} ${timeString || '00:00:00'}`;
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
    },
    changeTab(tabName, pushState = true) {
      this.currentTab = tabName;
      if (pushState) {
        history.pushState({ tab: tabName }, '', `#${tabName}`);
      }
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    async showDetail(expenseId) {
      try {
        const response = await fetch(`/api/notes/${expenseId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.selectedExpense = data;
        this.changeTab('detail');
      } catch (error) {
        console.error("Error fetching expense detail:", error);
      }
    },
    editExpense(expense) {
      this.editedExpense = { ...expense };
      this.changeTab('edit');
    },
    async submitEdit() {
      try {
        const response = await fetch(`/api/notes/${this.editedExpense._id.$oid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.editedExpense),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.changeTab('detail', false);
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    },
    async deleteExpense(expenseId) {
      try {
        const response = await fetch(`/api/notes/${expenseId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchExpenses();
        this.changeTab('home', false);
      } catch (error) {
        console.error("Error deleting expense:", error);
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
    submitNew() {
      const now = new Date();
      const oid = Math.random().toString(16).slice(2) + Date.now().toString(16);
      const rec = {
        _id: { $oid: oid },
        Date: this.newForm.Date,
        Store: this.newForm.Store,
        Item: this.newForm.Item,
        Amount: String(this.newForm.Amount),
        Category: this.newForm.Category,
        "Payment Source": this.newForm["Payment Source"],
        "Input Date": now.toISOString().slice(0, 10),
        "Input Time": now.toTimeString().slice(0, 8),
      };
      this.expenses.unshift(rec);
      this.newForm = {
        Date: "",
        Store: "",
        Item: "",
        Amount: "",
        Category: "Makanan & Minuman",
        "Payment Source": "Bank JAGO",
      };
      this.currentTab = "home";
    },
    action(t) {
      if (t === "logout") {
        this.user = { ...this.user };
        this.currentTab = "settings";
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

    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.tab) {
        this.currentTab = event.state.tab;
      } else {
        this.currentTab = 'home';
      }
    });
  },
}).mount("#app");
