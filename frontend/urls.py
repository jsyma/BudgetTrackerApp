from django.urls import path
from .views import index 

urlpatterns = [
    path('', index),
    path('add-expenses/', index),
    path('view-expenses/', index),
    path('view-all-expenses/', index)
]
