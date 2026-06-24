#  Bookstore web development

Ini adalah sebuah proyek website toko buku yang saat ini sedang dalam tahap pengembangan.
Proyek ini saya buat untuk mendokumentasikan proses belajar dan sebagai bukti hasil kerja saya dalam
mempelajari Fullstack Web Development

## status proyek & Fitur
- [x] **Database configuration**: Installasi server utama menggunakan Express.js.
- [x] **Server architecture**: Koneksi aman ke database MySQL.
- [x] **Routing system**: Jalur API dasar untuk navigasi data buku.
- [x] **Controller Structure**: Pemisahan logika bisnis menggunakan pola arsitektur yang rapi.
- [x] **Book CRUD Operations**: Fitur tambah, baca, edit, dan hapus data buku oleh admin.
- [ ] **Authentication & Authorization**: Fitur registrasi login JWT untuk pelanggan dan admin.
- [ ] **Cart & Transaction System**: Fitur keranjang belanja dan proses chekout buku.
- [ ] **Frontend Interface**: Halaman depan/interface web toko buku.

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