from django.contrib import admin

from join.models import AppUser, Contact, Task, SubTask

class SubTaskInline(admin.TabularInline):
    model = SubTask
    extra = 1

class TaskAdmin(admin.ModelAdmin):
    inlines = [SubTaskInline]

# Register your models here.
admin.site.register(Task, TaskAdmin)
admin.site.register([AppUser, Contact, SubTask])
