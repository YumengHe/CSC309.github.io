from django.urls import path
from . import views

app_name = "application"
urlpatterns = [
    path("seeker/", views.SeekerApplicationList.as_view(), name="list_all"),
    path("seeker/<int:id>/", views.SeekerApplicationDetial.as_view(), name="detail"),
    path("shelter/", views.ShlterApplicationList.as_view(), name="list_all"),
    path("shelter/<int:id>/", views.ShlterApplicationDetial.as_view(), name="detail"),
]
