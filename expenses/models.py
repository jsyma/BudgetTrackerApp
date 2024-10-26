from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Expenses(models.Model):
    categories = [
        ("1", "Food"),
        ("2", "Transportation"),
        ("3", "Personal"),
        ("4", "Recurring Expenses"),
        ("5", "Other"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=1, choices=categories)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
