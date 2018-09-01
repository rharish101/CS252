#!/bin/bash
request=$1  #Assumed to be raw

IFS=$'\n'
arr=("car" "truck" "cat" "dog")
count=0
for num in $(./scripts/parser.sh "$request"); do
    while (( $num > 0 )); do
        echo "./${arr[$count]}$num.jpg"
        num=$((num-1))
    done
    count=$((count+1))
done
