from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from .models import PetPost
from .serializers import PetPostSerializer, PetPostFullSerializer

from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .paginations import BasePageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import IsPetPoster, IsSeeker, IsShelter

from django.contrib.auth import get_user_model
from accounts.models import CustomUser
from notifications.models import Notification

User = get_user_model()

class PetPostCreate(APIView):
    """
    Create a new pet post. 
    Only shelter is able to create a new post.
    The user creating the post will be assigned as the shelter.
    """

    serializer_class = PetPostFullSerializer
    permission_classes = [IsShelter]
    # permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        
        # Save the object
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(shelter=self.request.user)  # Assign the current user as the shelter

        # Create notification
        Notification.objects.create(
                recipient=self.request.user,
                content=f"New pet post has been created",
                event_link=f"/pets/?shelter={request.user.id}"
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

        

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

    # Define a mapping of methods to permission classes
    permission_classes_by_action = {
        'get': [AllowAny],
        'put': [IsPetPoster],
        'patch': [IsPetPoster],
        'delete': [IsPetPoster]
    }

    def get_permissions(self):
        # Get the method and return the respective permission classes
        try:
            return [permission() for permission in self.permission_classes_by_action[self.request.method.lower()]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


    def get(self, request, *args, **kwargs):
        pet_post = get_object_or_404(PetPost, id=self.kwargs.get("id"))
        serializer = PetPostFullSerializer(pet_post)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        pet_post = get_object_or_404(PetPost, id=self.kwargs.get("id"))
        serializer = PetPostFullSerializer(pet_post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Create notification
            Notification.objects.create(
                recipient=self.request.user,
                content=f"Pet post has been updated!",
                event_link=f"/pets/?shelter={request.user.id}"
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        pet_post = get_object_or_404(PetPost, id=self.kwargs.get("id"))
        serializer = PetPostFullSerializer(pet_post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Create notification
            Notification.objects.create(
                recipient=self.request.user,
                content=f"Pet post has been updated!",
                event_link=f"/pets/?shelter={request.user.id}"
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        permission_classes = [IsPetPoster]
        pet_post = get_object_or_404(PetPost, id=self.kwargs.get("id"))
        pet_post.delete()
        # Create notification
        Notification.objects.create(
            recipient=self.request.user,
            content=f"Pet post has been deleted!",
            event_link=f"/pets/?shelter={request.user.id}"
        )
        print("delete successfully!")
        return Response(status=status.HTTP_204_NO_CONTENT)

class PetPostList(ListAPIView):
    """Retrieve a list of pet posts with filtering capabilities."""

    serializer_class = PetPostFullSerializer
    pagination_class = BasePageNumberPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = PetPost.objects.all()

        # Get the status parameter from the request
        status = self.request.query_params.get('status')
        
        # Apply default filter for status only if status parameter is not provided
        if status == "":
            queryset = queryset.filter(status='available')
        elif status:  # Apply status filter if it's provided
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

        # Sorting logic
        sort_by = self.request.query_params.get('sort')
        if sort_by in ['name', 'age']:
            queryset = queryset.order_by(sort_by)
        elif sort_by in ['-name', '-age']:
            queryset = queryset.order_by(sort_by)

        return queryset