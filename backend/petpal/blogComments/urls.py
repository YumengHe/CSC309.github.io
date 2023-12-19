from django.urls import path
from .views import BlogCommentsView

urlpatterns = [
    path('<int:blog_id>/', BlogCommentsView.as_view(), name='blog-comments'),
]
