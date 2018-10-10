from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from core.models import Driver
import json, math
from pyproj import Proj, transform

def get_distance(a,b):
    return str(math.sqrt( (a[1]-b[1])^2 + (a[0]-b[0])^2 ))

def nearbyDrivers(request):
    data = json.loads(request.body.decode("utf-8"))
    
    try:
        latitude = data['latitude']
        longitude = data['longitude']
    except:
         return HttpResponse("ERROR", status=403)

    x, y = transform(Proj(init='epsg:4326'), Proj(init='epsg:3857'), float(longitude), float(latitude))
    # output (meters east of 0, meters north of 0):
    #shortcuts for Web Mercator (EPSG 3857) and WGS 84 longitude and latitude (EPSG 4326). 
    x_cordinate = int(x)
    y_cordinate = int(y)
    grid_size = 10000 # 10km * 10km
    grid = ( int(x_cordinate/grid_size), int(y_cordinate/grid_size))
    nearbygrids = [  
                    (grid[0] , grid[1] ), 
                    (grid[0] , grid[1] + 1 ),
                    (grid[0] , grid[1] - 1),

                    (grid[0] + 1, grid[1]),
                    (grid[0] + 1, grid[1] + 1 ),
                    (grid[0] + 1, grid[1] - 1 ),
                    
                    (grid[0] - 1, grid[1]),
                    (grid[0] - 1, grid[1] + 1 ),
                    (grid[0] - 1, grid[1] - 1 )
                    
                  ]
    
    near_by_grid_id = [str(hash(each)) for each in nearbygrids]

    drivers = Driver.objects.filter(grid__in = near_by_grid_id)

    drivers =  [ obj.to_dict() for obj in drivers ]

    drivers =  [ {**each, 'distance':\
                             get_distance(\
                                (x_cordinate,y_cordinate), \
                                (int(each['x_cordinate']), int(each[ 'y_cordinate']) ) \
                              )\
                        
                } for each in drivers ]

    drivers = sorted(drivers, key=lambda k: float(k['distance']) )

    drivers = drivers[0:3]



        
    data = { 
            'drivers' : drivers, 
            'latitude' : str(latitude),
            'longitude' : str(longitude),
            'x_cordinate' : str(x_cordinate),
            'y_cordinate' : str(y_cordinate)
    }

    return JsonResponse(data)


@require_http_methods(["POST"])
def updateDriverDetail(request):

    data = json.loads(request.body.decode("utf-8"))
    
    try:
        mob_id = data['mob_id']
        name = data['name']
        mobile_no = data['mobile_no']
        latitude = data['latitude']
        longitude = data['longitude']

    except:
         return HttpResponse("data fields are missing", status=400)

    x, y = transform(Proj(init='epsg:4326'), Proj(init='epsg:3857'), float(longitude), float(latitude))
    # output (meters east of 0, meters north of 0):
    #shortcuts for Web Mercator (EPSG 3857) and WGS 84 longitude and latitude (EPSG 4326). 
    x = int(x)
    y = int(y)

    grid_size = 10000 # 10km * 10km
    grid = ( int(x/grid_size), int(y/grid_size))
    grid_id = str(hash(grid))

    data_update = {
        'mob_id' : mob_id,
        'name' : name,
        'mobile_no' : mobile_no,
        'latitude' : latitude,
        'longitude' : longitude,
        'x_cordinate' : x,
        'y_cordinate' : y,
        'grid' : grid_id
    }

    try:
        driver = Driver.objects.get(mob_id = mob_id)
        Driver.objects.filter(mob_id = mob_id).update(**data_update)
        return HttpResponse(status = 202)
    except ObjectDoesNotExist:
        driver = Driver(**data_update)
        driver.save()
        return HttpResponse(status = 201)

    


def deleteDriverDetail(request):
    mob_id = json.loads(request.body.decode("utf-8")).get("mob_id")
    if(mob_id == None):
        return HttpResponse("No Mob_id", status=400)
    else:
        status = Driver.objects.filter(mob_id=mob_id).delete()
        if(status[0] > 0 ):
            return HttpResponse(status = 202)
        else:
            return HttpResponse("DoesNotExist", status=409)



