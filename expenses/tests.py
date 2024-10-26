from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Expenses

class ExpensesViewTests(APITestCase):

    # Create Test User
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass') 
        self.expenses_url = reverse('expenses')

    # Test the creation/addition of a user's expense 
    def test_create_expense(self):
        sample_expense = {
            'name': 'Tim Hortons',
            'category': '1',
            'date': '2024-10-10',
            'amount': '10.10'
        }
        response = self.client.post(self.expenses_url, sample_expense, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Expenses.objects.count(), 1)

        created_expense = Expenses.objects.get()

        self.assertEqual(created_expense.name, 'Tim Hortons')
        self.assertEqual(created_expense.category, '1')
        self.assertEqual(created_expense.date.strftime('%Y-%m-%d'), '2024-10-10')
        self.assertEqual(str(created_expense.amount), '10.10')

    # Test the creation of multiple expenses and listing them
    def test_list_expenses(self):
        Expenses.objects.create(user=self.user, name='Tim Hortons', category='1', date='2024-10-10', amount='10.10')
        Expenses.objects.create(user=self.user, name='Spotify', category='4', date='2024-10-12', amount='6.00')
        Expenses.objects.create(user=self.user, name='Gym Membership', category='4', date='2024-10-17', amount='25.25')

        response = self.client.get(self.expenses_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 

        expected_expenses = [
          {'name': 'Tim Hortons', 'category': '1', 'date': '2024-10-10', 'amount': '10.10'},
          {'name': 'Spotify', 'category': '4', 'date': '2024-10-12', 'amount': '6.00'},
          {'name': 'Gym Membership', 'category': '4', 'date': '2024-10-17', 'amount': '25.25'}
        ]

        for i, expense in enumerate(response.data):
            self.assertEqual(expense['name'], expected_expenses[i]['name'])
            self.assertEqual(expense['category'], expected_expenses[i]['category'])
            self.assertEqual(expense['date'], expected_expenses[i]['date'])
            self.assertEqual(str(expense['amount']), expected_expenses[i]['amount'])

    # Test the successful deletion of an expense 
    def test_delete_expense(self):
        sample_expense = Expenses.objects.create(user=self.user, name='Tim Hortons', category='1', date='2024-10-10', amount='10.10')
        self.delete_url = reverse('delete_expense', args=[sample_expense.pk])
        
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Expenses.objects.count(), 0)