from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import Http404
from rest_framework import permissions, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK

from join.serializers import ContactReadSerializer, ContactCreateSerializer, SubTaskSerializer, TaskReadSerializer, TaskCreateSerializer, TaskUpdateSerializer, AuthUserSerializer
from join.models import Contact, Task, SubTask

# Auth Views

class LoginView(APIView):

    def post(self, request):
        user = authenticate(username=request.data.get("username"), password=request.data.get("password"))
        if user:
            [token, created] = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': AuthUserSerializer(user).data
            }, status=HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=HTTP_400_BAD_REQUEST)


class RegisterView(APIView):

    def post(self, request):
        username = request.data.get("username")
        firstname = request.data.get("firstname")
        email = request.data.get("email")
        password = request.data.get("password")

        if not (username and password):
            return Response({'error': 'Missing fields'}, status=HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.first_name = firstname
            user.save()
            return Response(AuthUserSerializer(user).data, status=HTTP_200_OK)
        except IntegrityError:
            return Response({'error': 'Username or email already exists'}, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

class TokenValidationView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(HTTP_200_OK)

# Create your views here.
class ContactViewset(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ContactCreateSerializer
        return ContactReadSerializer


class TaskViewset(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskReadSerializer

    def get_serializer_class(self):
        if self.action in ['create']:
            return TaskCreateSerializer
        if self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskReadSerializer

class SubTaskViewset(viewsets.ModelViewSet):
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer