from django.urls import path
from .views import UserLoginView, UserView, UserListView, UserCreateView

urlpatterns = [
    path('auth/', UserLoginView.as_view(), name='authentication'),
    path('<int:id>/', UserView.as_view(), name='user-read-update-delete-view'),
    path('', UserCreateView.as_view(), name='user-create-view'),
    path('list/', UserListView.as_view(), name='user-list-view'),
]
