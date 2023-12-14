from django.contrib import admin
from .models import CustomUser


# Register your models here.
class AccountAdmin(admin.ModelAdmin):
    list_display = ("username", "id", "role")


admin.site.register(CustomUser, AccountAdmin)
