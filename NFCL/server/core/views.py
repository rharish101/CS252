from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from core.models import Driver
import json, math
from pyproj import Proj, transform



    


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



