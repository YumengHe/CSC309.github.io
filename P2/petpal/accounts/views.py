from rest_framework import status, views, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .serializers import UserSerializer, User
from django.contrib.auth import authenticate


class UserRegisterView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class UserUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the current user
        return self.request.user


class UserDeleteView(generics.RetrieveDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the current user
        return self.request.user


class UserListByRoleView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned users to a given role and/or id,
        by filtering against 'role' and 'id' query parameters in the URL.
        """
        # TODO add permission
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        user_id = self.request.query_params.get('id', None)

        if role:
            queryset = queryset.filter(role=role)

        if user_id:
            queryset = queryset.filter(id=user_id)

        return queryset
