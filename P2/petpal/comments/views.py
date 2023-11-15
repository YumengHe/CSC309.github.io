from rest_framework import generics
from django.contrib.contenttypes.models import ContentType
from .models import Comment
from accounts.models import CustomUser
from .serializers import ShelterCommentSerializer
from .permissions import IsAuthenticatedToComment, CanViewShelterComments  # Import custom permissions



class ShelterUserCommentListView(generics.ListAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [CanViewShelterComments]  # Use the custom permission for viewing comments

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user_type = ContentType.objects.get_for_model(CustomUser)

        # Filtering based on content_type and object_id
        comments = Comment.objects.filter(content_type=user_type, object_id=user_id)

        # Further filtering to only include comments for users with the 'shelter' role
        shelter_comments = [comment for comment in comments if comment.content_object.role == 'shelter']

        return shelter_comments



class ShelterUserCommentCreateView(generics.CreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticatedToComment]  # Use the custom permission for creating a comment

    def perform_create(self, serializer):
        """
        Overriding this method to add the content_type and object_id
        before saving the comment.
        """
        user_id = self.kwargs['user_id']
        user_type = ContentType.objects.get_for_model(CustomUser)
        serializer.save(content_type=user_type, object_id=user_id, user=self.request.user)


