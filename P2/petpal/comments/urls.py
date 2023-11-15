from django.urls import path
from .views import ShelterUserCommentListView, ShelterUserCommentCreateView

urlpatterns = [
    path('shelter-comments/<int:user_id>/', ShelterUserCommentListView.as_view(), name='shelter-user-comment-list'),
    path('shelter-comments/<int:user_id>/create/', ShelterUserCommentCreateView.as_view(), name='shelter-user-comment-create'),
]
