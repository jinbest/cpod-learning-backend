#!/bin/bash

# Stop all servers and start the server as a daemon
pm2 stop all
pm2 start app.js -i 0 -- --prod
pm2 save
