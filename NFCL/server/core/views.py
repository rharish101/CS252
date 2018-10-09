from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from core.models import Driver
import json


@require_http_methods(["GET", "POST"])
def nearbyDrivers(request):
    drivers = {
            "drivers": [
            {
                "dist": 7,
                "name": "Motu",
                "phone": 2234567890
            },
            {
                "dist": 5,
                "name": "Ramu",
                "phone": 1234567890
            },
            {
                "dist": 8,
                "name": "Chotu",
                "phone": 3234567890
            }
            ],
    }
    return JsonResponse(drivers)


@require_http_methods(["POST"])
def updateDriver(request):

    data = json.loads(request.body.decode("utf-8")).get("data")
     
    if(data == None):
        msg = "JSON data is missing in POST"
        return HttpResponse(msg, status=403)

    try:
        uuid  = data['uuid']
        name = data['name']
        mobile_no = data['mobile_no']
        latitute = data['latitude']
        longitude = data['longitude']
        notification_id = data['notification_id']
        running_status = data['running_status']
    except:
         return HttpResponse("ERROR", status=403)

    data_update = {
        'name' : name,
        'mobile_no' : mobile_no,
        'latitude' : latitute,
        'longitude' : longitude,
        'notification_id' : notification_id,
        'running_status' : running_status 
    }
    if(uuid == "NEWUSER"):
        driver = Driver(**data_update)
        driver.save()
        return HttpResponse(str(driver.id), status = 200)
    else:
        try:
            driver = Driver.objects.get(id = uuid)
            Driver.objects.filter(id = uuid).update(**data_update)
        except ObjectDoesNotExist:
            driver = Driver(**data_update)
            driver.save()
        return HttpResponse(str(driver.id), status = 200)

