from django.urls import path
from .views import PetListingCreate, PetListingUpdate, PetListingDelete, PetListingList

urlpatterns = [
    path('create/', PetListingCreate.as_view(), name='pet-listing-create'),
    path('update/<int:pk>/', PetListingUpdate.as_view(), name='pet-listing-update'),
    path('delete/<int:pk>/', PetListingDelete.as_view(), name='pet-listing-delete'),
    path('', PetListingList.as_view(), name='pet-listing-list'),
]
