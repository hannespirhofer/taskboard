from rest_framework import serializers
from join.models import Contact, Task, SubTask
from django.contrib.auth.models import User
from join.constants import *

class AuthUserSerializer(serializers.ModelSerializer):
    firstname = serializers.CharField(source='first_name')
    lastname = serializers.CharField(source='last_name')

    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'email', 'username']


class ContactReadSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    contactid = serializers.SerializerMethodField()

    def get_contactid(self, obj):
        return obj.pk

    def get_phone(self, obj):
        if obj.phone  == '':
            return ''
        return f"+39{obj.phone}"

    def get_fullname(self, obj):
        return f"{obj.firstname} {obj.lastname}"

    def get_initials(self, obj):
        first = obj.firstname[0].upper() or ''
        last = obj.lastname[0].upper() or ''
        return f"{first}{last}"

    class Meta():
        model = Contact
        fields = [
            'firstname',
            'lastname',
            'fullname',
            'email',
            'phone',
            'initials',
            'contactid'
        ]

class ContactCreateSerializer(serializers.ModelSerializer):
    class Meta():
        model = Contact
        fields = '__all__'


class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = '__all__'

class TaskDropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class TaskReadSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'category', 'priority', 'progress', 'duedate', 'contactids', 'subtasks']

class TaskCreateSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True)
    priority = serializers.ChoiceField(choices=PRIORITIES, default='medium', required=False)

    def create(self, validated_data):
        subtasks = validated_data.pop("subtasks", [])
        task = super().create(validated_data)
        for subtask in subtasks:
            SubTask.objects.create(parent=task, **subtask)
        return task

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'category', 'priority', 'progress', 'duedate', 'contactids', 'subtasks']

class TaskUpdateSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True)
    priority = serializers.ChoiceField(choices=PRIORITIES, default='medium', required=False)

    def update(self, instance, validated_data):
        subtasks = validated_data.pop("subtasks", [])
        # instance = self.get_object()
        task = super().update(instance, validated_data)

        received_subtask_ids = set()

        for subtask in subtasks:
            # Update Subtask if there is an id
            if "id" in subtask:
                print('FIRST')
                id = subtask.get("id")
                SubTask.objects.filter(pk=id).update(parent=task, **subtask)
                received_subtask_ids.add(id)
            else:
                # Create subtask if there is no id and a parent id
                if subtask.get("parent"):
                    subtask.pop("parent")
                new_subtask = SubTask.objects.create(parent=task, **subtask)
                received_subtask_ids.add(new_subtask.id)

        SubTask.objects.filter(parent=task).exclude(id__in=received_subtask_ids).delete()
        return task

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'category', 'priority', 'progress', 'duedate', 'contactids', 'subtasks']