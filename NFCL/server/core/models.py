from django.db import models
import uuid

class Driver(models.Model):
    name = models.CharField(max_length=300)
    mobile_no = models.IntegerField()
    notification_id = models.CharField(max_length=600)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    running_status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.uuid) + "-" + str(self.name)
 