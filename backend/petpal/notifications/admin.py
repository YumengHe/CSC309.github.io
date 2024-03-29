from django.contrib import admin
from .models import Notification


# Register your models here.
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "recipient", "created_at", "read", "content", "event_link")


admin.site.register(Notification, NotificationAdmin)
