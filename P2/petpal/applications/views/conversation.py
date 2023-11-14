from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView

from accounts.models import CustomUser
from ..serializers import ConversationSerializer
from ..models import Application, Conversation

from ..permissions import IsApplicationParticipant
from ..paginations import BasePageNumberPagination


class ConversationListCreateView(ListCreateAPIView):
    """
    List and create conversations for a specific application.
    """

    serializer_class = ConversationSerializer
    pagination_class = BasePageNumberPagination
    permission_classes = [IsApplicationParticipant]

    def get_queryset(self):
        # Get application object by id passed through URL
        application = get_object_or_404(Application, id=self.kwargs["id"])
        # print(application.seeker, application.petpost.shelter)
        conversations = Conversation.objects.filter(
            application=application,
            created_by__in=[application.seeker, application.petpost.shelter],
        ).order_by("-created_at")
        return get_list_or_404(conversations)

    def create(self, request, *args, **kwargs):
        application = get_object_or_404(Application, id=self.kwargs["id"])

        # Save the object
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, application=application)
        return Response(serializer.data)
