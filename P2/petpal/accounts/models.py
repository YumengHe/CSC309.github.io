from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    # add additional fields in here
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)

    def __str__(self):
        return self.email  # or username if you are using that