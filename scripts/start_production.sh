#!/bin/sh

export ENVIRONMENT=production
./node_modules/.bin/pm2 start -f ./server/app.js