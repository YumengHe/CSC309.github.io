from rest_framework import serializers
from .models import BlogComment


class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = ['id', 'text', 'created_at']
        read_only_fields = ('id', 'created_at')