from rest_framework import serializers

from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author', 'author_username', 'created_at', 'updated_at']

    def get_author_username(self, obj):
        return obj.author.username
