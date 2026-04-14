# Forum API - Dicoding Backend Expert Submission

Sebuah RESTful API untuk platform diskusi (forum) yang dibangun dengan menerapkan **Clean Architecture** dan **Test-Driven Development (TDD)**. Proyek ini merupakan submission akhir untuk kursus Menjadi Backend Developer Expert di Dicoding.

## ✨ Fitur Utama
- **Users**: Registrasi pengguna baru.
- **Authentications**: Login, logout, dan refresh access token.
- **Threads**: Membuat thread baru dan melihat detail thread beserta komentar & balasannya.
- **Comments**: Menambahkan dan menghapus komentar pada sebuah thread (Soft Delete).
- **Replies**: Menambahkan dan menghapus balasan (reply) pada sebuah komentar (Soft Delete).

## 🛠️ Teknologi & Tools
- **Runtime**: Node.js
- **Framework Admin**: Express.js
- **Database**: PostgreSQL
- **Migration**: node-pg-migrate
- **Testing**: Vitest
- **Security**: Bcrypt, JSON Web Token (JWT)

## 🏗️ Arsitektur Proyek
Mengikuti prinsip **Clean Architecture** yang terbagi menjadi 4 layer utama:
1. **Domains**: Berisi Entitas Bisnis dan Abstraksi Repository.
2. **Applications**: Berisi Use Case (Logic Bisnis).
3. **Infrastructures**: Implementasi konkret dari security adapter, database, dan repository postgres.
4. **Interfaces**: Handler untuk HTTP request dan routing (Interface Adapter).

## 🚀 Memulai Proyek

### 1. Kloning Repositori
```bash
git clone https://github.com/username/forum-api.git
cd forum-api
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Database & Environment
Buat database PostgreSQL baru (misal: `forumapi` dan `forumapi_test`). Salin berkas `.env.example` (jika ada) atau buat berkas `.env` dengan konfigurasi berikut:

```env
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=forumapi

# POSTGRES TEST
PGHOST_TEST=localhost
PGPORT_TEST=5432
PGUSER_TEST=postgres
PGPASSWORD_TEST=postgres
PGDATABASE_TEST=forumapi_test

# TOKENIZE
ACCESS_TOKEN_KEY=token_rahasia_anda
REFRESH_TOKEN_KEY=token_refresh_rahasia_anda
ACCESS_TOKEN_AGE=3000
```

### 4. Menjalankan Migrasi Database
```bash
# Untuk database utama
npm run migrate up

# Untuk database testing
npm run migrate:test up
```

### 5. Menjalankan Aplikasi
```bash
# Mode production
npm start

# Mode development (dengan nodemon)
npm run start:dev
```

## 🧪 Pengujian (Testing)
Proyek ini memiliki cakupan pengujian yang luas (Unit, Integration, dan Functional Testing).

```bash
# Menjalankan semua test
npm test

# Menjalankan test dengan laporan coverage
npm run test:coverage
```

## 📝 Catatan Submission
- Implementasi menggunakan Express.js sebagai framework utama.
- Menerapkan modularization dan dependency injection.
- Mendukung fitur opsional: **Replies** (Balasan Komentar).
- Seluruh endpoint telah diuji menggunakan Postman (Collection tersedia di direktori submission).
