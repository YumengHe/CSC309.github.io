from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PetPostViewSet, PetPostView, PetPostList, PetPostCreate

router = DefaultRouter()
router.register(r'petposts', PetPostViewSet)

urlpatterns = [
    # path('', include(router.urls)),
    path('', PetPostList.as_view(), name='petpost-list'),
    path('<int:id>/', PetPostView.as_view(), name='petpost-detail'),
    path('newpet/', PetPostCreate.as_view(), name='create-petpost'),
    # path('petposts/', PetPostList.as_view(), name='petpost-list'),
]
