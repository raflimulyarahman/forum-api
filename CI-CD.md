# Forum API - CI/CD Documentation

## Continuous Integration (CI)

### Overview
Forum API menggunakan GitHub Actions untuk automated testing pada setiap pull request ke branch `main`. Workflow CI memastikan bahwa semua kode yang akan di-merge sudah melalui pengujian komprehensif.

### Workflow File
- Location: `.github/workflows/ci.yml`
- Trigger: Pull request ke branch `main`
- Database: PostgreSQL 15 service container

### CI Pipeline Steps

```
1. Checkout code
   ↓
2. Setup Node.js (v22)
   ↓
3. Cache npm dependencies
   ↓
4. Install dependencies
   ↓
5. Run database migrations (test)
   ↓
6. Run tests
   ↓
7. Generate coverage report
```

### What Gets Tested

- **Unit Tests**: Business logic dan domain entities
- **Integration Tests**: Repository dan database interactions
- **Functional Tests**: HTTP endpoints dan complete workflows

Tests mencakup:
- User registration dan authentication
- Thread creation dan retrieval
- Comment operations (create, delete, like)
- Reply operations (create, delete)
- Rate limiting behavior
- Error handling

### Triggering CI

CI automatically triggered ketika:
1. Pull request dibuat ke branch `main`
2. Commit dipush ke pull request yang sudah ada
3. Pull request di-update

### CI Success Criteria

Workflow dianggap **PASSED** jika:
- [ ] Semua npm dependencies berhasil di-install
- [ ] Database migrations berhasil di-run
- [ ] Semua tests berhasil dijalankan (tidak ada failure)
- [ ] Coverage report berhasil di-generate

Workflow dianggap **FAILED** jika:
- [ ] Salah satu test gagal
- [ ] Database migration gagal
- [ ] Dependencies tidak bisa di-install
- [ ] JavaScript/syntax errors ditemukan

## Continuous Deployment (CD)

### Overview
Forum API menggunakan GitHub Actions untuk automated deployment ke production server pada setiap push ke branch `main`. Workflow CD hanya berjalan jika CI tests berhasil.

### Workflow File
- Location: `.github/workflows/cd.yml`
- Trigger: Push ke branch `main` (setelah CI passed)
- Deployment Target: EC2 instance atau server lain
- Deployment Method: SSH

### CD Pipeline Steps

```
1. Build Job (same as CI)
   ├─ Checkout code
   ├─ Setup Node.js
   ├─ Install dependencies
   ├─ Run migrations
   └─ Run tests
   ↓
2. Deploy Job (requires build job to pass)
   ├─ Configure SSH key
   ├─ Add server to known hosts
   ├─ SSH into server
   ├─ Pull latest code
   ├─ Install dependencies
   ├─ Run migrations
   └─ Restart application
```

### GitHub Secrets Configuration

Untuk CD workflow berfungsi, setup secrets berikut di GitHub:

```
DEPLOY_SSH_KEY
  - Private SSH key untuk server authentication
  - Generate: ssh-keygen -t rsa -b 4096
  - Format: -----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----

SERVER_HOST
  - IP address atau hostname server
  - Example: 192.168.1.100 atau api.example.com

SERVER_USER
  - Username untuk SSH login
  - Example: deploy atau ubuntu
```

### Setup Steps

1. **Generate SSH Key Pair**
```bash
ssh-keygen -t rsa -b 4096 -C "forum-api-deploy" -f forum_api_deploy
# Output: forum_api_deploy (private), forum_api_deploy.pub (public)
```

2. **Setup SSH Access ke Server**
```bash
# Copy public key ke server authorized_keys
ssh-copy-id -i forum_api_deploy.pub deploy@server-ip
# Or manually:
cat forum_api_deploy.pub >> ~/.ssh/authorized_keys
```

3. **Add Secrets ke GitHub Repository**
   - Go to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add 3 secrets:
     - Name: `DEPLOY_SSH_KEY`, Value: (isi dari file `forum_api_deploy`)
     - Name: `SERVER_HOST`, Value: (IP atau hostname server)
     - Name: `SERVER_USER`, Value: (username untuk SSH)

4. **Verify SSH Connection**
```bash
ssh -i forum_api_deploy deploy@server-ip "pwd"
# Harus menampilkan home directory tanpa error
```

### CD Success Criteria

Deployment dianggap **SUCCESSFUL** jika:
- [ ] Build job (CI tests) berhasil
- [ ] SSH connection ke server berhasil
- [ ] Git pull latest code berhasil
- [ ] npm ci installation berhasil
- [ ] Database migrations berhasil
- [ ] PM2 restart application berhasil

### CD Failure Scenarios

Deployment akan **FAILED** jika:
- [ ] CI tests gagal
- [ ] SSH authentication gagal
- [ ] Server tidak accessible
- [ ] Git pull gagal (conflict atau branch tidak ada)
- [ ] Database migration gagal
- [ ] Application failed to start

## Monitoring CI/CD

### View Workflow Status

1. **Go to GitHub Actions**
   - Repository → Actions tab
   - Pilih workflow (CI atau CD)
   - Lihat status execution

2. **Workflow Details**
   - Click pada run yang ingin dilihat
   - View logs untuk setiap job
   - Download artifacts jika ada

3. **Status Checks on PR**
   - Pull request akan menampilkan status CI
   - "All checks have passed" = ready to merge
   - "Some checks were not successful" = ada failure

### Troubleshooting CI/CD

#### CI Failed: Tests Tidak Pass

```bash
# Run tests locally untuk debug
npm test

# Run specific test file
npm test -- src/path/to/test.js

# Run tests dengan verbose output
npm test -- --reporter=verbose

# Run tests dengan coverage
npm run test:coverage
```

#### CI Failed: Database Migration Error

```bash
# Check migration files
ls -la migrations/

# Test migration locally
npm run migrate:test up

# Rollback migration
npm run migrate:test down
```

#### CD Failed: SSH Connection Error

```bash
# Test SSH connection
ssh -i forum_api_deploy -v deploy@server-ip

# Check server SSH configuration
sudo nano /etc/ssh/sshd_config
# Pastikan PasswordAuthentication not required

# Verify public key di server
cat ~/.ssh/authorized_keys
```

#### CD Failed: Application Not Starting

```bash
# SSH ke server dan check logs
ssh deploy@server-ip "pm2 logs forum-api"

# Check application status
ssh deploy@server-ip "pm2 status"

# Check port availability
ssh deploy@server-ip "sudo lsof -i :5000"
```

## Best Practices

### For Developers
1. **Run tests locally sebelum push**
   ```bash
   npm test
   npm run test:coverage
   ```

2. **Create feature branch untuk development**
   ```bash
   git checkout -b feature/new-feature
   ```

3. **Push ke GitHub dan create pull request**
   - PR akan trigger CI workflow
   - Review CI logs untuk memastikan tests pass
   - Request code review sebelum merge

4. **Fix CI failures immediately**
   - Jangan merge PR dengan failing tests
   - Push fixes ke branch yang sama
   - CI akan auto-run pada setiap push

### For Maintainers
1. **Review CI results sebelum merge PR**
2. **Ensure all tests pass dan coverage adequate**
3. **Monitor deployment logs setelah merge**
4. **Setup alerts untuk CI/CD failures**

## Advanced Configuration

### Custom Test Command
Edit `.github/workflows/ci.yml` untuk customize test command:
```yaml
- name: Run tests
  run: npm test -- --reporter=verbose
```

### Skip CD Deployment
Untuk PR yang tidak perlu deployment, update kode tanpa merge ke main atau gunakan tag:
```bash
git commit -m "chore: update documentation [skip-cd]"
```

### Conditional Deployment
Untuk deploy hanya branch tertentu, update CD workflow:
```yaml
on:
  push:
    branches:
      - main
      - production
```

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [SSH Key Authentication](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Node.js CI Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#creating-a-dockerfil)
