from django.shortcuts import render
from rest_framework import status, views, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response


class CommentListCreate(views.APIView):
    def create_comment(self, request):
        return None

class ShelterCommentListCreate(views.APIView):
    def comment_list(self, request):
        return None

class ApplicationCommentListCreate(views.APIView):
    def comment_list(self, request):
        return None
