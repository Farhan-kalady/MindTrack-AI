from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'journals', views.JournalEntryViewSet, basename='journal')

urlpatterns = [
    path('', include(router.urls)),
    path('mood/history/', views.mood_history, name='mood-history'),
    path('mood/summary/', views.mood_summary, name='mood-summary'),
    path('mood/weekly/', views.weekly_summary, name='weekly-summary'),
]