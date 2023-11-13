from django.db import models

class Notification (models.Model):
    # need created_by user, created_at time, content, and read status
    created_by = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    content = models.CharField(max_length=1000)
    read = models.BooleanField(default=False)
    event_link = models.CharField(max_length=1000)

    def __str__(self):
        return self.content

    class Meta:
        ordering = ['-created_at']