from django.urls import path

urlpatterns = [
    path('/<int:id>', NotificationView.as_view(), name='notification-crud-view'),
]