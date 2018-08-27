#!/usr/bin/bash
request=$1
car=0
truck=0
cat=0
dog=0

IFS=$'\n'
for line in $(echo $request | grep -o -E "[0-9]+ [a-zA-Z]+"); do
    if [[ $line =~ "car" ]]; then
        car=$(echo $line | cut -d ' ' -f 1)
    elif [[ $line =~ "truck" ]]; then
        truck=$(echo $line | cut -d ' ' -f 1)
    elif [[ $line =~ "cat" ]]; then
        cat=$(echo $line | cut -d ' ' -f 1)
    elif [[ $line =~ "dog" ]]; then
        dog=$(echo $line | cut -d ' ' -f 1)
    fi
done

car=$((car > 4 ? 4 : car))
truck=$((truck > 4 ? 4 : truck))
cat=$((cat > 4 ? 4 : cat))
dog=$((dog > 4 ? 4 : dog))

echo "$car,$truck,$cat,$dog"
