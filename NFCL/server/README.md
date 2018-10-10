# NFCL Server

## Local Development
Here is a step by step plan on how to setup the Server. It will get you to a point of having a local running instance.

Install the dependencies using  `pip` :
```
pip install -r requirements.txt
```
Build your database:
```
python manage.py migrate
```
Then please create a superuser account for Django:
```
python manage.py createsuperuser
```

Finally, you’re ready to start the webserver:
```
python manage.py runserver
```

