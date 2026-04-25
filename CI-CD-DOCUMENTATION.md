# 📋 Dokumentasi Continuous Integration & Continuous Deployment (CI/CD)

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Alur CI/CD](#alur-cicd)
3. [Skenario Berhasil (Success)](#skenario-berhasil)
4. [Skenario Gagal (Failure)](#skenario-gagal)
5. [Konfigurasi Secrets](#konfigurasi-secrets)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Pengenalan

Forum API menggunakan **GitHub Actions** untuk mengotomatisasi proses testing (Continuous Integration) dan deployment (Continuous Deployment) ke platform **Railway.app**.

### Workflow yang Tersedia

| Workflow | Trigger | Tujuan |
|----------|---------|--------|
| `ci.yml` | Pull Request ke `main` | Menjalankan automated tests |
| `cd.yml` | Push ke `main` | Menjalankan tests + deploy ke production |

---

## Alur CI/CD

```
┌─────────────────────────────────────────────────────────────┐
│                   Developer Workflow                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────┐
         │  1. Create Feature Branch       │
         │     (git checkout -b feature)   │
         └─────────────────┬───────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  2. Commit & Push to GitHub     │
         │     (git push origin feature)   │
         └─────────────────┬───────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  3. Create Pull Request (PR)    │
         │     to branch 'main'            │
         └─────────────────┬───────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
    ┌─────────────────────┐   ┌─────────────────────┐
    │  ✅ CI WORKFLOW     │   │  ❌ CI WORKFLOW     │
    │  (Tests PASS)       │   │  (Tests FAIL)       │
    │                     │   │                     │
    │ ├─ Dependencies     │   │ ├─ Dependencies     │
    │ ├─ Migrations       │   │ ├─ Migrations       │
    │ ├─ Tests            │   │ ├─ Tests ❌         │
    │ └─ Coverage Report  │   │ └─ Notify Developer │
    └─────────────┬───────┘   └─────────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────┐
    │  4. Review & Merge PR to main   │
    │     (git merge --no-ff)         │
    └─────────────┬───────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────────────┐
    │  🚀 CD WORKFLOW TRIGGERED (Auto)        │
    │  (on: push branches: [main])            │
    └──────────────┬────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
    ┌──────────────────┐   ┌──────────────────┐
    │  ✅ CD SUCCESS   │   │  ❌ CD FAILURE   │
    │                  │   │                  │
    │ ├─ Tests Pass    │   │ ├─ Tests Fail    │
    │ ├─ Build Success │   │ ├─ Build Fails   │
    │ ├─ Deploy OK     │   │ └─ Abort Deploy  │
    │ └─ Health Check  │   │                  │
    └──────────────────┘   └──────────────────┘
       │                       │
       ▼                       ▼
    Railway.app             Notifikasi Email
    Production              & GitHub UI
```

---

## Skenario Berhasil

### 1️⃣ CI Workflow Success (Pull Request)

**Kondisi:**
- Kode yang push melalui PR tidak memiliki syntax errors
- Semua tests berjalan dengan sukses
- Database migrations berhasil
- Coverage report generated

**Output yang diharapkan:**
```
✅ All checks have passed
   ├─ Checkout code                          PASS
   ├─ Setup Node.js 22                      PASS
   ├─ Install dependencies                   PASS
   ├─ Run database migrations                PASS
   ├─ Run tests                              PASS
   └─ Generate coverage report               PASS

Total time: ~2-3 minutes
```

**Log Example:**
```
📦 Install dependencies
   npm ci
   added 293 packages in 4s

🗄️ Run database migrations
   ✓ 1700000001_create-table-users.js
   ✓ 1700000002_create-table-authentications.js
   ✓ 1700000003_create-table-threads.js
   ✓ 1700000004_create-table-comments.js
   ✓ 1700000005_create-table-replies.js
   ✓ 1700000006_create-table-comment-likes.js

🧪 Run tests
   ✓ Users (15 tests)
   ✓ Authentications (20 tests)
   ✓ Threads (18 tests)
   ✓ Comments (22 tests)
   ✓ Replies (16 tests)
   ✓ Comment Likes (8 tests)
   ──────────────────
   Total: 99 tests PASSED

📊 Coverage Report
   Statements   : 95.5%
   Branches     : 92.3%
   Functions    : 96.1%
   Lines        : 95.8%
```

**Tindakan lanjutan:**
- PR dapat di-merge ke `main`
- Siap untuk review dari maintainer

---

### 2️⃣ CD Workflow Success (Deployment to Production)

**Kondisi:**
- PR sudah di-merge ke branch `main`
- Semua CI tests pass
- Deployment ke Railway.app berhasil

**Output yang diharapkan:**
```
✅ Deployment completed successfully
   ├─ Checkout code                          PASS
   ├─ Setup Node.js 22                      PASS
   ├─ Install dependencies                   PASS
   ├─ Run database migrations (test)         PASS
   ├─ Run tests                              PASS
   ├─ Generate coverage report               PASS
   ├─ Deploy to Railway.app                  PASS
   └─ Health check                           PASS

✨ Live URL: https://forum-api-production-decc.up.railway.app/
Total time: ~4-5 minutes
```

**Log Example:**
```
🚀 Deploy to Railway.app
   Connecting to Railway.app...
   Building application...
   Installing dependencies...
   Running migrations on production database...
   Starting application...
   
   ✅ Deployment status: SUCCESS
   Environment: production
   Replicas: 1
   Status: Running

🔍 Health check
   Checking endpoint: https://forum-api-production-decc.up.railway.app/
   HTTP Status: 200 OK ✅
   Response time: 145ms
```

**Verifikasi di Railway.app Dashboard:**
```
Application: forum-api
Status: ✅ Active
Region: US
Deployment: Latest (just now)
Uptime: 99.9%
Memory: 512 MB
CPU: 1 vCPU
```

**Postman Test Result:**
```
✅ POST /users (Register)              PASS  - 201 Created
✅ POST /authentications (Login)       PASS  - 201 Created
✅ POST /threads (Create Thread)       PASS  - 201 Created
✅ GET /threads/:id (Get Thread)       PASS  - 200 OK
✅ POST /comments (Add Comment)        PASS  - 201 Created
✅ PUT /comments/:id/likes (Like)      PASS  - 200 OK
✅ DELETE /authentications (Logout)    PASS  - 200 OK
```

---

## Skenario Gagal

### 1️⃣ CI Workflow Failure (Test Failures)

**Kondisi:**
- Kode yang di-push memiliki test failures
- Database migrations error
- Syntax errors dalam kode

**Output yang diharapkan:**
```
❌ Workflow failed
   ├─ Checkout code                          PASS
   ├─ Setup Node.js 22                      PASS
   ├─ Install dependencies                   PASS
   ├─ Run database migrations                PASS
   ├─ Run tests                              ❌ FAIL
   └─ Generate coverage report               SKIPPED

Error message: Some tests failed
Total time: ~2-3 minutes
```

**Log Example:**
```
🧪 Run tests
   FAIL src/Applications/use_case/__test__/AddThreadUseCase.test.js

   ● AddThreadUseCase › should throw InvalidThreadTitle when title is empty

   Expected: InvariantError
   Received: title_not_provided_error

   Tests: 98 passed, 1 failed out of 99

❌ Test suite failed!
```

**GitHub UI:**
- Red ❌ badge di PR
- Comment otomatis menampilkan test failures
- PR tidak bisa di-merge tanpa resolve conflicts

**Tindakan yang diperlukan:**
1. Developer menerima notifikasi failure
2. Lihat details log di GitHub Actions
3. Fix code dan push kembali
4. CI workflow akan re-run otomatis

---

### 2️⃣ CD Workflow Failure (Deployment Issues)

**Skenario A: Tests gagal pada CD**
```
❌ CD Workflow failed at test phase
   ├─ Checkout code                          PASS
   ├─ Setup Node.js 22                      PASS
   ├─ Install dependencies                   PASS
   ├─ Run database migrations                PASS
   ├─ Run tests                              ❌ FAIL
   ├─ Generate coverage report               SKIPPED
   └─ Deploy to Railway.app                  SKIPPED (not needed step reached)

Deployment: ABORTED (because tests failed)
```

**Skenario B: Database migrations error**
```
❌ CD Workflow failed at migration phase
   ├─ Checkout code                          PASS
   ├─ Setup Node.js 22                      PASS
   ├─ Install dependencies                   PASS
   ├─ Run database migrations                ❌ FAIL
   ├─ Run tests                              SKIPPED
   ├─ Generate coverage report               SKIPPED
   └─ Deploy to Railway.app                  SKIPPED

Log:
Error: relation "users" already exists
Migration: 1700000001_create-table-users.js failed

Deployment: ABORTED
```

**Skenario C: Railway.app deployment error**
```
❌ CD Workflow failed at deployment phase
   ├─ Checkout code                          PASS
   ├─ Setup Node.js 22                      PASS
   ├─ Install dependencies                   PASS
   ├─ Run database migrations                PASS
   ├─ Run tests                              PASS
   ├─ Generate coverage report               PASS
   ├─ Deploy to Railway.app                  ❌ FAIL
   └─ Health check                           SKIPPED

Log:
Error: Authentication failed
RAILWAY_TOKEN: Invalid or expired token

Deployment: FAILED
Production: Still running previous version
```

**GitHub Notification:**
```
❌ Deployment failed!
Author: @developer
Commit: abc1234
Branch: main

Check logs: https://github.com/username/forum-api/actions/runs/12345
Environment: production
Status: DEPLOYMENT FAILED
```

**Tindakan yang diperlukan:**
1. Check logs di GitHub Actions
2. Identify root cause (tests/migrations/secrets/network)
3. Fix dan push kembali
4. CD workflow akan re-run pada push berikutnya
5. Production tetap di version sebelumnya (safe)

---

## Konfigurasi Secrets

Untuk CI/CD workflow berjalan dengan baik, Anda perlu mengatur **GitHub Secrets** di Settings > Secrets and variables > Actions.

### Required Secrets untuk CD Workflow:

| Secret Name | Deskripsi | Contoh |
|------------|-----------|--------|
| `RAILWAY_TOKEN` | Railway.app API token | `eyJhbGciOi...` |
| `RAILWAY_PGHOST` | Database host di Railway | `postgres.railway.internal` |
| `RAILWAY_PGPORT` | Database port | `5432` |
| `RAILWAY_PGUSER` | Database username | `postgres` |
| `RAILWAY_PGPASSWORD` | Database password | `your-secure-password` |
| `RAILWAY_PGDATABASE` | Database name | `forumapi` |
| `ACCESS_TOKEN_KEY` | JWT secret key | `supersecret123...` |
| `REFRESH_TOKEN_KEY` | JWT refresh key | `anothersecret456...` |

### Cara Setup Secrets:
1. Buka repository di GitHub
2. Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Input secret name dan value
5. Click "Add secret"

**⚠️ PENTING:**
- Jangan commit secrets ke repository
- Gunakan `.env` hanya untuk local development
- Railway.app secrets harus di-set di Railway dashboard

---

## Monitoring & Troubleshooting

### 1️⃣ Cek Status Workflow di GitHub

**Link:** `https://github.com/username/forum-api/actions`

**Informasi yang ditampilkan:**
```
Workflow runs (recent):
├─ "Add feature X" by @dev1
│  ├─ Status: ✅ All checks passed
│  ├─ CI: PASS (2m 30s)
│  ├─ CD: PASS (4m 15s)
│  └─ Commit: abc1234
│
├─ "Fix bug Y" by @dev2
│  ├─ Status: ❌ Some checks failed
│  ├─ CI: FAIL (test suite)
│  ├─ CD: SKIPPED
│  └─ Commit: def5678
│
└─ "Update docs" by @dev3
   ├─ Status: ⏳ In progress
   ├─ CI: Running (1m 45s)
   └─ Commit: ghi9012
```

### 2️⃣ Common Issues & Solutions

**Issue: "RAILWAY_TOKEN not found"**
```
Error: RAILWAY_TOKEN is not set in GitHub Secrets
Solution:
1. Go to GitHub Settings > Secrets and variables > Actions
2. Add RAILWAY_TOKEN from Railway.app dashboard
3. Push new commit to trigger CD workflow
```

**Issue: "Database migration failed"**
```
Error: relation "users" already exists
Solution:
1. Check if migration was already applied
2. Verify production database state
3. Reset migration if needed (contact Railway support)
4. Fix migration script and try again
```

**Issue: "502 Bad Gateway on production"**
```
Error: Application failed to respond
Solution:
1. Check Railway.app logs: Railway dashboard > Logs
2. Verify environment variables are set
3. Check database connectivity
4. Restart deployment in Railway dashboard
5. If persists, rollback to previous version
```

**Issue: "Tests timeout"**
```
Error: Test suite exceeded timeout
Solution:
1. Database service might be slow
2. Increase timeout in vitest.config.js
3. Check GitHub Actions runner performance
4. Optimize slow tests
```

### 3️⃣ Health Check Endpoint

```bash
# Check if API is running
curl -i https://forum-api-production-decc.up.railway.app/

# Expected response
HTTP/2 404
Content-Type: application/json

{
  "status": "fail",
  "message": "Route tidak ditemukan"
}
# Note: 404 adalah normal karena root path "/" belum ada handler
#       Tapi server responded = server berjalan ✅

# Check dengan endpoint yang ada
curl -i https://forum-api-production-decc.up.railway.app/threads

# Expected response
HTTP/2 401
Content-Type: application/json

{
  "status": "fail",
  "message": "Missing authentication"
}
# 401 adalah normal = server berjalan, hanya butuh auth token ✅
```

### 4️⃣ Monitoring Dashboard

**Railway.app Dashboard:**
- Deployment history
- Environment variables
- Logs (real-time)
- Metrics (CPU, Memory, Network)
- Rollback option

**GitHub Actions Dashboard:**
- Workflow runs
- Test results
- Deployment status
- Logs & artifacts

---

## Best Practices

✅ **DO:**
- Write comprehensive tests
- Keep secrets secure in GitHub Secrets
- Review PR before merging
- Monitor deployment logs
- Use descriptive commit messages

❌ **DON'T:**
- Commit `.env` file
- Hardcode secrets in code
- Merge failing PR to main
- Change migration files after deployed
- Directly modify production database

---

## Referensi

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway.app Documentation](https://docs.railway.app)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js & Express Documentation](https://expressjs.com/)

---

**Last Updated:** April 25, 2026
**Status:** ✅ Active & Maintained
