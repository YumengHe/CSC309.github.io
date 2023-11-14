from rest_framework import serializers
from .models import PetPost

class PetPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetPost
        fields = '__all__'
