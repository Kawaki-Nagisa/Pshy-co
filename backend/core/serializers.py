from rest_framework import serializers
from .models import CustomUser, Server, ChatMessage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

class UserSignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    user_alias = serializers.CharField(max_length=30)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    password_confirm = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate(self, data):
        password = data.get("password")
        password_confirm = data.get("password_confirm")

        if password and password_confirm and password != password_confirm:
            raise serializers.ValidationError("Passwords do not match")

        return data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    new_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )
    new_password_confirm = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate(self, data):
        password = data.get("new_password")
        password_confirm = data.get("new_password_confirm")

        if password and password_confirm and password != password_confirm:
            raise serializers.ValidationError("Passwords do not match")

        return data


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server
        fields = ["id", "name", "description", "creator", "members"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "creator": {"required": False},
            "members": {"required": False},
        }


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "content", "timestamp", "server"]


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "email",
            "user_alias",
            "date_of_birth",
            "date_created",
            "servers",
            "is_staff",
        )
