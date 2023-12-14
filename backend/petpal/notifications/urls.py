from django.urls import path
from . import views

urlpatterns = [
    path("<int:id>/", views.NotificationView.as_view(), name="notification-crud-view"),
    path("", views.NotificationList.as_view(), name="list_all"),
]
