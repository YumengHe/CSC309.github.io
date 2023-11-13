from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializer import NotificationSerializer


class NotificationView(APIView):

    def get(self):
        notification = get_object_or_404(Notification, id=self.kwargs.get("id"))
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    def put(self):
        notification = get_object_or_404(Notification, id=self.kwargs.get("id"))
        serializer = NotificationSerializer(notification, data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self):
        notification = get_object_or_404(Notification, id=self.kwargs.get("id"))
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
