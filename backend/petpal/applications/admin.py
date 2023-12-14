from django.contrib import admin
from .models import Application, Conversation


# Register your models here.
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "petpost", "seeker", "last_updated", "status")


class ConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "application", "created_by", "created_at")


admin.site.register(Application, ApplicationAdmin)
admin.site.register(Conversation, ConversationAdmin)
