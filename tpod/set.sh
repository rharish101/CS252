#!/bin/bash
CURDIR=$(pwd)
BASEDIR=$(dirname $0)
ABSPATH=$(readlink -f $0)
ABSDIR=$(dirname $ABSPATH)

pic=$(ls $ABSDIR/pics/ | shuf -n 1)
pic_addr=$ABSDIR/pics/$pic

wm=$(wmctrl -m | grep Name | awk '{print $2}')

if [ "$wm" == "i3" ]
then
    feh --bg-scale $pic_addr
else
    gsettings set org.gnome.desktop.background picture-uri $pic_addr
fi


echo $pic_addr
