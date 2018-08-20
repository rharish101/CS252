## Instructions

* Build image with `docker build -t ssh_apache .`
* Run container with `docker run -d --name apache -p 8080:80 -p 1234:22 -v /path/to/CS252/website/:/var/www/html --rm=true ssh_apache`
* Open website using the url: localhost:8080
* SSH to the container using `ssh root@ip.addr.of.docker. -p 1234`
  * Find ip address of the docker daemon using the command `ifconfig`
