from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateAPIView,
)

from pets.models import PetPost
from ..serializers import ApplicationFullSerializer, ApplicationBasicSerializer
from ..models import Application
from ..permissions import IsSeeker
from ..paginations import BasePageNumberPagination


class SeekerBaseView(GenericAPIView):
    serializer_class = ApplicationBasicSerializer
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


class SeekerApplicationDetail(SeekerBaseView, RetrieveUpdateAPIView):
    """
    Retrieve the specific application detail by its id for specific login user,
        update its status from 'pending'/'accepted' to 'withdrawn'.
    """

    def get_serializer_class(self):
        # Use simplified version of serializer to update application status
        if self.request.method in ["PUT", "PATCH"]:
            return ApplicationBasicSerializer
        return ApplicationFullSerializer

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs["id"])
        # Need to explicitly check permissions for APIView
        # https://testdriven.io/blog/drf-permissions/#has_object_permission
        self.check_object_permissions(self.request, application)
        return application

    # Django REST Framework - Serializers
    # https://cheat.readthedocs.io/en/latest/django/drf_serializers.html#putting-an-object
    def update(self, request, *args, **kwargs):
        application = self.get_object()

        # Check if the current status allows the update to 'withdrawn'
        if application.status not in ["pending", "accepted"]:
            return Response(
                {"error": "Cannot withdraw the application with the current status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save update with status to 'withdrawn'
        serializer = self.get_serializer(
            application, data={"status": "withdrawn"}, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Create notification for status change,
        #   for seeker
        application.seeker.notifications.create(
            content=f"You have withdrawn your application to {application.petpost.name}.",
            event_link=f"/applications/seeker/{application.id}/",
        )
        #   for shelter
        application.petpost.shelter.notifications.create(
            content=f"Application to {application.petpost.name} has been withdrawn by {application.seeker}.",
            event_link=f"/applications/shelter/{application.id}/",
        )

        return Response(serializer.data)


class SeekerApplicationCreate(SeekerBaseView, CreateAPIView):
    """
    Create a new application for a pet with status 'available' from the login user
    REFER
        Django REST Framework - Serializers
        https://cheat.readthedocs.io/en/latest/django/drf_serializers.html#creating-a-new-object
    """

    serializer_class = ApplicationFullSerializer

    def create(self, request, *args, **kwargs):
        petpost = get_object_or_404(PetPost, id=self.kwargs["pet_id"])
        print("NEW Application for ", petpost, petpost.status)

        # Verify whether the application is for available petpost
        if petpost.status != "available":
            return Response(
                {"error": "Cannot submit application for unavailable pets."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check whether user has 'pending'/'accepted' application with the petpost already
        conflict_applications = Application.objects.filter(
            petpost=petpost, seeker=request.user, status__in=["pending", "accepted"]
        )
        # print(conflict_applications, conflict_applications.exists())
        if conflict_applications.exists():
            return Response(
                {"error": "You have a pending/accepted application for this pet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save the object
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(seeker=request.user, petpost=petpost)

        # Create notification with info of new application
        new_application = serializer.instance
        #   for seeker
        request.user.notifications.create(
            content=f"New application submitted for {new_application.petpost.name}.",
            event_link=f"/applications/seeker/{new_application.id}/",
        )
        #   for shelter
        petpost.shelter.notifications.create(
            content=f"New application received for {new_application.petpost.name} from applicant {new_application.seeker}.",
            event_link=f"/applications/shelter/{new_application.id}/",
        )

        return Response(serializer.data)
