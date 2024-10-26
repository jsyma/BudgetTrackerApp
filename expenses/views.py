from rest_framework import generics, status 
from .serializers import ExpensesSerializer
from .models import Expenses
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username Taken'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User Created'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ExpensesView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated] 
    serializer_class = ExpensesSerializer

    def get_queryset(self):
        return Expenses.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        return self.create_expense(request, *args, **kwargs)

    def create_expense(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list_expenses(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def delete(self, request, pk, *args, **kwargs):
        return self.delete_expense(request, pk, *args, **kwargs)
    
    def delete_expense(self, request, pk, *args, **kwargs):
        try:
            expense = self.get_queryset().get(pk=pk)
            expense.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Expenses.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        categories = [
            {"id": "1", "name": "Food"},
            {"id": "2", "name": "Transportation"},
            {"id": "3", "name": "Personal"},
            {"id": "4", "name": "Recurring Expenses"},
            {"id": "5", "name": "Other"},
        ]
        return Response(categories, status=status.HTTP_200_OK)