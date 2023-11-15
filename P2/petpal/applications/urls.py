from django.urls import path
from . import views

app_name = "application"
urlpatterns = [
    path("seeker/", views.SeekerApplicationList.as_view(), name="list_all"),
    path("seeker/<int:id>/", views.SeekerApplicationDetail.as_view(), name="detail"),
    path("shelter/", views.ShelterApplicationList.as_view(), name="list_all"),
    path("shelter/<int:id>/", views.ShelterApplicationDetail.as_view(), name="detail"),
    path("pet/<int:pet_id>/", views.SeekerApplicationCreate.as_view(), name="create"),
    path(
        "<int:id>/conversations/",
        views.ConversationListCreateView.as_view(),
        name="conversations",
    ),
]
