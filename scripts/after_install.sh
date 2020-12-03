#!/bin/bash

cd /home/ubuntu/chinesepod.com

# Install dependencies
sudo npm install

# sudo pm2 start /home/ubuntu/chinesepod.com/server.js --wait-ready --listen-timeout 10000 -- --prod

# Setup nginx
sudo cp /home/ubuntu/chinesepod.com/scripts/nginx /etc/nginx/sites-available/default
sudo cp /home/ubuntu/chinesepod.com/scripts/status /etc/nginx/sites-available/status
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-available/default
sudo ln -s /etc/nginx/sites-available/status /etc/nginx/sites-available/status

sudo systemctl restart nginx
