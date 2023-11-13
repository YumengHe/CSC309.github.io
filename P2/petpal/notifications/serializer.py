from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'created_by', 'created_at', 'modified_at', 'content', 'read', 'event_link']
