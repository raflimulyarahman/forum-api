# 📌 CI/CD Quick Reference Card

## Status Dashboard

| Component | Status | Link |
|-----------|--------|------|
| **Continuous Integration** | ✅ Active | [GitHub Actions CI](https://github.com/YOUR_REPO/actions/workflows/ci.yml) |
| **Continuous Deployment** | ✅ Configured | [GitHub Actions CD](https://github.com/YOUR_REPO/actions/workflows/cd.yml) |
| **Production API** | ⚠️ 502 Error | [https://forum-api-production-decc.up.railway.app/](https://forum-api-production-decc.up.railway.app/) |
| **Railway Dashboard** | ✅ Connected | [https://railway.app](https://railway.app) |

---

## 🚦 Workflow Triggers

### ✅ CI Workflow (Pull Requests)
```bash
# Triggered when:
- Push to feature branch
- Create Pull Request to 'main'
- Push commit to PR

# What it does:
1. Setup Node.js environment
2. Install dependencies
3. Run database migrations
4. Run all tests
5. Generate coverage report

# Duration: ~2-3 minutes
```

### 🚀 CD Workflow (Deployments)
```bash
# Triggered when:
- Merge PR to 'main'
- Push directly to 'main'

# What it does:
1. Run all CI tests
2. Deploy to Railway.app (if tests pass)
3. Run health checks
4. Generate deployment summary

# Duration: ~4-5 minutes
```

---

## 📋 Common Commands

### Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run start:dev

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Database migrations (local)
npm run migrate

# Database migrations (test)
npm run migrate:test
```

### GitHub / Git
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Push to remote
git push origin feature/your-feature-name

# Check CI/CD status
# Go to: https://github.com/YOUR_REPO/actions

# View workflow logs
# Click on workflow run → Click on job → View logs
```

### Railway.app Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy manually
railway up

# View logs
railway logs

# Set environment variable
railway variables set VAR_NAME=value
```

---

## 🎯 Quick Troubleshooting

### CI Tests Failing
```
1. Check the error message in GitHub Actions log
2. Run tests locally: npm test
3. Fix the issue
4. Push new commit
5. CI will re-run automatically
```

### 502 Bad Gateway on Production
```
1. Go to Railway Dashboard
2. Check service logs for errors
3. Verify environment variables are set
4. Check database connectivity
5. Redeploy from Railway dashboard
```

### Deployment Won't Start
```
1. Check that all tests pass in CI
2. Verify Railway environment variables
3. Check if application port is 8080
4. Look at Railway logs for startup errors
```

### Database Migration Error
```
1. Check migration files
2. Verify database state
3. Revert migration if needed
4. Fix and redeploy
```

---

## 📊 Expected Test Output

### ✅ Successful Test Run
```
PASS src/Applications/use_case/__test__/AddUserUseCase.test.js (2.45s)
PASS src/Applications/use_case/__test__/LoginUserUseCase.test.js (1.89s)
PASS src/Applications/use_case/__test__/AddThreadUseCase.test.js (2.12s)
PASS src/Applications/use_case/__test__/AddCommentUseCase.test.js (1.95s)
PASS src/Applications/use_case/__test__/AddReplyUseCase.test.js (1.76s)
PASS src/Applications/use_case/__test__/LikeCommentUseCase.test.js (1.54s)

Test Files  6 passed (6)
     Tests  99 passed (99)
Start at   14:30:45
Duration   15.34s

✅ All tests passed
```

### ❌ Failed Test Run
```
FAIL src/Applications/use_case/__test__/AddThreadUseCase.test.js

● AddThreadUseCase › should throw InvalidThreadTitle when title is empty

Expected: InvariantError
Received: TypeError

Test Files  5 passed, 1 failed (6)
     Tests  98 passed, 1 failed (99)

❌ Fix the error and try again
```

---

## 🔐 Required GitHub Secrets (Optional for Railway)

If using traditional SSH deployment, set these in GitHub Secrets:
```
DEPLOY_SSH_KEY          - Private SSH key
SERVER_HOST             - Server IP/hostname
SERVER_USER             - SSH username
```

**Note:** For Railway.app, these are NOT needed. Railway auto-deploys based on GitHub integration.

---

## 📈 Monitoring Checklist

- [ ] Check GitHub Actions after every commit
- [ ] Monitor Railway.app logs for errors
- [ ] Verify production API is responding (no 502)
- [ ] Test API endpoints with Postman
- [ ] Check database connectivity
- [ ] Monitor server CPU/Memory usage
- [ ] Review deployment history

---

## 🔗 Important Links

| Resource | Link |
|----------|------|
| GitHub Actions | https://github.com/YOUR_REPO/actions |
| CI Workflow Log | https://github.com/YOUR_REPO/actions/workflows/ci.yml |
| CD Workflow Log | https://github.com/YOUR_REPO/actions/workflows/cd.yml |
| Railway Dashboard | https://railway.app |
| Production API | https://forum-api-production-decc.up.railway.app/ |
| Postman Collection | ./Forum API V2 Test/ |

---

## 📝 Deployment History

### Latest Deployment
- **Date:** [Check Railway Dashboard]
- **Status:** [Check GitHub Actions]
- **Duration:** [~5 minutes]
- **Tests:** [Check logs]

### Rollback (if needed)
1. Go to Railway Dashboard
2. Select deployment history
3. Click "Redeploy" on previous version
4. Wait for redeployment to complete

---

## 🎓 Further Reading

- **[CI/CD Documentation](./CI-CD-DOCUMENTATION.md)** - Comprehensive guide with scenarios
- **[Deployment Guide](./DEPLOYMENT.md)** - Fix 502 error and setup
- **[GitHub Actions Docs](https://docs.github.com/en/actions)**
- **[Railway Docs](https://docs.railway.app)**

---

**Last Updated:** April 25, 2026  
**Created for:** Forum API V2 - Dicoding Backend Expert
