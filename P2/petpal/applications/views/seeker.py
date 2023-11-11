from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..serializers import ApplicationSerializer
from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
)
from ..models import Application
from ..permissions import IsSeeker


class SeekerBase(GenericAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsSeeker]


class SeekerApplicationList(SeekerBase, ListAPIView):
    """Retrive a list of applications that submitted by the login user"""

    def get_queryset(self):
        applications = get_list_or_404(Application, seeker=self.request.user)
        return applications


class SeekerApplicationDetial(SeekerBase, RetrieveAPIView):
    """Retrive the specific application detail by its id for specific login user"""

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs["id"])
        self.check_object_permissions(self.request, application)
        return application
