# Forum API - Dicoding Backend Expert Submission

Sebuah RESTful API untuk platform diskusi (forum) yang dibangun dengan menerapkan **Clean Architecture** dan **Test-Driven Development (TDD)**. Proyek ini merupakan submission akhir untuk kursus Menjadi Backend Developer Expert di Dicoding.

## ✨ Fitur Utama
- **Users**: Registrasi pengguna baru.
- **Authentications**: Login, logout, dan refresh access token.
- **Threads**: Membuat thread baru dan melihat detail thread beserta komentar & balasannya.
- **Comments**: Menambahkan dan menghapus komentar pada sebuah thread (Soft Delete).
- **Comment Likes**: Menyukai/batal menyukai komentar dengan endpoint PUT /threads/{threadId}/comments/{commentId}/likes.
- **Replies**: Menambahkan dan menghapus balasan (reply) pada sebuah komentar (Soft Delete).

## 🔒 Fitur Keamanan & DevOps
- **HTTPS**: Semua traffic API dipaksakan menggunakan protokol HTTPS untuk keamanan data.
- **Rate Limiting**: Proteksi terhadap DDoS attack dengan membatasi /threads endpoint ke 90 request per menit.
- **NGINX Configuration**: Reverse proxy dengan konfigurasi keamanan dan rate limiting.
- **Continuous Integration (GitHub Actions)**: Automated testing pada setiap pull request ke branch main.
- **Continuous Deployment (GitHub Actions)**: Automated deployment pada setiap push ke branch main.
- **JWT Authentication**: Token-based authentication dengan access token dan refresh token.

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
- Mendukung fitur opsional: **Replies** (Balasan Komentar) dan **Comment Likes** (Suka Komentar).
- Seluruh endpoint telah diuji menggunakan Postman (Collection tersedia di direktori submission).

## 🌐 API Endpoints

### Authentication
- `POST /users` - Registrasi pengguna baru
- `POST /authentications` - Login
- `DELETE /authentications` - Logout
- `PUT /authentications` - Refresh token

### Threads
- `POST /threads` - Buat thread baru (auth required)
- `GET /threads/:threadId` - Lihat detail thread dengan comments dan replies

### Comments
- `POST /threads/:threadId/comments` - Tambah comment (auth required)
- `DELETE /threads/:threadId/comments/:commentId` - Hapus comment (auth required)
- `PUT /threads/:threadId/comments/:commentId/likes` - Like/unlike comment (auth required)

### Replies
- `POST /threads/:threadId/comments/:commentId/replies` - Tambah reply (auth required)
- `DELETE /threads/:threadId/comments/:commentId/replies/:replyId` - Hapus reply (auth required)

## 🚀 Deployment

### NGINX Configuration
Forum API menggunakan NGINX sebagai reverse proxy dengan:
- Rate limiting 90 request/menit untuk /threads
- HTTPS redirect (HTTP → HTTPS)
- Security headers
- SSL/TLS encryption

File konfigurasi tersedia di `nginx.conf`. Lihat [HTTPS_SETUP.md](./HTTPS_SETUP.md) untuk panduan deployment lengkap.

### GitHub Actions CI/CD
Repository ini dilengkapi dengan automated workflows:

**Continuous Integration (`.github/workflows/ci.yml`):**
- Trigger: Pull request ke branch main
- Run: Unit tests, integration tests, database migrations
- Database: PostgreSQL service container

**Continuous Deployment (`.github/workflows/cd.yml`):**
- Trigger: Push ke branch main
- Run: Tests lalu deployment ke server
- Deployment method: SSH ke EC2 instance (requires GitHub secrets configuration)

### Setup GitHub Secrets untuk CD
Untuk mengaktifkan automated deployment, tambahkan secrets berikut ke repository:
```
DEPLOY_SSH_KEY: Private SSH key untuk server
SERVER_HOST: IP/hostname server
SERVER_USER: Username untuk SSH connection
```

## 🔐 Rate Limiting

Forum API membatasi request ke endpoint `/threads` sebanyak 90 request per menit untuk mencegah DDoS attack:

```
Limit: 90 requests per minute
Endpoint: /threads dan sub-path-nya
Behavior: Mengembalikan 429 Too Many Requests saat limit tercapai
```

## 📄 File Konfigurasi Penting
- `.env` - Environment variables (copy dari .env.example)
- `nginx.conf` - NGINX reverse proxy configuration
- `.github/workflows/ci.yml` - Continuous Integration workflow
- `.github/workflows/cd.yml` - Continuous Deployment workflow
- `HTTPS_SETUP.md` - Panduan setup HTTPS

## 📚 Dokumentasi Tambahan
- [HTTPS Setup Guide](./HTTPS_SETUP.md) - Panduan konfigurasi SSL/TLS
- [instruction.md](./instruction.md) - Requirement submission
- Forum API V2 Postman Collection - Tersedia di folder `Forum API V2 Test/`
