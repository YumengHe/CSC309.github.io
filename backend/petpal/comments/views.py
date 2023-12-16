from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from .models import Comment
from accounts.models import CustomUser
from blogs.models import BlogPost
from .serializers import ShelterCommentSerializer, BlogCommentSerializer
from .permissions import IsAuthenticatedToComment, CanViewShelterComments
from notifications.models import Notification

class ShelterUserCommentsView(generics.ListCreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticatedToComment]  # This ensures only authenticated users can post comments

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user_type = ContentType.objects.get_for_model(CustomUser)

        # Check if the user is a shelter
        if not CustomUser.objects.filter(id=user_id, role='shelter').exists():
            return Comment.objects.none()  # Return an empty queryset if the user is not a shelter

        return Comment.objects.filter(content_type=user_type, object_id=user_id)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        user_type = ContentType.objects.get_for_model(CustomUser)
        serializer.save(content_type=user_type, object_id=user_id, user=self.request.user)

        # Create notification for the conversation recipient
        # Assuming the recipient is the shelter owner/user
        recipient = CustomUser.objects.get(id=user_id)

        # Create and save the notification
        notification = Notification(
            recipient=recipient,
            content=f"A new comment has been posted by {self.request.user.username}.",
            # Example content, modify as needed
            event_link=f"/comments/shelter-comments/{user_id}/"  # Example link, modify as needed
        )
        notification.save()


class BlogCommentsView(generics.ListCreateAPIView):
    serializer_class = BlogCommentSerializer
    permission_classes = [IsAuthenticatedToComment]  # This ensures only authenticated users can post comments

    def get_queryset(self):
        blog_id = self.kwargs['blog_id']
        return Comment.objects.filter(blog_id=blog_id)  # Filter comments by blog post

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        blog_id = self.kwargs['blog_id']
        serializer.save(user=self.request.user, blog_id=blog_id)

        # Create notification for the blog comment
        # Assuming notification logic is similar to shelter comments
        blog = BlogPost.objects.get(id=blog_id)
        notification = Notification(
            recipient=blog.author,
            content=f"A new comment has been posted by {self.request.user.username} on your blog.",
            # Modify content and link as needed
            event_link=f"/comments/blog-comments/{blog_id}/"  # Example link, modify as needed
        )
        notification.save()