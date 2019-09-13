#!/bin/bash

apk update
apk upgrade
apk add --no-cache udev ttf-freefont chromium

npm install

nodemon index.js