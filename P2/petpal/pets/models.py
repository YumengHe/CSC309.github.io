from django.db import models
from accounts.models import CustomUser


# Create your models here.
class PetPost(models.Model):
    STATUS_CHOICE = (
        ("abailable", "Available"),
        ("pending", "Pending"),
        ("adopted", "Adopted"),
        ("withdrawn", "withdrawn"),
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICE)
    created_at = models.DateTimeField(auto_now_add=True)
    expriy = models.DateTimeField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name}"
