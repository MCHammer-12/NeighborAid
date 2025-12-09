#!/bin/bash

DOMAIN="neighboraid.is404.net" 
EMAIL="koapono@byu.edu"

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

# Reload nginx to apply certificate
sudo systemctl reload nginx

echo "SSL configuration complete"
