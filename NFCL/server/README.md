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


## GPS Cordinates to Grids

We are taking GPS cordinates ([Geographic coordinate system](https://en.wikipedia.org/wiki/Geographic_coordinate_system),  [World Geodetic System](https://en.wikipedia.org/wiki/World_Geodetic_System)) from user and converting it in a cartesian like system ([Web Mercator projection](https://en.wikipedia.org/wiki/Web_Mercator_projection)).

- A geographic coordinate system is a coordinate system used in geography that enables every location on Earth to be specified by latitude, longitude and elevation. Its identifier is EPSG:4326 WGS 84
- The World Geodetic System is a standard for use in [geodesy](https://en.wikipedia.org/wiki/Geodesy "Geodesy"), and [satellite navigation](https://en.wikipedia.org/wiki/Satellite_navigation "Satellite navigation") including [GPS](https://en.wikipedia.org/wiki/GPS "GPS"). It comprises a standard [coordinate system](https://en.wikipedia.org/wiki/Geographic_coordinate_system "Geographic coordinate system") for the Earth, a standard reference surface for raw altitude data, and a gravitational equipotential surface that defines the nominal sea level.

- Web Mercator, Google Web Mercator, is a variant of the [Mercator projection](https://en.wikipedia.org/wiki/Mercator_projection) and is the de facto standard for Web mapping applications. Its identifier is EPSG:3857 WGS 84

```python
from pyproj import Proj, transform

# output (meters east of 0, meters north of 0):
# Web Mercator: (EPSG 3857) and World Geodetic System :(EPSG 4326).
x_coordinate, y_coordinate = transform(Proj(init='epsg:4326'), Proj(init='epsg:3857'), float(longitude), float(latitude))

# partion into grid
grid_size =  10000  # 10km * 10km
grid = ( int(x_coordinate/grid_size), int(y_coordinate/grid_size) )
grid_id = hash(grid)
```