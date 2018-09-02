#!/usr/bin/bash
docker build -t image_server .
docker run -d --rm --net "host" --name server image_server
