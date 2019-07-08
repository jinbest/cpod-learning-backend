#!/bin/bash

# Stop all servers and start the server as a daemon
sudo pm2 stop all
pm2 start /home/ubuntu/nodejs/app.js -i 0 -- --prod
pm2 save
