# Aplikasi Pengelola Pengeluaran (Expense App)

Aplikasi ini adalah aplikasi pengelola pengeluaran sederhana yang dibangun dengan Node.js, Express, dan MongoDB sebagai backend, serta Vue.js sebagai frontend. Aplikasi ini juga diimplementasikan sebagai Progressive Web App (PWA) yang dapat di}
}}}}}}
```

## 📚 Dokumentasi Lengkap
## 📚 Dokumentasi Lengkap
## 📚 Dokumentasi Lengkap
## 📚 Dokumentasi Lengkap
## 📚 Dokumentasi Lengkap
## 📚 Dokumentasi Lengkap
## 📚 Dokumentasi Lengkap dan mendukung fungsionalitas offline.

## ✨ Fitur

### 🔐 **Authentication & Authorization**
- **JWT-based Authentication**: Sistem login dan registrasi dengan JSON Web Tokens
- **User Registration**: Pendaftaran akun baru dengan validasi email dan password
- **Secure Login**: Login dengan email dan password yang di-hash
- **Password Security**: Hashing password dengan bcryptjs dan validasi kekuatan password
- **Session Management**: Token-based sessions dengan auto-logout
- **User Data Isolation**: Setiap user hanya dapat mengakses data mereka sendiri

### 👤 **Profile Management**
- **Update Profile**: Mengubah nama dan foto profil
- **Change Password**: Mengubah password dengan validasi keamanan
- **Password History**: Mencegah penggunaan ulang password lama
- **Forgot Password**: Reset password via email (demo mode)

### 📊 **Expense Management**
- **Pencatatan Pengeluaran**: Mencatat detail pengeluaran seperti tanggal, toko, item, jumlah, kategori, dan sumber pembayaran
- **Quick Add Items**: Template pengeluaran untuk entri cepat
- **Expense Filtering**: Filter berdasarkan tanggal (hari ini, kemarin, minggu ini, bulan ini)
- **Expense Statistics**: Total pengeluaran hari ini, bulan ini, kategori terbanyak, dll.

### 📁 **Category & Payment Management**
- **Manajemen Kategori**: Menambah, mengedit, dan menghapus kategori pengeluaran
- **Manajemen Sumber Pembayaran**: Menambah, mengedit, dan menghapus sumber pembayaran
- **Default Data**: Kategori dan sumber pembayaran default untuk user baru

### 💾 **Data Management**
- **Backup & Restore**: Backup data ke file JSON dan restore
- **Offline Support**: IndexedDB untuk penyimpanan offline
- **Data Synchronization**: Sinkronisasi otomatis saat online
- **Cache Management**: Clear cache dan reload aplikasi

### 🎨 **User Interface**
- **🌓 Dark Mode**: Mode gelap adaptif mengikuti preferensi sistem
- **🌍 Multi-Language**: Support Bahasa Indonesia & English
- **📱 Mobile-First**: Desain responsif untuk perangkat mobile
- **🎨 Theme Customization**: Berbagai pilihan warna tema

### 🔔 **Notifications & PWA**
- **Push Notifications**: Notifikasi push untuk pengingat dan alert
- **Progressive Web App**: Dapat diinstal ke layar utama
- **Service Worker**: Cache untuk akses offline
- **Web App Manifest**: Metadata aplikasi untuk PWA

### 🔒 **Security & Validation**
- **Input Validation**: express-validator untuk semua endpoints
- **Error Logging**: Winston + Morgan untuk comprehensive logging
- **CORS Protection**: Cross-Origin Resource Sharing
- **Rate Limiting**: Perlindungan terhadap abuse

## 🛠️ Teknologi yang Digunakan

**Backend:**
- **Node.js v14+**: Lingkungan runtime JavaScript
- **Express.js**: Framework web untuk Node.js
- **MongoDB + Mongoose**: Database NoSQL dengan ODM
- **JWT (jsonwebtoken)**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **Winston**: Advanced logging
- **Morgan**: HTTP request logger
- **Web-Push**: Push notifications
- **dotenv**: Environment variables
- **cors**: Cross-Origin Resource Sharing

**Frontend:**
- **Vue.js 3**: Framework JavaScript progresif
- **Tailwind CSS**: Framework CSS utilitas-first
- **Font Awesome**: Library ikon
- **Service Worker API**: Offline functionality
- **IndexedDB**: Local storage
- **Web Push API**: Push notifications

## 📦 Instalasi dan Setup

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
config/
│   └── logger.js              # Winston logger configuration
controllers/
│   └── authController.js      # Authentication controllers
docs/                          # Documentation files
logs/                          # Application logs
middlewares/
│   ├── auth.js                # JWT authentication middleware
│   ├── errorHandler.js        # Error handling middleware
│   └── validation.js          # Input validation middleware
models/
│   ├── Category.js            # Category model
│   ├── Expense.js             # Expense model
│   ├── PaymentSource.js       # Payment source model
│   ├── PushSubscription.js    # Push notification subscriptions
│   ├── QuickAddItem.js        # Quick add templates
│   └── User.js                # User authentication model
package.json
public/
│   ├── app.js                 # Vue.js application logic
│   ├── icons/
│   │   ├── icon-192x192.svg
│   │   ├── icon-32x32.svg
│   │   ├── icon-512x512.svg
│   ├── index.html             # Main HTML file
│   ├── manifest.json          # PWA manifest
│   ├── plugins/
│   │   ├── fontawesome/
│   │   ├── tailwindcss/
│   │   └── vue/
│   └── service-worker.js      # Service worker for PWA
server.js                      # Express server & API routes
README.md
```

### **File Descriptions**

- **`server.js`**: Main Express server with API routes and database connection
- **`models/User.js`**: User model with authentication, password hashing, and JWT methods
- **`models/Expense.js`**: Expense model with user isolation
- **`models/Category.js`**: Category model with user-specific categories
- **`models/PaymentSource.js`**: Payment source model with user-specific sources
- **`models/QuickAddItem.js`**: Quick add templates for rapid expense entry
- **`controllers/authController.js`**: Authentication controllers (signup, login, profile, password)
- **`middlewares/auth.js`**: JWT authentication and authorization middleware
- **`public/app.js`**: Vue.js application with authentication, expense management, and PWA features
- **`public/index.html`**: Main HTML template with Vue.js components
- **`config/logger.js`**: Winston logger configuration for error tracking

## API Endpoints

### **Authentication Endpoints**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile (name, avatar)
- `PUT /api/auth/change-password` - Change user password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token
- `DELETE /api/auth/account` - Delete user account

### **Expense Endpoints**
- `GET /api/expenses` - Get all user expenses (max 200)
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### **Category Endpoints**
- `GET /api/categories` - Get all user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:name` - Update category
- `DELETE /api/categories/:name` - Delete category

### **Payment Source Endpoints**
- `GET /api/payment-sources` - Get all user payment sources
- `POST /api/payment-sources` - Create new payment source
- `PUT /api/payment-sources/:name` - Update payment source
- `DELETE /api/payment-sources/:name` - Delete payment source

### **Quick Add Endpoints**
- `GET /api/quick-add-items` - Get all user quick add items
- `POST /api/quick-add-items` - Create new quick add item
- `PUT /api/quick-add-items/:id` - Update quick add item
- `DELETE /api/quick-add-items/:id` - Delete quick add item

### **Backup & Restore Endpoints**
- `GET /api/backup` - Download user data backup
- `POST /api/restore` - Restore user data from backup

### **Push Notification Endpoints**
- `POST /api/subscribe` - Subscribe to push notifications
- `POST /api/unsubscribe` - Unsubscribe from push notifications
- `POST /api/test-notification` - Send test notification

## Database Models

### **User Schema**
```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  role: String (enum: 'user', 'admin', default: 'user'),
  status: String (enum: 'active', 'suspended', 'deleted', default: 'active'),
  avatar: String (optional URL),
  lastLogin: Date,
  passwordChangedAt: Date,
  lastPasswordUpdate: Date,
  previousPassword: String (hashed, for security),
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Expense Schema**
```javascript
{
  user: ObjectId (reference to User, required),
  date: String (required, YYYY-MM-DD format),
  store: String (optional),
  item: String (required),
  amount: Number (required),
  category: String (required),
  payment_source: String (required),
  input_date: String (auto-generated, YYYY-MM-DD),
  input_time: String (auto-generated, HH:MM:SS),
  createdAt: Date,
  updatedAt: Date
}
```

### **Category Schema**
```javascript
{
  name: String (required, unique per user),
  user: ObjectId (reference to User, required),
  createdAt: Date,
  updatedAt: Date
}
```

### **PaymentSource Schema**
```javascript
{
  name: String (required, unique per user),
  user: ObjectId (reference to User, required),
  createdAt: Date,
  updatedAt: Date
}
```

### **QuickAddItem Schema**
```javascript
{
  name: String (required),
  amount: Number (required),
  category: String (required),
  paymentSource: String (required),
  user: ObjectId (reference to User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 📚 Dokumentasi Lengkap

- [Dokumentasi Utama](docs/DOKUMENTASI.md) - Dokumentasi lengkap aplikasi
- [Panduan Implementasi Auth (JWT)](docs/AUTH_IMPLEMENTATION_GUIDE.md)
- [Ringkasan Implementasi Auth](docs/AUTH_COMPLETE.md)
- [Panduan Validasi](docs/VALIDATION_GUIDE.md)
- [Ringkasan Error Handling](docs/ERROR_HANDLING_SUMMARY.md)
- [Ringkasan Implementasi](docs/IMPLEMENTATION_SUMMARY.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Font Awesome for the icon library
- MongoDB Atlas for database hosting
- All contributors and users of this project
