from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    # add additional fields in here
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    # role can be one of "seeker" or "shelter"
    role = models.CharField(max_length=10)
    profile_pic = models.ImageField(upload_to="user_profiles/")

    def get_profile_pic_url(self):
        if self.profile_pic and hasattr(self.profile_pic, 'url'):
            return self.profile_pic.url
        else:
            return settings.MEDIA_URL + "user_profiles/default_profile.png"

    def __str__(self):
        return self.email  # or username if you are using that