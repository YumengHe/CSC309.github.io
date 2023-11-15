from django.urls import path
from .views import ShelterUserCommentListView, ShelterUserCommentCreateView

urlpatterns = [
    path('users/<int:user_id>/shelter-comments/', ShelterUserCommentListView.as_view(), name='shelter-user-comment-list'),
    path('users/<int:user_id>/shelter-comments/create/', ShelterUserCommentCreateView.as_view(), name='shelter-user-comment-create'),
]
