from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from .models import UserProfile
from django.contrib.auth.models import User

class SupabaseJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('sub')
        if not user_id:
            raise AuthenticationFailed(_('Token contained no recognizable user identification'), code='token_not_valid')

        try:
            profile = UserProfile.objects.get(auth_user_id=user_id)
            user, created = User.objects.get_or_create(username=str(user_id))
            if created:
                user.email = profile.email
                user.save()
            user.profile = profile
            return user
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed(_('User not found'), code='user_not_found')
