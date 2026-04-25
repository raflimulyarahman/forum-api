# 🚀 Deployment Guide - Forum API

## Status Saat Ini
❌ **Production API returning 502 Bad Gateway**

**URL:** https://forum-api-production-decc.up.railway.app/

---

## 🔧 Mengatasi 502 Bad Gateway Error

### Penyebab Umum
1. **Environment variables tidak dikonfigurasi di Railway**
2. **Database tidak ter-connect dengan baik**
3. **Application crashes saat startup**
4. **Port tidak sesuai konfigurasi**

### Solusi

#### Langkah 1: Set Environment Variables di Railway Dashboard

1. **Buka Railway Dashboard**
   - Masuk ke https://railway.app
   - Pilih project "forum-api" atau yang sesuai

2. **Buka Variables Tab**
   - Navigasi ke: Project → Variables

3. **Tambahkan environment variables berikut:**

```env
# HTTP Server
PORT=8080

# PostgreSQL Database (Production)
PGHOST=<railway-postgres-host>
PGPORT=5432
PGUSER=postgres
PGPASSWORD=<your-postgres-password>
PGDATABASE=forumapi

# JWT Tokens
ACCESS_TOKEN_KEY=supersecretaccesstokenkey123456
REFRESH_TOKEN_KEY=supersecretrefreshtokenkey654321
ACCESS_TOKEN_AGE=3000

# Node Environment
NODE_ENV=production
```

**Cara mendapatkan PostgreSQL credentials dari Railway:**
1. Di Railway dashboard, pilih PostgreSQL service
2. Klik "Connect"
3. Copy credentials yang ditampilkan

#### Langkah 2: Verifikasi Database

**Di Railway Dashboard:**
```
PostgreSQL Service → Logs
Lihat apakah ada error atau koneksi issues
```

**Test koneksi ke database:**
```bash
# Install PostgreSQL client (jika belum)
# macOS:
brew install postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql-client

# Connect ke database
psql postgresql://postgres:PASSWORD@HOST:5432/forumapi

# Jika berhasil, akan melihat:
psql (14.7)
forumapi=> 
```

#### Langkah 3: Restart Application di Railway

1. **Via Railway Dashboard:**
   - Project → forum-api service
   - Settings → Redeploy
   - Klik "Redeploy"

2. **Via Command Line:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Pilih project
railway link

# Deploy
railway up
```

#### Langkah 4: Check Application Logs

**Di Railway Dashboard:**
```
Forum API Service → Logs
Monitor untuk error messages
```

**Expected successful startup:**
```
> npm start
> node src/app.js

server start at http://localhost:8080
Database connected successfully
```

**Common errors:**
```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
   Solusi: Database credentials salah atau database tidak running

❌ Error: database "forumapi" does not exist
   Solusi: Run migrations via Railway CLI atau create database manually

❌ Error: Access denied for user 'postgres'@'...'
   Solusi: Check PGPASSWORD variable

❌ Cannot find module 'express'
   Solusi: npm install belum dijalankan, check start command
```

---

## ✅ Verifikasi Deployment Berhasil

### 1️⃣ Test via Browser
```
Buka: https://forum-api-production-decc.up.railway.app/
```

**Jika berhasil:**
```
HTTP 404
{
  "status": "fail",
  "message": "Route tidak ditemukan"
}
✅ Server responds = deployment successful
```

### 2️⃣ Test via cURL
```bash
# Simple health check
curl -v https://forum-api-production-decc.up.railway.app/

# Expected response: HTTP 404 (normal, karena root path kosong)
# Jika 502: masalah ada di server side
# Jika 503: server starting up
```

### 3️⃣ Test dengan Postman

```
1. Buka Postman Collection dari project folder:
   Forum API V2 Test/Forum API V2 Test.postman_collection.json

2. Update base URL ke production:
   {{baseUrl}} = https://forum-api-production-decc.up.railway.app

3. Run test collection:
   Collections → Forum API V2 Test → Run
```

**Expected results:**
```
✅ POST /users - Register (201)
✅ POST /authentications - Login (201)
✅ POST /threads - Create Thread (201)
✅ GET /threads/:id - Get Thread (200)
✅ POST /threads/:id/comments - Add Comment (201)
```

### 4️⃣ Test dengan curl script
```bash
#!/bin/bash

BASE_URL="https://forum-api-production-decc.up.railway.app"

echo "🔍 Testing Forum API Production..."

# Test 1: Register user
echo "1️⃣ Testing user registration..."
REGISTER=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"password123",
    "fullName":"Test User"
  }')

echo "Response: $REGISTER"
USER_ID=$(echo $REGISTER | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ User created: $USER_ID"

# Test 2: Login
echo ""
echo "2️⃣ Testing login..."
LOGIN=$(curl -s -X POST "$BASE_URL/authentications" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "password":"password123"
  }')

TOKEN=$(echo $LOGIN | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "✅ Login successful, token: ${TOKEN:0:20}..."

# Test 3: Create thread
echo ""
echo "3️⃣ Testing thread creation..."
THREAD=$(curl -s -X POST "$BASE_URL/threads" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title":"Test Thread",
    "body":"This is a test thread"
  }')

THREAD_ID=$(echo $THREAD | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Thread created: $THREAD_ID"

# Test 4: Get thread
echo ""
echo "4️⃣ Testing get thread..."
curl -s -X GET "$BASE_URL/threads/$THREAD_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "✅ All tests completed!"
```

---

## 📋 Checklist Deployment

### Pre-Deployment
- [ ] Semua tests pass locally
- [ ] Database migrations ready
- [ ] Environment variables didokumentasikan
- [ ] Secrets configured di Railway

### Deployment
- [ ] Code pushed ke branch `main`
- [ ] GitHub Actions CI/CD workflow triggered
- [ ] All tests passed di GitHub Actions
- [ ] Deployment initiated automatically by Railway

### Post-Deployment
- [ ] Application logs checked di Railway dashboard
- [ ] Health check endpoint responding
- [ ] Database connectivity verified
- [ ] Postman collection tests passing
- [ ] No 502 errors in production

---

## 🐛 Troubleshooting

### Railway Dashboard tidak menunjukkan logs

**Solusi:**
1. Pastikan sudah login di railway.com
2. Select correct project
3. Select correct environment (production)
4. Cek apakah service sudah di-activate

### Database credentials di Railway berbeda dengan .env lokal

**Solusi:**
1. Jangan hardcode credentials di code
2. Selalu gunakan environment variables
3. Railway memiliki managed PostgreSQL service
4. Ambil credentials dari Railway dashboard, bukan dari .env

### Deployment gagal di GitHub Actions

**Solusi:**
1. Check GitHub Actions logs
2. Verify RAILWAY_TOKEN di GitHub Secrets (jika ada)
3. Ensure all tests pass sebelum deployment
4. Review git commit message untuk clues

### Application crash setelah deployment

**Solusi:**
1. Check Railway logs untuk error message
2. Verify environment variables lengkap dan benar
3. Ensure database migrations sudah dijalankan
4. Check Node.js version compatibility

---

## 🔗 Helpful Links

- **Railway Dashboard:** https://railway.app
- **Railway Docs:** https://docs.railway.app
- **GitHub Actions:** https://github.com/YOUR_USERNAME/forum-api/actions
- **PostgreSQL Guide:** https://www.postgresql.org/docs/15/

---

## 🎯 Next Steps

### Immediate Actions:
1. ✅ Set environment variables di Railway dashboard
2. ✅ Redeploy application
3. ✅ Check logs di Railway
4. ✅ Test dengan Postman atau cURL

### If 502 still appears:
1. 📝 Check Railway logs untuk error details
2. 🔗 Verify database connection string
3. 🧪 Test database connectivity manually
4. 🔄 Redeploy setelah fix

### Monitoring & Maintenance:
1. 📊 Monitor Railway dashboard regularly
2. 📧 Set up alerts untuk deployment failures
3. 📝 Keep logs archive untuk troubleshooting
4. 🔄 Regular backups dari production database

---

**Last Updated:** April 25, 2026  
**Status:** 🔴 Requires Action (502 Gateway Error)
