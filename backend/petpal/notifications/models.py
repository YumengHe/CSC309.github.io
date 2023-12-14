from django.db import models


class Notification(models.Model):
    # need created_by user, created_at time, content, and read status
    recipient = models.ForeignKey(
        "accounts.CustomUser", on_delete=models.CASCADE, related_name="notifications"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    content = models.CharField(max_length=1000)
    read = models.BooleanField(default=False, verbose_name="Has been read?")
    event_link = models.CharField(max_length=1000)

    def __str__(self):
        return self.content

    class Meta:
        ordering = ["-created_at"]
