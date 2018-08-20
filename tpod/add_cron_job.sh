#!/bin/bash

CURDIR=$(pwd)
BASEDIR=$(dirname $0)
ABSPATH=$(readlink -f $0)
ABSDIR=$(dirname $ABSPATH)

job1="00 11,18 * * * export DISPLAY=$DISPLAY && export DESKTOP_SESSION=$DESKTOP_SESSION && $ABSDIR/set.sh"
job2="00 8 * * 1,3,5 export DISPLAY=$DISPLAY && export DESKTOP_SESSION=$DESKTOP_SESSION && $ABSDIR/tpod.sh"


crontab -l > ./mycron
echo "$job1" >> ./mycron
echo "$job2" >> ./mycron
crontab ./mycron
rm ./mycron
