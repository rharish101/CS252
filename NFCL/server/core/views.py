from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from core.models import Driver
import json, math
from pyproj import Proj, transform



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
         return HttpResponse("ERROR", status=403)

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
        return HttpResponse('UPDATE', status = 200)
    except ObjectDoesNotExist:
        driver = Driver(**data_update)
        driver.save()
        return HttpResponse('CREATE', status = 200)

    


def deleteDriverDetail(request):
    mob_id = json.loads(request.body.decode("utf-8")).get("mob_id")
    if(mob_id == None):
        return HttpResponse("NoMobID", status=403)
    else:
        status = Driver.objects.filter(mob_id=mob_id).delete()
        if(status[0] > 0 ):
            return HttpResponse('OK', status = 200)
        else:
            return HttpResponse("DoesNotExist", status=403)



