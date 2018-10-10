from django.urls import path
from core import views

urlpatterns = [
    path('nearbyDrivers', views.nearbyDrivers, name='nearbyDrivers'),
    path('updateDriver', views.updateDriverDetail, name='upadteDriver'),
     path('deleteDriver', views.deleteDriverDetail, name='deleteDriver'),
]