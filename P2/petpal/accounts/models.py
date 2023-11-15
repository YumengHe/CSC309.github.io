from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    # add additional fields in here
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    # role can be one of "seeker" or "shelter"
    role = models.CharField(max_length=10)
    profile_pic = models.ImageField(upload_to="user_profiles/")

    def __str__(self):
        return self.email  # or username if you are using that