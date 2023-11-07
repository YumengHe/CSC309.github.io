from rest_framework import status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from .serializers import UserSerializer
from django.contrib.auth import authenticate


class RegisterView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
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
                "access": str(access),  # Generate and include the Access Token in the response.
            }
            return Response(data, status=status.HTTP_200_OK)

        # Authentication failed. Respond with an error message.
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


class AccountInfoView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The request.user will be set to the authenticated User instance
        # Serialize the user information to send as a response
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)