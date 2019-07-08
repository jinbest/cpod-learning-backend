#!/bin/bash

mkdir /home/ubuntu/nodejs
cd /home/ubuntu/nodejs

# Install dependancies
sudo npm install

# Setup nginx
sudo cp /home/ubuntu/nodejs/scripts/nginx /etc/nginx/sites-available/default
sudo systemctl restart nginx
