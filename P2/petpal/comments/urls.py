from django.urls import path
from .views import ShelterUserCommentsView

urlpatterns = [
    path('shelter-comments/<int:user_id>/', ShelterUserCommentsView.as_view(), name='shelter-user-comments'),
]
