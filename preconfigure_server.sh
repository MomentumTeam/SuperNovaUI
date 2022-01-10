#!/bin/bash

cat .env | while read line; do
    IFS='=' read key value <<< $line
    stringField=`"$key": ""`
    fieldValue=printenv $key
    stringFieldNew=`"$key": $fieldValue`
    sed -i "s/${stringField}/${stringFieldNew}g" /usr/share/nginx/html/env.js
done