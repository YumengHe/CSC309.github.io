from django.shortcuts import get_object_or_404
from rest_framework import status, views, generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .serializers import UserSerializer, User
from django.contrib.auth import authenticate


class UserLoginView(views.APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
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


class UserView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        check permissions for all ops
        """
        # if post(create), no permission required
        if self.request.method == 'POST':
            permission_classes = [AllowAny]
        # if get, no permission required for id links to a shelter


        elif (self.request.method == 'GET'):
            requested_user = get_object_or_404(User, id=self.kwargs.get("id"))
            if requested_user.role == "shelter":
                permission_classes = [AllowAny]
            else:  # gets a seeker
                if self.request.user.id == requested_user.id:
                    # allow if is current user
                    permission_classes = [IsAuthenticated]
                elif (self.request.user.role == "shelter" and
                      requested_user in self.request.user.applicants.all()):
                    # allow if is a shelter that the seeker applied to
                    permission_classes = [IsAuthenticated]
                else:
                    permission_classes = []


        elif (self.request.method == 'PUT'):
            # allow if is current user, don't allow otherwise
            requested_user = get_object_or_404(User, id=self.kwargs.get("id"))
            if self.request.user.id == requested_user.id:
                permission_classes = [IsAuthenticated]
            else:
                permission_classes = []


        elif (self.request.method == 'DELETE'):
            # allow if is current user, don't allow otherwise
            requested_user = get_object_or_404(User, id=self.kwargs.get("id"))
            if self.request.user.id == requested_user.id:
                permission_classes = [IsAuthenticated]
            else:
                permission_classes = []
        else:
            # other methods not allowed
            permission_classes = []

        return [permission() for permission in permission_classes]

    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get("id")
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        response_user = get_object_or_404(User, id=user_id)

        serializer = UserSerializer(response_user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        if self.request.method == 'GET':
            if self.request.query_params.get('role', None) == "shelter":
                # allow everyone to see a shelter list
                permission_classes = [AllowAny]
            else:
                # seeker list not available
                permission_classes = []
        else:
            # other methods not allowed in list user
            permission_classes = []

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        role = self.request.query_params.get('role', None)
        if role == "shelter":
            return User.objects.filter(role=role)
        else:
            # no results if role is not specified or if role is "seeker"
            return User.objects.none()