from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)

from ..serializers import ApplicationSerializer, ApplicationStatusSerializer
from ..models import Application
from ..permissions import IsSeeker
from ..paginations import BasePageNumberPagination


class SeekerBaseView(GenericAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsSeeker]


class SeekerApplicationList(SeekerBaseView, ListAPIView):
    """Retrieve a list of applications that submitted by the login user"""

    # To implement pagination,
    # add '?page_size=1&page=2' at end of URL (the 2nd page while each page contains 1 obj)
    pagination_class = BasePageNumberPagination

    def get_queryset(self):
        applications = Application.objects.filter(seeker=self.request.user)

        # Filter applications by status
        status_param = self.request.query_params.get("status", None)
        # Varify the status parameter
        if status_param is not None and any(
            status_param in STATUS for STATUS in Application.STATUS_CHOICE
        ):
            applications = applications.filter(status=status_param)

        # Sort applications by create time or update time
        sort_param = self.request.query_params.get("sort", None)
        if sort_param == "creation":
            applications = applications.order_by("created_at")
        elif sort_param == "-creation":
            applications = applications.order_by("-created_at")
        elif sort_param == "update":
            applications = applications.order_by("-last_updated")
        elif sort_param == "-update":
            applications = applications.order_by("last_updated")

        return get_list_or_404(applications)


class SeekerApplicationDetial(SeekerBaseView, RetrieveUpdateAPIView):
    """
    Retrieve the specific application detail by its id for specific login user,
        update its status from 'pending'/'accepted' to 'withdrawn'.
    """

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return ApplicationStatusSerializer
        return ApplicationSerializer

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs["id"])
        # Need to explicitly check permissions
        self.check_object_permissions(self.request, application)
        return application

    def update(self, request, *args, **kwargs):
        application = self.get_object()

        # Check if the current status allows the update to 'withdrawn'
        if application.status not in ["pending", "accepted"]:
            return Response(
                {"error": "Cannot withdraw the application with the current status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the status to 'withdrawn'
        application.status = "withdrawn"
        application.save()

        # Return the updated data
        serializer = self.get_serializer(application)
        return Response(serializer.data)
