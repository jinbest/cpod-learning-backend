#!/bin/bash

cd /home/ubuntu/nodejs

# Install dependencies
sudo npm install

# sudo pm2 start /home/ubuntu/chinesepod.com/app.js --wait-ready --listen-timeout 10000 -- --prod

# Setup nginx
sudo cp /home/ubuntu/chinesepod.com/scripts/nginx /etc/nginx/sites-available/default
sudo systemctl restart nginx
