from applications.models import Application
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404, get_list_or_404
from notifications.models import Notification
from pets.models import PetPost
from rest_framework import status, views, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .permissions import DenyAll
from .serializers import UserSerializer, User


class UserLoginView(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({"error": "Both username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        if not User.objects.filter(username=username).exists():
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            # Create a Notification instance here
            notification = Notification.objects.create(
                recipient=user,
                content=f"Welcome back, {username}",
                event_link=f"/accounts/{user.id}/"  # Customize this as needed
            )

            # User is authenticated. We can generate tokens now.
            refresh = RefreshToken.for_user(user)
            access = AccessToken.for_user(user)

            data = {
                "refresh": str(refresh),
                "access": str(access),
                'user_id': user.id,
            }
            return Response(data, status=status.HTTP_200_OK)

        # Authentication failed. Respond with an error message.
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

class UserCreateView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            # Create a Notification instance here
            notification = Notification.objects.create(
                recipient=serializer.instance,
                content=f"Welcome new {serializer.instance.role}, {serializer.instance.username}",
                event_link=f"/accounts/{serializer.instance.id}/"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        check permissions for all ops
        """
        # if post(create), no permission required
        if (self.request.method == 'GET'):
            requested_user = get_object_or_404(User, id=self.kwargs.get("id"))
            if requested_user.role == "shelter":
                permission_classes = [AllowAny]
            else:  # gets a seeker
                if self.request.user.id == requested_user.id:
                    # allow if is current user
                    permission_classes = [IsAuthenticated]
                elif self.request.user.role == "shelter":
                    if requested_user.role == "shelter":
                        # allow if ask for a shelter
                        permission_classes = [AllowAny]

                    else:
                        # if ask for a seeker
                        # allow if is a shelter that the seeker applied to
                        pet_posts = get_list_or_404(PetPost, shelter=self.request.user)
                        applications = Application.objects.filter(petpost__in=pet_posts)
                        application_seekers = [application.seeker for application in applications]
                        if requested_user in application_seekers:
                            permission_classes = [IsAuthenticated]
                        else:
                            permission_classes = [DenyAll]

                else:
                    permission_classes = [DenyAll]

        elif (self.request.method == 'PUT' or self.request.method == 'PATCH'):
            # allow if is current user, don't allow otherwise
            requested_user = get_object_or_404(User, id=self.kwargs.get("id"))
            if self.request.user.id == requested_user.id:
                permission_classes = [IsAuthenticated]
            else:
                permission_classes = [DenyAll]

        elif (self.request.method == 'DELETE'):
            # allow if is current user, don't allow otherwise
            requested_user = get_object_or_404(User, id=self.kwargs.get("id"))
            if self.request.user.id == requested_user.id:
                permission_classes = [IsAuthenticated]
            else:
                permission_classes = [DenyAll]
        else:
            # other methods not allowed
            permission_classes = [DenyAll]

        return [permission() for permission in permission_classes]

    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        response_user = get_object_or_404(User, id=user_id)

        serializer = UserSerializer(response_user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)
        print(request.data)
        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            Notification.objects.create(
                recipient=user,
                content=f"Your profile has been updated.",
                event_link=f"/accounts/{user.id}/"
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)
        print(request.data)
        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(user, data=request.data)
        original_data = {field: getattr(user, field) for field in serializer.fields}
        serializer = self.get_serializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Identify changed fields
            updated_fields = []
            for field, value in serializer.validated_data.items():
                if original_data[field] != value:
                    updated_fields.append(field)

            # Create notification content
            updated_fields_str = ', '.join(updated_fields)
            notification_content = f"Your profile fields {updated_fields_str} have been updated."

            # Create a notification
            Notification.objects.create(
                recipient=user,
                content=notification_content,
                event_link=f"/accounts/{user.id}/"
            )

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        Notification.objects.create(
            recipient=user,
            content=f"Your account has been deleted.",
            event_link=""
        )
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)



class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        permission_classes = [DenyAll]
        if self.request.method == 'GET':
            if self.request.query_params.get('role', None) == "shelter":
                # allow everyone to see a shelter list
                permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        role = self.request.query_params.get('role', None)
        name = self.request.query_params.get('name', None)

        if role == "shelter":
            queryset = User.objects.filter(role=role)
        else:
            queryset = User.objects.none()

        if name:
            queryset = queryset.filter(username__icontains=name)

        return queryset

    def get(self, request, *args, **kwargs):
        print(self.request.query_params)
        queryset = self.get_queryset()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)