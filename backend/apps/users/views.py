from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from supabase import create_client
from django.conf import settings
from .models import UserProfile
from django.utils.timezone import now
import logging

logger = logging.getLogger(__name__)

def get_supabase_client():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')
        name     = request.data.get('name')
        consent  = request.data.get('consent_given', False)

        if not consent:
            return Response({'error': 'You must accept the AI data processing consent.'}, status=400)

        try:
            supabase = get_supabase_client()
            # Create Supabase Auth user
            res = supabase.auth.sign_up({'email': email, 'password': password})
            if res.user is None:
                return Response({'error': 'Registration failed.'}, status=400)

            # Create UserProfile
            UserProfile.objects.create(
                auth_user_id=res.user.id,
                email=email,
                name=name,
                consent_given=True,
                consent_ts=now()
            )

            return Response({
                'access_token':  res.session.access_token,
                'refresh_token': res.session.refresh_token,
                'user': {'name': name, 'email': email}
            }, status=201)
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return Response({'error': str(e)}, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')

        try:
            supabase = get_supabase_client()
            res = supabase.auth.sign_in_with_password({'email': email, 'password': password})
            if res.user is None:
                return Response({'error': 'Invalid credentials.'}, status=401)
            
            return Response({
                'access_token':  res.session.access_token,
                'refresh_token': res.session.refresh_token,
                'user': {'email': res.user.email}
            })
        except Exception as e:
            logger.error(f"Login error: {e}")
            return Response({'error': str(e)}, status=401)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            supabase = get_supabase_client()
            supabase.auth.sign_out()
        except Exception:
            pass
        return Response({"message": "Successfully logged out."})

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            supabase_admin = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
            user_id = request.user.profile.auth_user_id
            
            supabase_admin.auth.admin.delete_user(str(user_id))
            request.user.profile.delete()
            request.user.delete()
            return Response({"message": "Account deleted successfully."})
        except Exception as e:
            logger.error(f"Delete account error: {e}")
            return Response({'error': str(e)}, status=400)
