from django.urls import path
from .views import ShelterUserCommentsView, BlogCommentsView

urlpatterns = [
    path('shelter-comments/<int:user_id>/', ShelterUserCommentsView.as_view(), name='shelter-user-comments'),
    path('blog-comments/<int:blog_id>/', BlogCommentsView.as_view(), name='blog-comments'),
]
