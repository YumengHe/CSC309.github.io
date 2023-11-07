from django.urls import path
from .views import RegisterView, LoginView, AccountInfoView


urlpatterns = [
    path('registration/', RegisterView.as_view(), name='registration'),
    path('auth/', LoginView.as_view(), name='authentication'),
    path('info/', AccountInfoView.as_view(), name='account-info'),
]
