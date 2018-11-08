# Assignment 4
Dockerized version of "Secure Login" for Heroku.

## Adding to Heroku
1. Install the Heroku CLI
2. Login as follows:
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
2. Build and push the image as follows:
```
heroku container:push web -a cs252-a4
```
3. Release the new version as follows:
```
heroku container:release web -a cs252-a4
```
4. Check out the webpage at [https://cs252-a4.herokuapp.com](https://cs252-a4.herokuapp.com)
5. *[Optional]* Monitor logs as follows:
```
heroku logs -t -a cs252-a4
```
