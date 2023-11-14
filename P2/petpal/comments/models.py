from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from accounts.models import CustomUser


class Comment(models.Model):
    # The text of the comment
    text = models.TextField()

    # Fields for generic relation to various content types
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    # ForeignKey to link a comment to a user
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    # Automatic timestamp when a comment is created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.created_at}'

    class Meta:
        ordering = ['-created_at']  # Sort comments by creation time in descending order
