from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    SignupViewSet,
    LoginViewSet,
    ChangePasswordViewSet,
    ServerViewSet,
    ChatMessageViewSet,
    CustomUserViewSet
)


router = routers.SimpleRouter()

router.register(r"user", CustomUserViewSet, basename="user")
router.register(r"signup", SignupViewSet, basename="signup")
router.register(r"login", LoginViewSet, basename="login")
router.register(r"change_password", ChangePasswordViewSet, basename="change_password")
router.register(r"server", ServerViewSet, basename="server")
router.register(r"chat", ChatMessageViewSet, basename="chat")

urlpatterns = [
    path("", include(router.urls)),
]
