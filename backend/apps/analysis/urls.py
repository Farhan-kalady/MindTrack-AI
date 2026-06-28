from django.urls import path
from .views import AnalyzeEntryView

urlpatterns = [
    path('analyze/<uuid:pk>/', AnalyzeEntryView.as_view(), name='analyze-entry'),
]
