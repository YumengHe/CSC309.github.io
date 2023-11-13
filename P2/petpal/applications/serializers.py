from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Application


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"


class ApplicationStatusSerializer(ModelSerializer):
    seeker = PrimaryKeyRelatedField(read_only=True)
    petpost = PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "seeker", "petpost", "status", "last_updated"]
