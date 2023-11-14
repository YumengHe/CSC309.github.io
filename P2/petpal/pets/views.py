from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import PetPost
from .serializers import PetPostSerializer

class PetPostViewSet(viewsets.ModelViewSet):
    queryset = PetPost.objects.all()
    serializer_class = PetPostSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['shelter', 'status']
    ordering_fields = ['created_at', 'expiry', 'last_updated']
    ordering = ['created_at']

    def perform_destroy(self, instance):
        # Add custom delete logic if needed
        super().perform_destroy(instance)
