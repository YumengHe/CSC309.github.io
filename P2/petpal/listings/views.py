from django.shortcuts import render

# Create your views here.
from django.views.generic.edit import CreateView
from .models import PetListing

class PetListingCreate(CreateView):
    model = PetListing
    fields = ['shelter', 'status', 'breed', 'age', 'size', 'color', 'gender']

from django.views.generic.edit import UpdateView

class PetListingUpdate(UpdateView):
    model = PetListing
    fields = ['shelter', 'status', 'breed', 'age', 'size', 'color', 'gender']

from django.views.generic.edit import DeleteView
from django.urls import reverse_lazy

class PetListingDelete(DeleteView):
    model = PetListing
    success_url = reverse_lazy('pet-listing-list')  # Redirect to the listing page after deletion

from django.views.generic.list import ListView

class PetListingList(ListView):
    model = PetListing
    queryset = PetListing.objects.exclude(status='deleted')  # Exclude deleted listings

class PetListingList(ListView):
    model = PetListing
    paginate_by = 10  # Pagination support

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.exclude(status='deleted')

        # Apply filters based on URL parameters
        shelter = self.request.GET.get('shelter')
        status = self.request.GET.get('status', 'available')
        breed = self.request.GET.get('breed')
        age = self.request.GET.get('age')
        
        if shelter:
            queryset = queryset.filter(shelter__icontains=shelter)
        if status:
            queryset = queryset.filter(status=status)
        if breed:
            queryset = queryset.filter(breed__icontains=breed)
        if age:
            queryset = queryset.filter(age=age)

        return queryset.order_by('name', 'age')  # Sorting options
