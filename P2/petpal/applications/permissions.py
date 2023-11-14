from rest_framework import permissions
from django.shortcuts import render, get_object_or_404
from .models import Application

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


class IsApplicationParticipant(permissions.BasePermission):
    """
    Custom permission to only allow application participants to perform actions.
    """

    message = (
        "Unauthorized. This resource is available for application participants only."
    )

    # has_object_permission() is never executed for list views, so use has_permission()
    def has_permission(self, request, view):
        application = get_object_or_404(Application, id=view.kwargs["id"])
        print(application, application.seeker, application.petpost.shelter)
        Authorized_users = [application.seeker, application.petpost.shelter]
        return request.user.is_authenticated and request.user in Authorized_users
