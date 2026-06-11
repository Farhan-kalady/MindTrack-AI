from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import JournalEntry, EmotionAnalysis
from .serializers import JournalEntrySerializer
from .ai_service import analyze_emotion
from django.utils import timezone
from datetime import timedelta



class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['mood_score']
    search_fields = ['entry_text']
    ordering_fields = ['created_at', 'mood_score']
    ordering = ['-created_at']

    def get_queryset(self):
        return JournalEntry.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='analyze')
    def analyze(self, request, pk=None):
        entry = self.get_object()
        try:
            result = analyze_emotion(entry.entry_text)
            emotion_obj, created = EmotionAnalysis.objects.update_or_create(
                entry=entry,
                defaults={
                    'emotion': result['emotion'],
                    'sentiment': result['sentiment'],
                    'mood_score': result['mood_score'],
                    'ai_feedback': result['feedback'],
                }
            )
            return Response({
                'message': 'Analysis complete',
                'emotion': result['emotion'],
                'sentiment': result['sentiment'],
                'mood_score': result['mood_score'],
                'feedback': result['feedback'],
            }, status=200)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=500)
            
            
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_history(request):
    entries = JournalEntry.objects.filter(
        user=request.user
    ).order_by('created_at').values(
        'id', 'mood_score', 'created_at'
    )
    return Response({
        'count': len(list(entries)),
        'mood_history': list(entries)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_summary(request):
    entries = JournalEntry.objects.filter(user=request.user)
    if not entries.exists():
        return Response({'message': 'No entries yet'})

    scores = [e.mood_score for e in entries if e.mood_score]
    avg_score = sum(scores) / len(scores) if scores else 0

    return Response({
        'total_entries': entries.count(),
        'average_mood_score': round(avg_score, 1),
        'highest_mood': max(scores) if scores else 0,
        'lowest_mood': min(scores) if scores else 0,
    })   


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_summary(request):
    # Get entries from last 7 days
    week_ago = timezone.now() - timedelta(days=7)
    entries = JournalEntry.objects.filter(
        user=request.user,
        created_at__gte=week_ago
    )

    if not entries.exists():
        return Response({
            'message': 'No entries in the last 7 days',
            'total_entries': 0
        })

    scores = [e.mood_score for e in entries if e.mood_score]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0

    # Get emotion breakdown if available
    from .models import EmotionAnalysis
    emotions = EmotionAnalysis.objects.filter(
        entry__user=request.user,
        entry__created_at__gte=week_ago
    ).values_list('emotion', flat=True)

    emotion_count = {}
    for emotion in emotions:
        emotion_count[emotion] = emotion_count.get(emotion, 0) + 1

    return Response({
        'period': 'Last 7 days',
        'total_entries': entries.count(),
        'average_mood_score': avg_score,
        'highest_mood': max(scores) if scores else 0,
        'lowest_mood': min(scores) if scores else 0,
        'emotion_breakdown': emotion_count,
        'wellness_tip': get_wellness_tip(avg_score)
    })

def get_wellness_tip(avg_score):
    if avg_score >= 8:
        return "Excellent week! You are thriving. Keep up your positive habits."
    elif avg_score >= 6:
        return "Good week overall! Try to identify what made your best days great."
    elif avg_score >= 4:
        return "Mixed week. Consider adding a short daily walk or meditation."
    else:
        return "Tough week. Please reach out to someone you trust for support."             