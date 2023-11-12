from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Comment(models.Model):
    # Content-object field to create a generic foreign key
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    # User reference - assuming you're using Django's built-in User model
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Comment text
    text = models.TextField()

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True) # Uncomment if you decide to track updates

    def __str__(self):
        return f'Comment by {self.user.username} on {self.content_type}'

    # Additional methods and meta configurations as required
