#!/bin/bash

rm -f ~/apod/*.jpg ~/apod/*.html
if [ ! -d ~/apod ]; then
    mkdir ~/apod
fi
cd ~/apod
wget http://apod.nasa.gov/apod/astropix.html
a='http://apod.nasa.gov/apod/'
b=$(awk -F "\"" '/href="i/{print $2}' astropix.html)
wget $a$b
imname=$(ls *.jpg)
case $DESKTOP_SESSION in
    "xfce")
        xfconf-query --channel xfce4-desktop --property "/backdrop/screen0/monitor0/workspace0/last-image" --set "$(pwd)/$imname"
        ;;
    "ubuntu")
        ;&
    "gnome")
        /usr/bin/gsettings set org.gnome.desktop.background picture-uri file:///$(pwd)/$imname
        ;;
esac
