from django.db import models
import uuid

class Driver(models.Model):
    mob_id = models.CharField(max_length=600,unique = True)
    name = models.CharField(max_length=300)
    mobile_no = models.IntegerField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    x_cordinate = models.IntegerField()
    y_cordinate = models.IntegerField()
    grid = models.CharField(max_length=300)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return str(self.mob_id) + "-" + str(self.name)

    def to_dict(self):
        return {
            'name' : str(self.name),
            'mobile_no' : str(self.mobile_no),
            'latitude' : str(self.latitude),
            'longitude' : str(self.longitude),
            'x_cordinate' : str(self.x_cordinate),
            'y_cordinate' : str(self.y_cordinate)
            
        }
 