from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .views import HealthCheckView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', HealthCheckView.as_view(), name='health-check'),
    
    # Swagger UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Apps
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.journal.urls')),
    path('api/', include('apps.analysis.urls')),
    path('api/', include('apps.reports.urls')),
]
