#!/bin/bash

DOMAIN="neighboraid.is404.net"
EMAIL="koapono@byu.edu"

# Get certificate if it doesn't exist
if [ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  echo "Obtaining SSL certificate for ${DOMAIN}..."
  sudo certbot certonly \
    --nginx \
    -d ${DOMAIN} \
    --non-interactive \
    --agree-tos \
    --email ${EMAIL}
else
  echo "Certificate already exists for ${DOMAIN}"
fi

# Ensure nginx configuration uses the certificate
echo "Configuring nginx for HTTPS..."

# Create the HTTPS configuration
sudo tee /etc/nginx/conf.d/https_custom.conf > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN};
    
    # Allow certbot validation
    location ~ /.well-known {
      allow all;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
      return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN};
    
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    location / {
      proxy_pass http://127.0.0.1:8080;
      proxy_http_version 1.1;
      proxy_set_header Upgrade \$http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host \$host;
      proxy_cache_bypass \$http_upgrade;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto https;
    }
}
EOF

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

# Reload nginx to apply changes
echo "Reloading nginx..."
sudo systemctl reload nginx

echo "SSL configuration complete"
