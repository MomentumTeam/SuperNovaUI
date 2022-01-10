#!/bin/bash
cat .env | while read line; do
    IFS='=' read key value <<< $line
    fieldValue=printenv $key
    sed -i "s/${value}/${fieldValue}g" /usr/share/nginx/html/env.js
done