from django.urls import path
from core import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/nearbyDrivers', views.nearbyDrivers, name='nearbyDrivers'),
    path('api/nearbyDriversWeb', views.nearbyDriversWeb, name='nearbyDriversWeb'),
    path('api/updateDriver', views.updateDriverDetail, name='upadteDriver'),
     path('api/deleteDriver', views.deleteDriverDetail, name='deleteDriver'),
]