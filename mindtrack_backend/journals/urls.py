from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'journals', views.JournalEntryViewSet, basename='journal')

urlpatterns = [
    path('', include(router.urls)),
]