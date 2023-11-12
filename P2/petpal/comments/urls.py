from django.urls import path
from . import views  # Adjust this import statement based on your views file structure

urlpatterns = [
    # Endpoint for listing all comments and creating a new comment
    path('comments/', views.CommentListCreate.as_view(), name='comment-list-create'),

    # Endpoints for listing and creating comments specifically for shelters
    path('shelters/<int:shelter_id>/comments/',
         views.ShelterCommentListCreate.as_view(),
         name='shelter-comment-list-create'),

    # Endpoints for listing and creating comments specifically for applications
    path('applications/<int:application_id>/comments/',
         views.ApplicationCommentListCreate.as_view(),
         name='application-comment-list-create'),
]
