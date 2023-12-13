from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from accounts.models import CustomUser
from blogs.models import BlogPost

class Comment(models.Model):
    # The text of the comment
    text = models.TextField()

    # Fields for generic relation to various content types
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    # ForeignKey to link a comment to a user
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    blog = models.ForeignKey(BlogPost, related_name='comments', on_delete=models.CASCADE, null=True, blank=True)
    # Automatic timestamp when a comment is created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.content_type.model == 'blog':
            return f'Comment on Blog {self.object_id} by {self.user.username} on {self.created_at}'
        elif self.content_type.model == 'customuser':  # Assuming this is for shelter
            return f'Comment on Shelter {self.object_id} by {self.user.username} on {self.created_at}'
        else:
            return f'Comment by {self.user.username} on {self.created_at}'

    class Meta:
        ordering = ['-created_at']  # Sort comments by creation time in descending order