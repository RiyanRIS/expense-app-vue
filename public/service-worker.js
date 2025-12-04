const CACHE_NAME = "expense-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/manifest.json",
  "/plugins/tailwindcss/tailwindcss.js",
  "/plugins/vue/vue.global.js",
  "/plugins/fontawesome/css/all.min.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and can only be consumed once. We must clone it so that
        // the browser can consume the original response and we can consume the clone.
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Network request failed, try to get it from the cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function openDB() {
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
}

async function syncPendingExpenses() {
  const db = await openDB();
  const items = await new Promise((resolve, reject) => {
    const tx = db.transaction("pending-expenses", "readonly");
    const store = tx.objectStore("pending-expenses");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
  for (const item of items) {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res && res.ok) {
        await new Promise((resolve, reject) => {
          const tx = db.transaction("pending-expenses", "readwrite");
          const store = tx.objectStore("pending-expenses");
          const del = store.delete(item.id);
          del.onsuccess = () => resolve(true);
          del.onerror = () => reject(del.error);
        });
      }
    } catch (e) {}
  }
  const clientsList = await self.clients.matchAll({
    includeUncontrolled: true,
  });
  for (const client of clientsList) {
    client.postMessage({ type: "expenses-synced" });
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-expenses") {
    event.waitUntil(syncPendingExpenses());
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "sync-expenses") {
    event.waitUntil(syncPendingExpenses());
  }
  
  // Handle skip waiting for app updates
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("Push received:", data);

  const title = data.title || "Expense View Notification";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/icons/icon-192x192.svg",
    badge: "/icons/icon-32x32.svg",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") // Buka aplikasi ketika notifikasi diklik
  );
});
