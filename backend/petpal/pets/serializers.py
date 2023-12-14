from rest_framework import serializers
from .models import PetPost

class PetPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetPost
        fields = ['name', 'description', 'status', 'breed', 'age', 'size', 'color', 'gender', 'expiry', 'image']

class PetPostFullSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    last_updated = serializers.DateTimeField(read_only=True)
    shelter = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(default="available")
    species = serializers.CharField(default="others")

    class Meta:
        model = PetPost
        fields = "__all__"

    def create(self, validated_data):
        # Set the 'status' to "available" before creating the object
        # validated_data["status"] = "available"
        return super().create(validated_data)
