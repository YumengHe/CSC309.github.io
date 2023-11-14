from django.db import models

class PetListing(models.Model):
    STATUS_CHOICES = [('available', 'Available'), ('adopted', 'Adopted'), ('unavailable', 'Unavailable')]

    shelter = models.CharField(max_length=100)
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='available')
    breed = models.CharField(max_length=50)
    age = models.IntegerField()
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.breed + ' - ' + self.status
