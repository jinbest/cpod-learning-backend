#!/bin/bash

# Install node.js
sudo apt-get install python-software-properties -y
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get update
sudo apt-get install nodejs -y

# Install nodemon
# sudo npm install nodemon -g

# Install forever module
# https://www.npmjs.com/package/forever
# sudo npm install forever -g

# Install pm2 module
sudo npm install pm2 -g

# Install nginx
sudo apt-get install -y nginx

# Install sails globally
sudo npm install sails -g

# Clean working folder
# sudo find /home/ubuntu/test -type f -delete
