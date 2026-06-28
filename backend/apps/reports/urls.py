from django.urls import path
from .views import (
    MoodHistoryView, 
    MoodSparklineView, 
    EmotionSummaryView, 
    LatestWeeklyReportView, 
    GenerateWeeklyReportView
)

urlpatterns = [
    path('mood/history/', MoodHistoryView.as_view(), name='mood-history'),
    path('mood/sparkline/', MoodSparklineView.as_view(), name='mood-sparkline'),
    path('mood/emotions/summary/', EmotionSummaryView.as_view(), name='emotion-summary'),
    path('mood/summary/', LatestWeeklyReportView.as_view(), name='latest-weekly-summary'),
    path('mood/summary/generate/', GenerateWeeklyReportView.as_view(), name='generate-weekly-summary'),
]
