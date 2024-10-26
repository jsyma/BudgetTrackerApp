from django.urls import path
from .views import ExpensesView, CategoryListView, register, login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'), 
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('expenses/', ExpensesView.as_view(), name='expenses'),
    path('expenses/<int:pk>/', ExpensesView.as_view(), name='delete_expense'),
    path('categories/', CategoryListView.as_view(), name='categories_list'),
]
