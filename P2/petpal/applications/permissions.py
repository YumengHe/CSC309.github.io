from rest_framework import permissions

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
        # print(obj, obj.petpost.owner, request.user)
        return request.user == obj.petpost.shelter
