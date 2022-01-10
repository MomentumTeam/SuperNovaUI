#!/bin/sh

cat /usr/share/.env | while read line; do
    IFS='=' set -- $line
    stringField='"'$1'": ""'
    fieldValue=printenv $1
    stringFieldNew='"'$1'": "'$fieldValue'"'
    sed -i "s/${stringField}/${stringFieldNew}g" /usr/share/nginx/html/env.js
done