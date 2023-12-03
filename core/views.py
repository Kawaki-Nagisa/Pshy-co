from rest_framework import status
from rest_framework.mixins import (
    CreateModelMixin,
)
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.shortcuts import get_object_or_404


from .serializers import (
    UserSignupSerializer,
    UserLoginSerializer,
    ChangePasswordSerializer,
    ChatMessageSerializer,
    ServerSerializer,
    CustomUserSerializer,
)
from .models import CustomUser, Server, ChatMessage
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime


class CustomUserViewSet(GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    @action(detail=False, methods=["POST"])
    def reterieve(self, request, pk=None):
        user = request.data.get("user_id", pk)
        queryset = self.get_queryset().filter(id=user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class SignupViewSet(GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSignupSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]

            if CustomUser.objects.filter(email=email).exists():
                return Response(
                    {"error": f"A user with the email '{email}' already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = CustomUser.objects.create_user(
                email=email,
                user_alias=serializer.validated_data["user_alias"],
                password=request.data["password"],
            )
            return Response("Successfully Signed Up", status=status.HTTP_201_CREATED)
            # login_data = {
            #     "email": email,
            #     "password": request.data["password"],
            # }
            # request._data = login_data
            # login_viewset = LoginViewSet()

            # login_response = login_viewset.create(request)

            # try:
            #     return login_response
            # except Exception as e:
            #     return Response(
            #         {"error": f"Failed to log in user: {str(e)}"},
            #         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            #     )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginViewSet(GenericViewSet, CreateModelMixin):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
            
            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                user_data = CustomUserSerializer(user).data
                response_data = {
                    "user": user_data,
                    "access_token": access_token,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Invalid login credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordViewSet(GenericViewSet):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data["current_password"]):
                user.set_password(serializer.validated_data["new_password"])
                user.save()
                update_session_auth_hash(request, user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Invalid current password"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatMessageViewSet(GenericViewSet):
    queryset = ChatMessage.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer

    @action(detail=False, methods=["POST"])
    def add_message(self, request):
        request.data["timestamp"] = datetime.now().isoformat()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(sender=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["PATCH"])
    def update_message(self, request, pk=None):
        message_id = request.data.get("message_id", pk)
        instance = get_object_or_404(ChatMessage, pk=message_id)
        if instance.sender != request.user:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response_data = {
            "id": instance.id,
            "content": serializer.data["content"],
        }

        return Response(
            {"detail": "Message updated successfully.", "data": response_data}
        )

    @action(detail=False, methods=["DELETE"])
    def delete_message(self, request, pk=None):
        message_id = request.data.get("message_id", pk)
        instance = get_object_or_404(ChatMessage, pk=message_id)

        if instance.sender != request.user:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )

        message_id = instance.id
        instance.delete()

        return Response({"Message Successfully deleted": message_id})

    @action(detail=False, methods=["POST"])
    def get_messages_for_server(self, request, pk=None):
        """
        Retrieve all messages for a specific server.
        """
        server = request.data.get("server_id", pk)
        queryset = self.get_queryset().filter(server_id=server)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ServerViewSet(GenericViewSet):
    queryset = Server.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ServerSerializer

    @action(detail=False, methods=["POST"])
    def create_server(self, request):
        user = request.user

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            server = serializer.save(creator=user)
            server.members.add(user)

            user.servers.add(server)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["POST"])
    def join_server(self, request, pk=None):
        print(request.data)
        server_id = request.data.get("server_id", pk)
        user = request.user
        server = get_object_or_404(Server, pk=server_id)

        if user not in server.members.all():
            server.members.add(user)

            user.servers.add(server)

            return Response("You have joined the server.", status=status.HTTP_200_OK)
        else:
            return Response(
                "User is already a member of the server.",
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["DELETE"])
    def delete_server(self, request, pk=None):
        user = request.user
        server_id = request.query_params.get("server_id")
        server = get_object_or_404(Server, pk=server_id)

        if user == server.creator:
            server.members.clear()

            user_servers = CustomUser.objects.filter(servers=server.id)
            for user_server in user_servers:
                user_server.servers.remove(server)

            server.delete()

            return Response(
                "Server deleted successfully.", status=status.HTTP_204_NO_CONTENT
            )
        else:
            return Response(
                "You don't have permission to delete this server.",
                status=status.HTTP_403_FORBIDDEN,
            )

    @action(detail=False, methods=["GET"])
    def retrieve_data(self, request):
        server_id = request.query_params.get("server_id")
        server = get_object_or_404(Server, pk=server_id)
        serializer = self.get_serializer(server)
        return Response(serializer.data, status=status.HTTP_200_OK)
