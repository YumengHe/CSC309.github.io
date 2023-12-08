from rest_framework import generics, permissions

from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostView(generics.ListCreateAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Optionally restricts the returned blogs to a given author,
        by filtering against a `author` query parameter in the URL.
        """
        queryset = BlogPost.objects.all()
        author_id = self.request.query_params.get('author', None)
        if author_id is not None:
            queryset = queryset.filter(author__id=author_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)



class BlogPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

