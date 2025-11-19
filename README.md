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