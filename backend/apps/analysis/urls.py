from django.urls import path
from .views import AnalyzeEntryView, AssistantChatView

urlpatterns = [
    path('analyze/<uuid:pk>/', AnalyzeEntryView.as_view(), name='analyze-entry'),
    path('assistant/chat/', AssistantChatView.as_view(), name='assistant-chat'),
]
