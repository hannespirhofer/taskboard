# Generated by Django 5.1.7 on 2025-03-13 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('join', '0010_alter_task_progress'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='category',
            field=models.CharField(choices=[('Technical Task', 'Technical Task'), ('User Story', 'User Story')], default='Technical Task', max_length=30),
        ),
    ]
