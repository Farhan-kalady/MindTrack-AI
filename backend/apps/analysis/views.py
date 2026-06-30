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

@method_decorator(ratelimit(key='user', rate='20/h', method='POST', block=True), name='dispatch')
class AssistantChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        if not user_message:
            return Response({'reply': "Please provide a message."}, status=400)

        # Get last 10 entries with their analysis
        entries = JournalEntry.objects.filter(user=request.user.profile).select_related('analysis').order_by('-created_at')[:10]
        
        history_lines = []
        for e in entries:
            date_str = e.created_at.strftime('%Y-%m-%d')
            if hasattr(e, 'analysis'):
                history_lines.append(f"[{date_str}] Emotion: {e.analysis.emotion}, Score: {e.analysis.mood_score}/10, Entry snippet: {e.content[:100]}...")
            else:
                history_lines.append(f"[{date_str}] Entry snippet: {e.content[:100]}...")
                
        history_text = "\n".join(history_lines) if history_lines else "No previous journal entries found."

        from .gemini import chat_with_assistant
        reply = chat_with_assistant(history_text, user_message)

        return Response({'reply': reply})

