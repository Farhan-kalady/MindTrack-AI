from django.contrib import admin
from django.urls import path, include
from journals.views import home_page
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy"}, status=200)

urlpatterns = [
    path('', home_page, name='home'),
    path('healthz/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('journals.urls')),

    # API Documentation URLs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'),
         name='swagger-ui'),
    path('api/schema/redoc/',
         SpectacularRedocView.as_view(url_name='schema'),
         name='redoc'),
]