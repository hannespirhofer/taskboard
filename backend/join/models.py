from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Contact(models.Model):
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    email = models.EmailField()
    phone = models.CharField(max_length=12, null=True, blank=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname} [{self.pk}]"

class Task(models.Model):
    PRIORITIES = {
        'urgent': 'urgent',
        'medium': 'medium',
        'low': 'low'
    }
    COLUMNS = {
        'todo': 'ToDo',
        'inprogress': 'In Progress',
        'awaitfeedback': 'Await Feedback',
        'done': 'Done',
    }
    CATEGORIES = {
        'Technical Task': 'Technical Task',
        'User Story': 'User Story'
    }

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=30, choices=CATEGORIES, default='Technical Task')
    contactids = models.ManyToManyField(Contact, blank=True)
    priority = models.CharField(max_length=30, choices=PRIORITIES, default='medium')
    progress = models.CharField(max_length=30, choices=COLUMNS, default='todo')
    duedate = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} [{self.pk}]"

class SubTask(models.Model):
    name = models.CharField(max_length=150)
    isToggled = models.BooleanField(default=False)
    parent = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks', blank=True)

    def __str__(self):
        return f"{self.name}"
