from django.urls import path
from .views import UserLoginView, UserView, UserListView

urlpatterns = [
    path('auth/', UserLoginView.as_view(), name='authentication'),
    path('/<int:id>', UserView.as_view(), name='user-crud-view'),
    path('/', UserListView.as_view(), name='user-list-view'),
]
