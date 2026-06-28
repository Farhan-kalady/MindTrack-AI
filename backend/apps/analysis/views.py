from django.shortcuts import get_object_or_404
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.journal.models import JournalEntry
from .models import EmotionAnalysis
from .serializers import EmotionAnalysisSerializer
from .gemini import analyze_entry

@method_decorator(ratelimit(key='user', rate='10/h', method='POST', block=True), name='dispatch')
class AnalyzeEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        entry = get_object_or_404(JournalEntry, pk=pk, user=request.user.profile)
        result = analyze_entry(entry.content)

        analysis, _ = EmotionAnalysis.objects.update_or_create(
            entry=entry,
            defaults={
                'emotion':             result.get('emotion', 'neutral'),
                'sentiment':           result.get('sentiment', 'neutral'),
                'mood_score':          result.get('mood_score', 5),
                'wellness_suggestion': result.get('wellness_suggestion', ''),
                'crisis_detected':     result.get('crisis_detected', False),
                'gemini_model_used':   'gemini-1.5-flash',
                'analysis_error':      result.get('error', False),
            }
        )
        return Response(EmotionAnalysisSerializer(analysis).data)
