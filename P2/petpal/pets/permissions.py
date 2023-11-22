from rest_framework import permissions
from django.shortcuts import render, get_object_or_404
from .models import PetPost

# Permissions in Django REST Framework
# https://testdriven.io/blog/drf-permissions/


class IsSeeker(permissions.BasePermission):
    """
    Custom permission to only allow seekers to perform actions.
    """

    message = (
        "Unauthorized. This resource is available for authorized pet seekers only."
    )

    def has_permission(self, request, view):
        # Check if the user is login as a seeker
        return request.user.is_authenticated and request.user.role == "seeker"

    def has_object_permission(self, request, view, obj):
        # Check if the request method is allowed, and if the seeker of Application instance obj is the login user
        return request.user == obj.seeker


class IsShelter(permissions.BasePermission):
    """
    Custom permission to only allow shelters to perform actions.
    """

    message = (
        "Unauthorized. This resource is available for authorized pet shelters only."
    )

    def has_permission(self, request, view):
        # Check if the user is login as a shelter
        return request.user.is_authenticated and request.user.role == "shelter"

    def has_object_permission(self, request, view, obj):
        # obj is the Application instance
        return request.user == obj.petpost.shelter


class IsPetPoster(permissions.BasePermission):
    """
    Custom permission to only allow application participants to perform actions.
    """

    message = (
        "Unauthorized. This resource is available for pet poster only."
    )

    # has_object_permission() is never executed for list views, so use has_permission()
    def has_permission(self, request, view):
        # Access to url parameters in DRF permission
        # https://stackoverflow.com/questions/47397323/how-can-i-get-an-access-to-url-paramaters-in-django-rest-framework-permission-cl
        petpost = get_object_or_404(PetPost, id=view.kwargs.get("id"))
        print(petpost, petpost.shelter)
        Authorized_users = [petpost.shelter]
        return request.user.is_authenticated and request.user in Authorized_users
