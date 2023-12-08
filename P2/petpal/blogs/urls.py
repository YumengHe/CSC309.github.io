from django.urls import path

from .views import BlogPostView, BlogPostDetailView

urlpatterns = [
    path('', BlogPostView.as_view(), name='blogpost'),
    path('<int:pk>/', BlogPostDetailView.as_view(), name='blogpost-detail'),
]
