export function formatNumber(value) {
  const number = Number(value || 0);
  if (Number.isNaN(number)) return "0";
  return number.toLocaleString("id-ID");
}

export function parseNumber(value) {
  const normalized = String(value).replace(/[^0-9.-]/g, "");
  return Number(normalized) || 0;
}

export function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isSameMonth(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

export function isThisWeek(date, now = new Date()) {
  const current = new Date(now);
  const firstDayOfWeek = new Date(current.setDate(current.getDate() - current.getDay()));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

export function timeAgo(dateString, timeString) {
  if (!dateString) return "";
  const dateTimeString = `${dateString} ${timeString || "00:00:00"}`;
  const date = new Date(dateTimeString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "yearsAgo", seconds: 31536000 },
    { label: "monthsAgo", seconds: 2592000 },
    { label: "daysAgo", seconds: 86400 },
    { label: "hoursAgo", seconds: 3600 },
    { label: "minutesAgo", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}`;
    }
  }

  return "justNow";
}

export function showToast(message, type = "info") {
  const toastContainer =
    document.getElementById("toast-container") ||
    (() => {
      const container = document.createElement("div");
      container.id = "toast-container";
      Object.assign(container.style, {
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
      document.body.appendChild(container);
      return container;
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

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3500);
}
