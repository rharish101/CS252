# Assignment 1
This is a client-server facility with the server used in a docker container.
This server takes a request to display images of a number of cats, dogs, cars and trucks.

A maximum of 4 images exist per class.
Requesting more images of a single class will be ignored, and only 4 of that class will be displayed.

### Modes Of Operation
By default, the server embeds the images in the HTML file in base64 format.
To disable this, a flag can be passed.

Note that if the flag is passed to the server, it must also be passed to the client.
Otherwise, there will definitely be errors.

## Instructions To Run The Server
  1. Start the docker daemon
  2. Go to the server folder
  3. Run the file `dockerize.sh`
  4. If no image embedding is desired, then run it as follows: `$ ./dockerize.sh false`

## Instructions To Run The Client
  1. Go to the client folder
  2. Compile the file `client.c`
  3. Run the executable.
  4. If no image embedding is desired, then run the executable as follows: `$ ./a.out noembed`
  5. Enter the request. For example, `2 dogs, 3 cats, and 1 truck`
