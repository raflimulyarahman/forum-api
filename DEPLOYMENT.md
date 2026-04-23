# Forum API - Deployment Guide

## Persyaratan Deployment

- Server dengan OS Linux (Ubuntu 20.04 LTS atau lebih baru)
- Node.js LTS v22.x
- PostgreSQL 12 atau lebih baru
- NGINX 1.18 atau lebih baru
- PM2 (untuk process management)
- SSH access ke server

## Pre-Deployment Checklist

- [ ] Repository bersifat public
- [ ] Semua dependencies sudah di-install: `npm install`
- [ ] Database sudah dibuat untuk production dan test
- [ ] Environment variables sudah dikonfigurasi
- [ ] SSL/TLS certificates sudah diperoleh
- [ ] GitHub Actions secrets sudah di-setup
- [ ] NGINX sudah terinstall dan dikonfigurasi
- [ ] PM2 sudah terinstall

## Step-by-Step Deployment

### 1. Server Setup

```bash
# Login ke server
ssh user@server-ip

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y build-essential postgresql postgresql-contrib nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Create production database
CREATE DATABASE forumapi;
CREATE USER forum_user WITH PASSWORD 'your_secure_password';
ALTER ROLE forum_user SET client_encoding TO 'utf8mb4';
ALTER ROLE forum_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE forum_user SET default_transaction_deferrable TO on;
ALTER ROLE forum_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE forumapi TO forum_user;

# Create test database
CREATE DATABASE forumapi_test;
GRANT ALL PRIVILEGES ON DATABASE forumapi_test TO forum_user;

# Exit psql
\q
```

### 3. Clone & Setup Repository

```bash
# Create app directory
sudo mkdir -p /app/forum-api
sudo chown $USER:$USER /app/forum-api

# Clone repository
cd /app/forum-api
git clone https://github.com/raflimulyarahman/forum-api.git .

# Install dependencies
npm ci

# Create .env file
cat > .env << EOF
# HTTP SERVER
HOST=0.0.0.0
PORT=5000

# POSTGRES
PGHOST=localhost
PGPORT=5432
PGUSER=forum_user
PGPASSWORD=your_secure_password
PGDATABASE=forumapi

# POSTGRES TEST
PGHOST_TEST=localhost
PGPORT_TEST=5432
PGUSER_TEST=forum_user
PGPASSWORD_TEST=your_secure_password
PGDATABASE_TEST=forumapi_test

# TOKENIZE
ACCESS_TOKEN_KEY=your_super_secret_access_token_key_here_123456789
REFRESH_TOKEN_KEY=your_super_secret_refresh_token_key_here_987654321
ACCESS_TOKEN_AGE=3000
EOF

# Verify .env permissions
chmod 600 .env

# Run migrations
npm run migrate up
```

### 4. NGINX Configuration

```bash
# Copy NGINX config
sudo cp nginx.conf /etc/nginx/sites-available/forum-api

# Enable site
sudo ln -s /etc/nginx/sites-available/forum-api /etc/nginx/sites-enabled/forum-api

# Disable default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Test NGINX configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx

# Enable NGINX on startup
sudo systemctl enable nginx
```

### 5. SSL/TLS Certificate Setup

Option A: Let's Encrypt (Recommended)
```bash
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf dengan path certificate
# ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Option B: Self-Signed Certificate (Development)
```bash
# Generate certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/forum-api.key \
  -out /etc/nginx/ssl/forum-api.crt
```

### 6. PM2 Setup

```bash
# Start application with PM2
pm2 start src/app.js --name forum-api --env production

# Configure auto-restart on server reboot
pm2 startup
pm2 save

# Setup PM2 log rotation
pm2 install pm2-logrotate

# View logs
pm2 logs forum-api

# Monitor application
pm2 monit
```

### 7. GitHub Actions Configuration

Tambahkan GitHub Secrets untuk CD workflow:

```
DEPLOY_SSH_KEY: -----BEGIN RSA PRIVATE KEY-----
                (private SSH key content)
                -----END RSA PRIVATE KEY-----

SERVER_HOST: your.server.ip.address
SERVER_USER: deployment_user
```

## Post-Deployment Verification

```bash
# Check application status
pm2 status

# Check NGINX status
sudo systemctl status nginx

# Test HTTPS connection
curl -I https://yourdomain.com/users

# Check logs
tail -f /app/forum-api/app.log
sudo tail -f /var/log/nginx/forum_api_error.log
sudo tail -f /var/log/nginx/forum_api_access.log

# Verify database connection
psql -U forum_user -d forumapi -c "SELECT VERSION();"

# Check rate limiting
for i in {1..100}; do curl https://yourdomain.com/threads; done
```

## Monitoring & Maintenance

### Application Monitoring
```bash
# Using PM2
pm2 monitor

# Using PM2 Plus (optional)
pm2 web
# Access at http://localhost:9615
```

### Database Backup
```bash
# Backup database
pg_dump -U forum_user forumapi > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U forum_user forumapi < backup.sql
```

### SSL Certificate Renewal
```bash
# Manual renewal
sudo certbot renew

# Check renewal status
sudo certbot renew --dry-run
```

### Update Application
```bash
# Pull latest changes
cd /app/forum-api
git pull origin main

# Install updated dependencies
npm ci

# Run migrations
npm run migrate up

# Restart application
pm2 restart forum-api
```

## Troubleshooting

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs forum-api

# Check application directly
npm start

# Check Node.js version
node --version

# Check PORT availability
sudo lsof -i :5000
```

### NGINX Issues
```bash
# Test configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/forum_api_error.log

# Reload configuration
sudo systemctl reload nginx
```

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U forum_user -d forumapi -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Rate Limiting Not Working
```bash
# Check NGINX configuration
sudo nginx -T | grep -A 10 "limit_req"

# Reload NGINX
sudo systemctl reload nginx

# Test rate limit
ab -n 200 -c 10 https://yourdomain.com/threads
```

### SSL Certificate Issues
```bash
# Verify certificate
openssl x509 -in /etc/nginx/ssl/forum-api.crt -noout -text

# Check expiration date
openssl x509 -in /etc/nginx/ssl/forum-api.crt -noout -dates

# Verify certificate chain
openssl s_client -connect yourdomain.com:443 -showcerts
```

## Performance Optimization

### Enable Gzip Compression
Already configured in nginx.conf - no action needed.

### Connection Pooling
PostgreSQL connection pooling dapat ditambahkan menggunakan PgBouncer jika diperlukan untuk high-traffic scenarios.

### Caching
Consider adding Redis untuk caching layer jika diperlukan performance improvement lebih lanjut.

### Load Balancing
Untuk horizontal scaling, setup multiple Forum API instances dengan load balancer di depan NGINX.

## Security Hardening

- [x] HTTPS/TLS encryption
- [x] Rate limiting
- [x] Security headers di NGINX
- [x] Input validation di application
- [x] JWT token-based authentication
- [x] Password hashing dengan bcrypt
- [ ] Additional: Setup WAF (Web Application Firewall) dengan ModSecurity
- [ ] Additional: Implement DDoS protection dengan services seperti Cloudflare
- [ ] Additional: Setup intrusion detection dengan Fail2Ban

## References

- [Node.js Deployment Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
