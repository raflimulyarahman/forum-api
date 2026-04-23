# Forum API - HTTPS Setup Guide

## Persyaratan HTTPS

Forum API harus diakses melalui protokol HTTPS untuk keamanan data pengguna dan mencegah serangan Man-in-the-Middle (MITM).

## Setup Options

### Option 1: Using Let's Encrypt (Recommended for Production)

Let's Encrypt menyediakan SSL/TLS certificates secara gratis.

#### Prerequisites:
- Domain yang sudah terdaftar
- Server dengan akses ke port 80 dan 443
- Certbot installation

#### Steps:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Certificates akan tersimpan di:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem

# Update nginx.conf dengan path certificate yang benar:
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# Auto-renewal configuration
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Option 2: Using Self-Signed Certificate (Development)

Untuk development atau testing purposes:

```bash
# Generate self-signed certificate (valid for 365 days)
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/forum-api.key \
  -out /etc/nginx/ssl/forum-api.crt \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Forum/CN=api.forum.local"

# Update nginx.conf dengan path certificate
```

### Option 3: Using Subdomain dcdg.xyz (Educational)

Jika menggunakan subdomain yang disediakan:

1. Request subdomain dari administrator
2. Terima certificate yang sudah dikonfigurasi
3. Upload certificate ke server
4. Update nginx.conf dengan path yang sesuai

## NGINX Configuration dengan SSL

File `nginx.conf` sudah dikonfigurasi untuk:
- HTTP to HTTPS redirection (semua request ke port 80 di-redirect ke HTTPS)
- SSL/TLS dengan protokol TLS 1.2 dan 1.3
- Security headers untuk proteksi tambahan
- Rate limiting untuk /threads endpoint (90 requests per minute)

## Deployment Checklist

- [ ] Domain sudah terdaftar dan terkonfigurasi dengan benar
- [ ] SSL Certificate sudah diperoleh dan tersimpan di server
- [ ] NGINX dikonfigurasi dengan path certificate yang benar
- [ ] NGINX reloaded: `sudo systemctl reload nginx`
- [ ] Test HTTPS connection: `curl https://yourdomain.com`
- [ ] Verify SSL grade dengan: https://www.ssllabs.com/ssltest/
- [ ] Forum API dapat diakses melalui HTTPS
- [ ] HTTP requests di-redirect ke HTTPS
- [ ] Postman tests lulus dengan HTTPS URL

## Testing HTTPS Connection

```bash
# Test basic connection
curl -I https://yourdomain.com/users

# Test with verbose output
curl -v https://yourdomain.com/users

# Test specific endpoint
curl -X GET https://yourdomain.com/threads/thread-123

# Test rate limiting
for i in {1..100}; do curl https://yourdomain.com/threads; done
```

## Security Best Practices

1. **HSTS (HTTP Strict Transport Security)**: Sudah dikonfigurasi di NGINX dengan 1 tahun max-age
2. **Security Headers**: Sudah include:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin

3. **Certificate Renewal**: Set auto-renewal untuk Let's Encrypt
4. **Strong SSL Configuration**: Hanya TLS 1.2+ yang diperbolehkan

## Troubleshooting

### Certificate Error
```bash
# Verify certificate validity
openssl x509 -in /path/to/certificate.crt -noout -text

# Check certificate expiration
openssl x509 -in /path/to/certificate.crt -noout -dates
```

### NGINX Configuration Error
```bash
# Test NGINX configuration
sudo nginx -t

# View NGINX error logs
sudo tail -f /var/log/nginx/forum_api_error.log

# Reload NGINX
sudo systemctl reload nginx
```

### Rate Limiting Issues
Jika terjadi 429 Too Many Requests:
- Tunggu 1 menit sebelum melakukan request lagi
- Rate limit: 90 requests per minute untuk /threads
- Adjust di nginx.conf jika diperlukan: `rate=1.5r/s;`

## References

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [NGINX SSL Configuration](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [SSL Labs Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)
