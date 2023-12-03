from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Server, ChatMessage


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("email", "user_alias", "date_of_birth", "is_staff")
    list_filter = ("is_staff", "is_superuser", "date_of_birth")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("user_alias", "date_of_birth")}),
        ("Servers", {"fields": ("servers",), "classes": ("wide",)}),
        ("Permissions", {"fields": ("is_staff", "is_superuser")}),
        ("Important Dates", {"fields": ("last_login", "date_created")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "user_alias",
                    "date_of_birth",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    search_fields = ("email", "user_alias")
    ordering = ("email",)
    filter_horizontal = ("servers",)


@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ("name", "creator")
    list_filter = ("creator",)
    search_fields = ("name", "creator__user_alias")


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = (
        "sender",
        "content",
        "timestamp",
        "server",
    )
    list_filter = ("server",)
    search_fields = ("sender__user_alias", "content", "server")
