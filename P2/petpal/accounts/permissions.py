from rest_framework.permissions import BasePermission


class DenyAll(BasePermission):
    """
    Custom permission class that denies access to all requests.
    """

    def has_permission(self, request, view):
        """
        Return `False` for all requests to deny access.
        """
        return False