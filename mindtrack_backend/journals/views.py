from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import JournalEntry, EmotionAnalysis
from .serializers import JournalEntrySerializer
from .ai_service import analyze_emotion



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