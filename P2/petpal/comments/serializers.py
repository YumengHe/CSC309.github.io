from rest_framework import serializers
from .models import Comment


class ShelterCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text', 'user', 'created_at']
