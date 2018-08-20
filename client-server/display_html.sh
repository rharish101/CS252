#!/usr/bin/sh
if [ -f "/bin/google-chrome-stable" ] || [ -f "/usr/bin/google-chrome-stable" ]; then
    google-chrome-stable $1
else
    firefox $1
fi
