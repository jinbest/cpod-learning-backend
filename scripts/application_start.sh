#!/bin/bash

# Stop all servers and start the server as a daemon
sudo pm2 stop all
sudo pm2 start /home/ubuntu/chinesepod.com/server.js -i 0 -- --prod
sudo pm2 save
