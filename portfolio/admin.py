from django.contrib import admin

from .models import ContactMessage, Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "codename", "status", "signal", "order", "is_featured")
    list_filter = ("status", "is_featured")
    search_fields = ("title", "codename", "summary", "tech_stack")
    ordering = ("order", "title")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "is_read")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at",)
