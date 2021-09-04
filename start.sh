#!/bin/bash

apk update
apk upgrade

npm install

nodemon index.js