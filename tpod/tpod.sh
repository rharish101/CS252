#!/bin/bash

CURDIR=$(pwd)
BASEDIR=$(dirname $0)
ABSPATH=$(readlink -f $0)
ABSDIR=$(dirname $ABSPATH)

rm $ABSDIR/pics/*

wget -O $ABSDIR/tpod.html https://www.pexels.com/popular-photos/
grep "img srcset=" $ABSDIR/tpod.html | awk  '{print $2 }' | awk -F "\"" '{print $2}' > $ABSDIR/pic_links.txt

count=1
cat $ABSDIR/pic_links.txt | while read LINE
do
    wget  -O $ABSDIR/pics/pic_$count $LINE
    count=$((count + 1))
done

# setting a random pic as wallpaper
exec $ABSDIR/set.sh
