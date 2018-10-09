from django.urls import path
from core import views

urlpatterns = [
    path('nearbyDrivers', views.nearbyDrivers, name='nearbyDrivers'),
    path('updateDriver', views.updateDriver, name='upadteDriver'),
]