from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema


@extend_schema(
    tags=['Authentication'],
    summary='Register a new user',
    description='Creates a new user account and returns JWT tokens.'
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'User registered successfully',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=201)


@extend_schema(
    tags=['Authentication'],
    summary='Login user',
    description='Authenticates user and returns JWT access and refresh tokens.'
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user_id': user.id,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=200)
    return Response({'error': 'Invalid credentials'}, status=401)