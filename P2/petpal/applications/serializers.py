from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    DateTimeField,
    CharField,
)
from .models import Application, Conversation


class ApplicationFullSerializer(ModelSerializer):
    created_at = DateTimeField(read_only=True)
    last_updated = DateTimeField(read_only=True)
    seeker = PrimaryKeyRelatedField(read_only=True)
    petpost = PrimaryKeyRelatedField(read_only=True)
    status = CharField(default="pending")

    class Meta:
        model = Application
        fields = "__all__"

    def create(self, validated_data):
        # Set the 'status' to "pending" before creating the object
        validated_data["status"] = "pending"
        return super().create(validated_data)


class ApplicationBasicSerializer(ApplicationFullSerializer):
    class Meta:
        model = Application
        fields = ["id", "seeker", "petpost", "status", "last_updated", "created_at"]


class ConversationSerializer(ModelSerializer):
    created_at = DateTimeField(read_only=True)
    created_by = PrimaryKeyRelatedField(read_only=True)
    application = PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Conversation
        fields = "__all__"
