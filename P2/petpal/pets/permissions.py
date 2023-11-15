from rest_framework import permissions
from .models import PetPost

class IsPetPostShelter(permissions.BasePermission):
    """
    Custom permission to only allow the shelter of a PetPost to edit or delete it.
    """

    message = "Unauthorized. Only the shelter associated with this PetPost can modify it."

    def has_object_permission(self, request, view, obj):
        # obj here is the PetPost instance
        # Check if the user making the request is the shelter for this PetPost
        return obj.shelter == request.user
