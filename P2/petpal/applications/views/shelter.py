from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)

from ..serializers import ApplicationFullSerializer, ApplicationBasicSerializer
from ..permissions import IsShelter
from ..models import Application
from ..paginations import BasePageNumberPagination

from pets.models import PetPost


class ShelterBaseView(GenericAPIView):
    serializer_class = ApplicationBasicSerializer
    permission_classes = [IsShelter]


class ShelterApplicationList(ShelterBaseView, ListAPIView):
    """Retrieve a list of applications that submitted by the login user"""

    # To implement pagination,
    # add '?page_size=1&page=2' at end of URL (the 2nd page while each page contains 1 obj)
    pagination_class = BasePageNumberPagination

    def get_queryset(self):
        petposts = get_list_or_404(PetPost, owner=self.request.user)
        applications = Application.objects.filter(petpost__in=petposts)

        # Filter applications by status
        status_param = self.request.query_params.get("status")
        # Verify the status parameter
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


class ShelterApplicationDetail(ShelterBaseView, RetrieveUpdateAPIView):
    """
    Retrieve the specific application detail by its id for specific login user,
        update its status from 'pending' to 'accepted'/'denied'.
    """

    def get_serializer_class(self):
        # Use simplified version of serializer to update application status
        if self.request.method in ["PUT", "PATCH"]:
            return ApplicationBasicSerializer
        return ApplicationFullSerializer

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs["id"])
        # Need to explicitly check permissions
        self.check_object_permissions(self.request, application)
        return application

    # Django REST Framework - Serializers
    # https://cheat.readthedocs.io/en/latest/django/drf_serializers.html#putting-an-object
    def update(self, request, *args, **kwargs):
        application = self.get_object()

        # Check if the current status is 'pending'
        if application.status != "pending":
            return Response(
                {"error": "Cannot update the application with the current status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get the status from the request data then verify
        new_status = request.data.get("status", None)
        if new_status not in ["accepted", "denied"]:
            return Response(
                {
                    "error": "Invalid status. The status of application can be updated to accepted/denied."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save update
        serializer = self.get_serializer(
            application, data={"status": new_status}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
