#!/bin/bash

mkdir /home/ubuntu/nodejs
cd /home/ubuntu/nodejs

sudo npm install

sudo cp /home/ubuntu/nodejs/scripts/nginx /etc/nginx/sites-available/default
sudo systemctl restart nginx
