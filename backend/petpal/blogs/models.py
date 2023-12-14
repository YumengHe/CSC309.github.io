from accounts.models import CustomUser
from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Blog Post "{self.title}" by {self.author.username}'

    class Meta:
        ordering = ['-created_at']
