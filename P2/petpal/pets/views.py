from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import PetPost
from .serializers import PetPostSerializer

from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .paginations import BasePageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import IsPetPostShelter

class PetPostViewSet(viewsets.ModelViewSet):
    queryset = PetPost.objects.all()
    serializer_class = PetPostSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['shelter', 'status']
    ordering_fields = ['created_at', 'expiry', 'last_updated']
    ordering = ['created_at']

    def perform_destroy(self, instance):
        # Add custom delete logic if needed
        super().perform_destroy(instance)

class PetPostView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        pet_post = get_object_or_404(
            PetPost, id=self.kwargs.get("id")
        )
        serializer = PetPostSerializer(pet_post)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        pet_post = get_object_or_404(PetPost, id=self.kwargs.get("id"))
        serializer = PetPostSerializer(pet_post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        pet_post = get_object_or_404(PetPost, id=self.kwargs.get("id"))
        pet_post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PetPostList(ListAPIView):
    """Retrieve a list of pet posts with filtering capabilities."""
    
    serializer_class = PetPostSerializer
    pagination_class = BasePageNumberPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = PetPost.objects.all()

        # Default filter for status
        status = self.request.query_params.get('status', 'available')
        queryset = queryset.filter(status=status)

        # Filters for shelter, size, and gender
        shelter = self.request.query_params.get('shelter')
        if shelter is not None:
            queryset = queryset.filter(shelter=shelter)

        size = self.request.query_params.get('size')
        if size is not None:
            queryset = queryset.filter(size=size)

        gender = self.request.query_params.get('gender')
        if gender is not None:
            queryset = queryset.filter(gender=gender)

        sort_by = self.request.query_params.get('sort')
        if sort_by in ['name', 'age']:
            queryset = queryset.order_by(sort_by)
        elif sort_by in ['-name', '-age']:
            queryset = queryset.order_by(sort_by)

        return queryset