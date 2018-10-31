from django.urls import path
from core import views

urlpatterns = [
    path('nearbyDrivers', views.nearbyDrivers, name='nearbyDrivers'),
    path('nearbyDriversWeb', views.nearbyDriversWeb, name='nearbyDriversWeb'),
    path('updateDriver', views.updateDriverDetail, name='upadteDriver'),
     path('deleteDriver', views.deleteDriverDetail, name='deleteDriver'),
]