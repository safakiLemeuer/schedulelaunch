# /etc/nginx/sites-available/gsa.thebhtlabs.com
# After placing this file, run:
#   sudo ln -s /etc/nginx/sites-available/gsa.thebhtlabs.com /etc/nginx/sites-enabled/
#   sudo certbot --nginx -d gsa.thebhtlabs.com
#   sudo nginx -t && sudo systemctl reload nginx

server {
    listen 80;
    server_name gsa.thebhtlabs.com;

    # Certbot will modify this block to add SSL redirect
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name gsa.thebhtlabs.com;

    # SSL certs will be added by Certbot
    # ssl_certificate /etc/letsencrypt/live/gsa.thebhtlabs.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/gsa.thebhtlabs.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js app
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    client_max_body_size 10M;
}
