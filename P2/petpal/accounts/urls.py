from django.urls import path
from .views import UserRegisterView, UserListByRoleView, UserUpdateView, UserLoginView, UserDeleteView

urlpatterns = [
    path('registration/', UserRegisterView.as_view(), name='registration'),
    path('auth/', UserLoginView.as_view(), name='authentication'),
    path('update/', UserUpdateView.as_view(), name='update'),
    path('delete/', UserDeleteView.as_view(), name='delete'),
    path('view/', UserListByRoleView.as_view(), name='view'),
]
