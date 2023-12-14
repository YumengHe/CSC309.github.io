from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, DateTimeField, CharField, BooleanField
from .models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        # fields = ['id', 'recipient', 'created_at', 'modified_at', 'content', 'read', 'event_link']

class NotificationStateSerializer(ModelSerializer):
    recipient = PrimaryKeyRelatedField(read_only=True)
    created_at = DateTimeField(read_only=True)
    modified_at = DateTimeField(read_only=True)
    content = CharField(read_only=True)
    event_link = CharField(read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"