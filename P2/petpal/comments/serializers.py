from rest_framework import serializers
from .models import Comment


class ShelterCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at']
        read_only_fields = ('id', 'created_at')

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at']
        read_only_fields = ('id', 'created_at')

# The ShelterCommentSerializer remains as it is.

