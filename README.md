# Aplikasi Pengelola Pengeluaran (Expense App)

Aplikasi ini adalah aplikasi pengelola pengeluaran sederhana yang dibangun dengan Node.js, Express, dan MongoDB sebagai backend, serta Vue.js sebagai frontend. Aplikasi ini juga diimplementasikan sebagai Progressive Web App (PWA) yang dapat diinstal dan mendukung fungsionalitas offline.

## Fitur

- **Pencatatan Pengeluaran**: Mencatat detail pengeluaran seperti tanggal, toko, item, jumlah, kategori, dan sumber pembayaran.
- **Manajemen Kategori**: Menambah dan menghapus kategori pengeluaran.
- **Manajemen Sumber Pembayaran**: Menambah dan menghapus sumber pembayaran.
- **CRUD API**: Menyediakan API untuk membuat, membaca, memperbarui, dan menghapus catatan pengeluaran, kategori, dan sumber pembayaran.
- **Koneksi MongoDB**: Menggunakan MongoDB sebagai database untuk menyimpan data pengeluaran.
- **Mode Gelap (Dark Mode)**: Opsi untuk beralih antara tema terang dan gelap.
- **Progressive Web App (PWA)**:
    - **Dapat Diinstal**: Aplikasi dapat diinstal ke layar utama perangkat seluler atau desktop.
    - **Dukungan Offline**: Konten aplikasi di-cache oleh Service Worker untuk akses offline.
    - **Manajemen Cache**: Fungsi untuk menghapus cache dan memuat ulang aplikasi secara manual.
- **Tampilan Dinamis**: Konten tab dimuat secara dinamis dan dikompilasi oleh Vue.js.

## Teknologi yang Digunakan

**Backend:**

- **Node.js**: Lingkungan runtime JavaScript.
- **Express.js**: Framework web untuk Node.js.
- **Mongoose**: Pemodelan objek MongoDB untuk Node.js.
- **dotenv**: Untuk mengelola variabel lingkungan.
- **cors**: Middleware untuk mengaktifkan Cross-Origin Resource Sharing.

**Frontend:**

- **Vue.js**: Framework JavaScript progresif untuk membangun antarmuka pengguna.
- **Tailwind CSS**: Framework CSS utilitas-first untuk styling cepat.
- **Font Awesome**: Perpustakaan ikon.

## Instalasi dan Setup

Untuk menjalankan aplikasi ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**

    ```bash
    git clone https://github.com/RiyanRIS/expense-app-vue.git
    cd expense-app-vue
    ```

2.  **Instal dependensi backend:**

    ```bash
    npm install
    ```

3.  **Konfigurasi variabel lingkungan:**

    Buat file `.env` di direktori root proyek dan tambahkan variabel-variabel berikut:

    ```
    DB_USERNAME=your_mongodb_username
    DB_PASSWORD=your_mongodb_password
    DB_CLUSTER=your_mongodb_cluster_url
    DB_NAME=your_mongo_db_name
    PORT=your_port_number
    ```

    Ganti `your_mongodb_username`, `your_mongodb_password`, dan `your_mongodb_cluster_url` dengan kredensial MongoDB Atlas atau MongoDB lokal Anda.

4.  **Jalankan server backend:**

    ```bash
    npm start
    # Atau untuk mode pengembangan dengan nodemon:
    # npm run dev
    ```

    Server akan berjalan di `http://localhost:3000` (atau port yang Anda tentukan di `.env`).

5.  **Akses Frontend:**

    Buka browser Anda dan navigasikan ke `http://localhost:3000` untuk mengakses aplikasi frontend. File `public/index.html` akan disajikan.

## Struktur Proyek

```
.env.example
.gitignore
models/
│   ├── Category.js
│   ├── Expense.js
│   └── PaymentSource.js
package.json
prompt.md
public/
│   ├── app.js
│   ├── icons/
│   │   ├── icon-192x192.svg
│   │   └── icon-512x512.svg
│   ├── index.html
│   ├── manifest.json
│   ├── plugins/
│   │   ├── fontawesome/
│   │   ├── tailwindcss/
│   │   └── vue/
│   └── service-worker.js
server.js
README.md
```

-   `server.js`: Titik masuk utama aplikasi backend, mengelola rute API dan koneksi database.
-   `models/Expense.js`: Mendefinisikan skema Mongoose untuk catatan pengeluaran.
-   `models/Category.js`: Mendefinisikan skema Mongoose untuk kategori.
-   `models/PaymentSource.js`: Mendefinisikan skema Mongoose untuk sumber pembayaran.
-   `public/`: Berisi file frontend statis (HTML, JavaScript, CSS, PWA assets).
    -   `public/app.js`: Logika utama aplikasi Vue.js.
    -   `public/index.html`: Struktur HTML utama aplikasi.
    -   `public/manifest.json`: Manifes aplikasi web untuk PWA.
    -   `public/service-worker.js`: Service Worker untuk fungsionalitas offline dan caching.
    -   `public/icons/`: Berisi ikon aplikasi untuk PWA.
    -   `public/plugins/`: Berisi pustaka pihak ketiga seperti Font Awesome, Tailwind CSS, dan Vue.
-   `package.json`: Berisi metadata proyek dan daftar dependensi.
-   `.env.example`: Contoh file variabel lingkungan.

## API Endpoints

Berikut adalah endpoint API yang tersedia:

-   `GET /api/expenses`: Mengambil semua catatan pengeluaran (maksimal 200).
-   `GET /api/expenses/:id`: Mengambil catatan pengeluaran berdasarkan ID.
-   `POST /api/expenses`: Membuat catatan pengeluaran baru.
-   `PUT /api/expenses/:id`: Memperbarui catatan pengeluaran berdasarkan ID.
-   `DELETE /api/expenses/:id`: Menghapus catatan pengeluaran berdasarkan ID.
-   `GET /api/categories`: Mengambil semua kategori.
-   `POST /api/categories`: Membuat kategori baru.
-   `DELETE /api/categories/:name`: Menghapus kategori berdasarkan nama.
-   `GET /api/payment-sources`: Mengambil semua sumber pembayaran.
-   `POST /api/payment-sources`: Membuat sumber pembayaran baru.
-   `DELETE /api/payment-sources/:name`: Menghapus sumber pembayaran berdasarkan nama.

## Skema Pengeluaran (Expense Schema)

Setiap catatan pengeluaran memiliki properti berikut:

-   `input_date`: Tanggal pengeluaran (String, wajib).
-   `store`: Nama toko (String).
-   `item`: Item yang dibeli (String).
-   `amount`: Jumlah pengeluaran (Number).
-   `category`: Kategori pengeluaran (String).
-   `payment_source`: Sumber pembayaran (String).
-   `input_time`: Waktu input (String).

UPDATE FITUR (v2)
---
## 1. Push Notification (Reminder & Alert Budget)

Gunanya misalnya:

* Reminder harian: “Jangan lupa catat pengeluaran hari ini”
* Reminder tanggal gajian
* Alert kalau pengeluaran kategori X lewat batas bulanan

**Teknis singkat:**

* Butuh:

  * Service Worker (kamu sudah punya 💪)
  * Push subscription (Web Push)
  * Endpoint di backend buat kirim notifikasi

Contoh skenario:

* User aktifkan “Reminder harian jam 21:00” → kamu simpan preferensi di DB → cron job di backend kirim web push ke semua subscription yang aktif.

---

## 2. Background Sync (Catatan Tetap Aman Walau Offline)

Ini cocok banget sama use case kamu:

> User input pengeluaran di tempat yang sinyalnya jelek.

Flow-nya:

1. Saat offline, simpan pengeluaran di **IndexedDB** di browser.
2. Daftarkan **Background Sync** di service worker.
3. Begitu device online, service worker otomatis sync data ke backend (Express API).

Benefit:
User merasa app selalu “jalan terus”, nggak peduli sinyal.

---

## 3. Web Share API (Share Ringkasan ke WA/Telegram)

Misalnya user mau share:

* Ringkasan pengeluaran harian ke pasangan
* Laporan bulanan ke grup keluarga 😆

Kamu bisa bikin tombol **“Share Bulanan”**:

```js
if (navigator.share) {
  navigator.share({
    title: 'Laporan Pengeluaran - November',
    text: 'Total: Rp 2.500.000\nMakan: Rp 800.000\nTransport: Rp 400.000',
    url: window.location.href
  });
}
```

Ini akan buka **native share sheet** (WhatsApp, Telegram, email, dll).

---

## 4. Web Share Target (Terima Share dari App Lain)

Level berikutnya: app kamu bisa muncul di **menu “Share to…”** dari browser atau app lain.

Contoh:

* User buka internet banking → export mutasi → share ke “Expense App” → app kamu terima file/text & tawarkan import.

Ini diatur lewat `manifest.json` dengan `share_target`.

---

## 5. File & Data: Import/Export (CSV/JSON)

Biar user merasa data **punya mereka**, kamu bisa:

* Export semua pengeluaran ke:

  * CSV → dibuka di Excel/Google Sheets
  * JSON → untuk backup
* Import CSV/JSON → pindah device gampang.

Kamu bisa pakai:

* `<input type="file">` + FileReader API
* Atau File System Access API (kalau mau UX advanced di Chrome)

---

## 6. Clipboard API (Copy Cepat)

Hal kecil tapi enak:

* Tombol **“Copy ringkasan bulan ini”** → langsung ke clipboard.

```js
if (navigator.clipboard) {
  navigator.clipboard.writeText(reportText);
}
```

Cocok buat user yang suka tempel ringkasan di catatan lain.

---

## 7. App Shortcuts (Quick Action dari Icon)

Di `manifest.json`, kamu bisa tambahin **shortcut** kaya:

* “+ Pengeluaran Hari Ini”
* “Lihat Laporan Bulanan”
* “Tambah Kategori”

Jadi kalau user *long-press* icon app di home screen, bisa langsung lompat ke halaman tertentu di app.

---

## 8. Theming & Sistem: Ikuti Tema HP

Kamu sudah punya **dark mode**, bisa di-*upgrade*:

* Deteksi `prefers-color-scheme: dark` → ikut setting OS user otomatis.
* Simpan preferensi di localStorage, tapi default-nya ikut sistem.

---

## 9. Keamanan: WebAuthn / Passwordless Login

Kalau nanti kamu tambah auth (multi user):

* Bisa pakai **WebAuthn** buat:

  * Login pakai fingerprint / face unlock / device PIN
  * Tanpa password

Ini bikin app keuangan kamu berasa **serius & aman**, walau cuma web app.

---

## 10. UX Kecil yang Berasa “Native”

Beberapa hal lain yang bisa kamu kombinasikan:

* **Getar halus** ketika:

  * Pengeluaran berhasil tersimpan
  * Pengeluaran gagal (beda durasi)
* **Animasi transition** antar tab/page (Vue + Tailwind) biar smooth.
* **Offline indicator**:

  * Misal bar kecil di atas: “Mode offline, data akan disinkronkan saat online.”
* **Skeleton loading** untuk list pengeluaran supaya terasa responsif.

---

## 11. Ide Fitur Khusus Buat Expense App Kamu

Ngomongin **fungsi**, bukan cuma API:

* **Budget per kategori** + progress bar
* **Hari tanpa pengeluaran** → bisa jadi gamification (“Streak hemat 3 hari 🎯”)
* **Quick add**:

  * Tombol seperti: “+15k kopi”, “+10k parkir”, super cepat 1 tap.
* **Filter pintar**:

  * “Hari ini”, “Kemarin”, “Minggu ini”, “Bulan ini”
  * “Dari Tarisa 💸” (kalau nanti joint account sama istri 🤭)