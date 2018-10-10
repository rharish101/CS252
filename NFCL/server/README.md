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

## API

### NearByDrivers:
Return a list of NearByDrivers to customers.


**URL** : `/api/nearbyDrivers/`

**Method** : `POST`


**Data and Example**

Provide GPS location of customer. All fields must be sent.

```json
{
    "latitude" : 12.68,
    "longitude" : 21.69
}
```

**Success Response**

**Condition** : If everything is OK 

**Code** : `200 OK`

**Content example**

```json
{
    "drivers": [
        {	
            "name": "Mr. Driver1",
            "mobile_no": "4534567865",
            "distance": "33.77869150810907",
            "latitude": "12.670000",
            "longitude": "21.690000",
            "x_cordinate": "2414519",
            "y_cordinate": "1422055"
        },
        {	
            "name": "Mr. Driver2",
            "mobile_no": "9454344543",
            "distance": "57.15767664977295",
            "latitude": "12.670000",
            "longitude": "21.670000",
            "x_cordinate": "2412293",
            "y_cordinate": "1422055"
        }
    ],
    "latitude": "12.68",
    "longitude": "21.69",
    "x_cordinate": "2414519",
    "y_cordinate": "1423196"
}
```

### UpdateDriver:
API for either create or update driver's data.


**URL** : `/api/updateDriver/`

**Method** : `POST`


**Data and Example**

```json
{
	"mob_id" : "hvshgdhgdfgh-2t6r5cvxgvchd",
	"name" : "kardamaa",
	"mobile_no" : "7452735344",
	"latitude" : 12.68,
	"longitude" : 2.723
}
```

**Success Response**

- If created : `201 Created`
- If updated : `202 Accepted`
- If Bad request :  `400 Bad Request`


### DeleteDriver:
API for deleting driver's data.

**URL** : `/api/deleteDriver/`

**Method** : `POST`

**Data and Example**

```json
{
	"mob_id" : "hvshgdhgdfgh-2t6r5cvxgvchd",
}
```

**Success Response**

- If deleted : `202 Accepted`
- If conflict or not found: `409 Resource Conflict` 
- If Bad request :  `400 Bad Request`


