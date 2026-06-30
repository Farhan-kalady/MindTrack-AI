from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from supabase import create_client
from .models import UserProfile
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

class SupabaseJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        try:
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            response = supabase.auth.get_user(token)
            
            if not response or not response.user:
                raise AuthenticationFailed(_('Token is invalid or expired'), code='token_not_valid')
                
            user_id = response.user.id
            profile = UserProfile.objects.get(auth_user_id=user_id)
            user, created = User.objects.get_or_create(username=str(user_id))
            if created:
                user.email = profile.email
                user.save()
            user.profile = profile
            return (user, token)
            
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed(_('User profile not found'), code='user_not_found')
        except Exception as e:
            logger.error(f"Supabase auth error: {e}")
            raise AuthenticationFailed(_('Authentication failed'), code='authentication_failed')
