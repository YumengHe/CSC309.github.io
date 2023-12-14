from django.db import models
from pets.models import PetPost
from accounts.models import CustomUser
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import User


# Create your models here.
class Application(models.Model):
    STATUS_CHOICE = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("denied", "Denied"),
        ("withdrawn", "Withdrawn"),
    )
    petpost = models.ForeignKey(PetPost, on_delete=models.CASCADE)
    seeker = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="seekers"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICE, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    adopter_firstname = models.CharField(max_length=255)
    adopter_lastname = models.CharField(max_length=255)
    adopter_email = models.EmailField()

    co_adopter_firstname = models.CharField(max_length=255, null=True, blank=True)
    co_adopter_lastname = models.CharField(max_length=255, null=True, blank=True)
    co_adopter_email = models.EmailField(null=True, blank=True)

    addr_street = models.CharField(max_length=255, verbose_name="street")
    addr_city = models.CharField(max_length=255, verbose_name="city")
    addr_province = models.CharField(max_length=10, verbose_name="province")
    addr_postal = models.CharField(max_length=10, verbose_name="postal")

    phone = PhoneNumberField(null=False, blank=False)
    phone_type = models.CharField(
        max_length=10, choices=(("cell", "Cell"), ("home", "Home"))
    )

    have_pet_currently = models.BooleanField(verbose_name="Currently have any pets?")
    have_pet_notes = models.TextField(
        null=True, blank=True, verbose_name="Please list your current pets"
    )

    family_members = models.TextField(
        verbose_name="Names and ages of all permanent residents of your home (adults/children)"
    )

    class Meta:
        # Order applications by most recent updated
        ordering = ("-last_updated",)

    def __str__(self) -> str:
        return f"App{self.id}: {self.seeker} wants {self.petpost}"


class Conversation(models.Model):
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=255)
    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="conversations"
    )

    def __str__(self) -> str:
        return f"{self.id} {self.content}"
