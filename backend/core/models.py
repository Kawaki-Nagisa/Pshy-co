from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(
        self, email, user_alias, date_of_birth=None, password=None, **extra_fields
    ):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            user_alias=user_alias,
            date_of_birth=date_of_birth,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email, user_alias, date_of_birth=None, password=None, **extra_fields
    ):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        return self.create_user(
            email, user_alias, date_of_birth, password, **extra_fields
        )


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    user_alias = models.CharField(max_length=30)
    date_of_birth = models.DateField(blank=True, null=True)
    date_created = models.DateTimeField(default=timezone.now)
    servers = models.ManyToManyField("Server", related_name="users")
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["user_alias"]

    def __str__(self):
        return self.user_alias


class Server(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    creator = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="created_servers"
    )
    members = models.ManyToManyField(CustomUser, related_name="joined_servers")

    def __str__(self):
        return self.name


class ChatMessage(models.Model):
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name="messages"
    )

    def __str__(self):
        return f"{self.sender.user_alias} - {self.content}"

    class Meta:
        ordering = ("timestamp",)
