from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import status, views, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .serializers import UserSerializer, User
from .permissions import DenyAll
from notifications.models import Notification


class UserLoginView(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            # Create a Notification instance here
            notification = Notification.objects.create(
                recipient=user,
                content="Welcome back, {}".format(username),
                event_link="URL_to_some_event_or_page"  # Customize this as needed
            )
            print(notification)

            # User is authenticated. We can generate tokens now.
            refresh = RefreshToken.for_user(user)
            access = AccessToken.for_user(user)

            data = {
                "refresh": str(refresh),
                "access": str(access),
            }
            return Response(data, status=status.HTTP_200_OK)

        # Authentication failed. Respond with an error message.
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

class UserCreateView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
                # elif (self.request.user.role == "shelter" and requested_user in self.request.user.applicants.all()):
                #     # TODO: allow if is a shelter that the seeker applied to
                #     permission_classes = [IsAuthenticated]
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

        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, id=user_id)
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
        if role == "shelter":
            return User.objects.filter(role=role)
        else:
            # no results if role is not specified or if role is "seeker"
            return User.objects.none()

    def get(self, request, *args, **kwargs):
        print(self.request.query_params)
        queryset = self.get_queryset()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)