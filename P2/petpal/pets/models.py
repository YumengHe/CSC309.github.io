from django.db import models
from accounts.models import CustomUser

class PetPost(models.Model):

    STATUS_CHOICE = (
        ("available", "Available"),
        ("pending", "Pending"),
        ("adopted", "Adopted"),
        ("withdrawn", "Withdrawn"),
    )
    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("unknown", "Unknown"),
    )
    SIZE_CHOICES = (
        ("small", "Small"),
        ("medium", "Medium"),
        ("large", "Large"),
        ("extra_large", "Extra Large"),
    )

    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    shelter = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICE)
    breed = models.CharField(max_length=50, null=True, blank=True)
    age = models.FloatField(null=True, blank=True)  # Age in years, can include decimals
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, null=True, blank=True)
    color = models.CharField(max_length=30, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=True, blank=True)
    image = models.ImageField(upload_to='pet_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry = models.DateTimeField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name}"
