#  Bookstore web development

Ini adalah sebuah proyek website toko buku yang saat ini sedang dalam tahap pengembangan.
Proyek ini saya buat untuk mendokumentasikan proses belajar dan sebagai bukti hasil kerja saya dalam
mempelajari Fullstack Web Development

## Gambaran Project
- **Fitur CRUD**
- **Pencarian buku**
- **Tersambung ke database MySQL**
- **REST API**
- **USER INTERFACE menggunakan React**
- **Siap dikembangkan untuk aplikasi android dengan React Native**

## Target Akhir Project

### Frontend
- Memiliki fitur Login dan register
- Dashboard
- CRUD Buku
- Search
- Pagination
- Sorting
- Upload cover buku
- Loading & error state
- Responsive Design

### Backend
- REST API
- JWT AUTHENTICATION
- MIDDLEWARE
- INPUT VALIDATION
- FILE UPLOAD
- MVC STRUCTURE
- HANDLING ERROR
- LOGGING

### Database
- Relasi antar tabel
- Foreign Key
- Query yang efisien

## Teknologi yang digunakan
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: 'mysql2'

## Cara menjalankan di komputer lokal
1. **Clone repositori berikut :**
```bash
git clone https://github.com/eza-pa/bookstore
```

2. **Masuk ke folder proyek**
```bash
cd bookstore
```

3. **Install dependensi**
```bash
npm install
```

4. **Konfigurasi databse dan evirontment**
```env
PORT=5000
DB_HOST=root
DB_PASSWORD=kosong
DB_NAME=tokobuku_db
```

5. **Jalankan server**
```bash
npm run dev
```