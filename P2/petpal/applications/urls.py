from django.urls import path
from . import views

app_name = "application"
urlpatterns = [
    path("seeker/", views.SeekerApplicationList.as_view(), name="list_all"),
    path("seeker/<int:id>/", views.SeekerApplicationDetial.as_view(), name="detail"),
    path("shelter/", views.ShelterApplicationList.as_view(), name="list_all"),
    path("shelter/<int:id>/", views.ShelterApplicationDetial.as_view(), name="detail"),
    path("<int:id>/", views.SeekerApplicationCreate.as_view(), name="create"),
]
