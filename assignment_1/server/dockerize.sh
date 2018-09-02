#!/usr/bin/bash
embed=${1:-true}
docker build -t image_server .
docker run -d --rm --net "host" -e EMBED=$1 --name server image_server
if [ $embed == false ]; then
    echo "Running server with no embedding of images in HTML"
else
    echo "Running server with embedding of images in HTML"
fi
