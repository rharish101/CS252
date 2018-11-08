# Assignment 4
Dockerized version of "Secure Login" for Heroku.

## Adding to Heroku
1. Install the Heroku CLI
2. Login to Heroku:
```
heroku login
heroku container:login
```
3. Create the app as follows:
```
heroku create cs252-a4
```

## Deploying to Heroku
1. Start the docker daemon
2. Add the Heroku labs feature `runtime-new-layer-extract`:
```
heroku labs:enable -a cs252-a4 runtime-new-layer-extract
```
3. Build and push the image:
```
heroku container:push web -a cs252-a4
```
4. Release the new version:
```
heroku container:release web -a cs252-a4
```
5. Check out the webpage at [https://cs252-a4.herokuapp.com](https://cs252-a4.herokuapp.com)
6. *[Optional]* Monitor logs as follows:
```
heroku logs -t -a cs252-a4
```

## Running locally
1. Use the Heroku CLI to get the environment variable for the PostgreSQL database:
```
DATABASE_URL=$(heroku config:get DATABASE_URL -a cs252-a4)
```
2. Build the docker image:
```
docker build -t cs252-a4 .
```
3. Run it with port binding and passing the `DATABASE_URL` env. variable as follows:
```
docker run -d -p 8080:80 -e DATABASE_URL="$DATABASE_URL" --rm --name a4 cs252-a4
```
4. Go to localhost on the assigned port (eg. `localhost:8080`)
5. Stop the container using `docker kill a4`
