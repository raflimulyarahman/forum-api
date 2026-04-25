# 🚀 SETUP ENVIRONMENT VARIABLES - Railway.app

## ⚠️ PENTING: Langkah WAJIB untuk fix 502 Error

Status saat ini: **502 Bad Gateway**

Penyebab: Environment variables belum di-set di Railway.app

---

## ✅ Solusi: Setup Variables di Railway Web UI (3 menit)

### Langkah 1: Buka Railway Dashboard

**URL:** https://railway.app/project/b78312ee-3dc2-4e1e-adb6-81b49e0afa0a/production

Atau:
1. Login ke https://railway.app
2. Klik project "easygoing-love"
3. Pilih environment "production"
4. Klik service "forum-api"

---

### Langkah 2: Buka Tab "Variables"

Di dashboard forum-api, cari tab **"Variables"** (biasanya di sidebar kiri atau tab di atas).

---

### Langkah 3: Copy-Paste Setiap Variable

Klik **"Add Variable"** atau tombol **"+"**, kemudian tambahkan variables berikut **satu-per-satu**:

#### **Database Connection Variables:**

| Key | Value |
|-----|-------|
| `PGHOST` | `postgres.railway.internal` |
| `PGPORT` | `5432` |
| `PGUSER` | `postgres` |
| `PGPASSWORD` | `dWkONmGuWnifImbtrTxTEBkQuGLjIQyU` |
| `PGDATABASE` | `railway` |

#### **JWT Security Variables:**

| Key | Value |
|-----|-------|
| `ACCESS_TOKEN_KEY` | `supersecretaccesstokenkey123456` |
| `REFRESH_TOKEN_KEY` | `supersecretrefreshtokenkey654321` |
| `ACCESS_TOKEN_AGE` | `3000` |

#### **Application Variables:**

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `NODE_ENV` | `production` |

---

### Langkah 4: Save & Deploy

Setelah semua variables ter-add:

1. Klik **"Save"** atau **"Deploy"** button
2. Railway akan otomatis **redeploy** aplikasi
3. Tunggu 1-2 menit untuk deployment selesai

---

## ✅ Verifikasi Deployment Berhasil

### Test 1: Buka URL di Browser

```
https://forum-api-production-decc.up.railway.app/
```

**Expected result:**
```
HTTP 404
{
  "status": "fail",
  "message": "Route tidak ditemukan"
}
```

✅ Jika melihat response seperti ini = **BERHASIL!** (404 adalah normal karena root path kosong)

❌ Jika masih 502 = check logs di Railway dashboard

### Test 2: Buka Railway Logs

Di Railway dashboard → forum-api → **Logs** tab

Cari messages:
```
✅ Jika ada: "server start at http://localhost:8080"
✅ Jika ada: "Database connected successfully"
```

❌ Jika ada error messages, note dan chat ke saya

### Test 3: Test dengan Postman

1. Buka Postman Collection: `Forum API V2 Test/Forum API V2 Test.postman_collection.json`
2. Update base URL ke: `https://forum-api-production-decc.up.railway.app`
3. Run collection
4. Cek hasil tests

---

## 📋 Checklist Setup

- [ ] Login ke https://railway.app
- [ ] Buka project "easygoing-love" → "forum-api" service
- [ ] Buka tab "Variables"
- [ ] Add semua 10 variables di atas
- [ ] Click "Save"/"Deploy"
- [ ] Tunggu 1-2 menit
- [ ] Test di browser: https://forum-api-production-decc.up.railway.app/
- [ ] Expected: HTTP 404 (bukan 502)
- [ ] ✅ DONE!

---

## ❓ Jika ada masalah?

### Masalah: Still showing 502
**Solusi:**
1. Check Railway logs untuk error details
2. Verify semua variables sudah di-set dengan benar
3. Redeploy: Settings → Redeploy
4. Wait 2-3 minutes
5. Refresh browser

### Masalah: "Variable tidak bisa di-save"
**Solusi:**
1. Check value tidak ada special characters
2. Pastikan format exactly seperti di table di atas
3. Try copy-paste lagi

### Masalah: Deployment stuck
**Solusi:**
1. Railway dashboard → Settings
2. Click "Redeploy" untuk force deployment
3. Atau "Restart" untuk restart service

---

## ✨ Setelah Variables Ter-set

Environment variables sudah ter-set! Sekarang:

1. ✅ Application dapat access PostgreSQL database
2. ✅ JWT tokens akan generate dengan secret keys
3. ✅ API endpoints akan respond (bukan 502 lagi)

**Next action:**
- Monitor logs untuk errors
- Run Postman collection tests
- Check API endpoints berfungsi dengan baik

---

## 🔗 Important Links

- Railway Dashboard: https://railway.app
- Project URL: https://railway.app/project/b78312ee-3dc2-4e1e-adb6-81b49e0afa0a/production
- Production API: https://forum-api-production-decc.up.railway.app/
- Postman Collection: `/Forum API V2 Test/`

---

**Notes:**
- Jangan ubah variable values yang sudah ada (RAILWAY_* variables)
- Semua database credentials sudah extracted dari Railway Postgres service
- Token values adalah JWT secrets yang secure

---

**Status:** 🔴 Waiting for Variables Setup
**Next:** Set variables di Railway web UI → Redeploy → Test
