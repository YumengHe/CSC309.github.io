from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import Notification
from .serializer import NotificationSerializer
from applications.paginations import BasePageNumberPagination
from rest_framework.permissions import IsAuthenticated


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
        serializer = NotificationSerializer(notification, data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        notification = get_object_or_404(
            Notification, id=self.kwargs.get("id"), recipient=request.user
        )
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationList(ListAPIView):
    """Retrieve a list of notifications that received by the login user"""

    pagination_class = BasePageNumberPagination
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        notifications = Notification.objects.filter(recipient=self.request.user)

        # Filter notifications by read/unread
        state_param = self.request.query_params.get("state", None)
        # Verify the status parameter
        if state_param in ["read", "unread"]:
            read_bool = state_param == "read"
            notifications = notifications.filter(read=read_bool)

        # Sort notifications by create time
        sort_param = self.request.query_params.get("sort", None)
        if sort_param == "creation":
            notifications = notifications.order_by("created_at")
        elif sort_param == "-creation":
            notifications = notifications.order_by("-created_at")

        return get_list_or_404(notifications)
