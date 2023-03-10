#!/bin/bash

npm install -g npm@latest
npm install
npm install -g ember-cli

rm -rf dist/*
ember build --environment $1
