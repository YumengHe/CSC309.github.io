from applications.paginations import BasePageNumberPagination
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializer import NotificationSerializer, NotificationStateSerializer


class NotificationView(APIView):
    def get(self, request, *args, **kwargs):
        notification = get_object_or_404(
            Notification, id=self.kwargs.get("id"), recipient=request.user
        )
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        notification = get_object_or_404(
            Notification, id=self.kwargs.get("id"), recipient=request.user
        )
        notification.read = True
        serializer = NotificationStateSerializer(notification, data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        notification = get_object_or_404(
            Notification, id=self.kwargs.get("id"), recipient=request.user
        )
        notification.delete()
        return Response(data={"detail": "succeed"}, status=status.HTTP_204_NO_CONTENT)


class NotificationList(ListAPIView):
    """Retrieve a list of notifications that received by the login user"""

    pagination_class = BasePageNumberPagination
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter notifications for the logged-in user
        notifications = Notification.objects.filter(recipient=self.request.user)

        # Extract query parameters
        state_param = self.request.query_params.get("state")
        sort_param = self.request.query_params.get("sort")

        # Filter notifications by read/unread status
        if state_param in ["read", "unread"]:
            notifications = notifications.filter(read=(state_param == "read"))

        # Sort notifications by creation time
        if sort_param == "creation":
            notifications = notifications.order_by("created_at")
        else:
            # Default sorting order
            notifications = notifications.order_by("-created_at")

        return get_list_or_404(notifications)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # if not queryset.exists():
        #     return Response(status=status.HTTP_204_NO_CONTENT)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
