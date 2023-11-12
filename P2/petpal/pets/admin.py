from django.contrib import admin
from .models import PetPost


# Register your models here.
class PetsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "owner",
    )


admin.site.register(PetPost, PetsAdmin)