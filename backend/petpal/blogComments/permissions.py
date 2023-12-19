from rest_framework import permissions


class IsAuthenticatedToComment(permissions.BasePermission):
    """
    Custom permission to only allow authenticated users to create a comment.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        return request.user and request.user.is_authenticated


class CanViewBlogComments(permissions.BasePermission):
    """
    Custom permission to allow any authenticated user to view comments on shelters.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
