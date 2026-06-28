from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from datetime import timedelta
from .models import JournalEntry
from .serializers import JournalEntrySerializer
from .ai_service import analyze_emotion, generate_weekly_summary
from .models import EmotionAnalysis
from drf_spectacular.utils import extend_schema
from django_ratelimit.decorators import ratelimit


@extend_schema(tags=['Journals'])
class JournalEntryViewSet(viewsets.ModelViewSet):
    """
    Journal Entry CRUD Operations.

    list: Get all journal entries for authenticated user.
    create: Create a new journal entry.
    retrieve: Get a specific journal entry by ID.
    update: Update a journal entry.
    destroy: Delete a journal entry.
    """
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
        ).select_related('emotionanalysis').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema(tags=['Mood Analytics'], summary='Get mood history')
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_history(request):
    entries = JournalEntry.objects.filter(
        user=request.user
    ).order_by('created_at').values('id', 'mood_score', 'created_at')
    return Response({
        'count': len(list(entries)),
        'mood_history': list(entries)
    })


@extend_schema(tags=['Mood Analytics'], summary='Get mood summary statistics')
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


@extend_schema(tags=['Mood Analytics'], summary='Get weekly mood summary')
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_summary(request):
    week_ago = timezone.now() - timedelta(days=7)
    entries = JournalEntry.objects.filter(
        user=request.user,
        created_at__gte=week_ago
    ).select_related('emotionanalysis').order_by('created_at')
    
    if not entries.exists():
        return Response({
            'message': 'No entries in last 7 days', 
            'total_entries': 0,
            'ai_summary': 'You have no journal entries for this period. Try writing more entries to generate a summary.'
        })
        
    scores = [e.mood_score for e in entries if e.mood_score]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    
    # Format entries for the AI summary
    entries_list = []
    for entry in entries:
        emotion = "unknown"
        if hasattr(entry, 'emotionanalysis'):
            emotion = entry.emotionanalysis.emotion
        entries_list.append({
            'text': entry.entry_text,
            'mood_score': entry.mood_score or 5,
            'emotion': emotion,
            'created_at': entry.created_at
        })
        
    ai_summary = generate_weekly_summary(entries_list)
    
    return Response({
        'period': 'Last 7 days',
        'total_entries': entries.count(),
        'average_mood_score': avg_score,
        'highest_mood': max(scores) if scores else 0,
        'lowest_mood': min(scores) if scores else 0,
        'ai_summary': ai_summary,
    })


def get_wellness_tip(avg_score):
    if avg_score >= 8:
        return "Excellent week! Keep up your positive habits."
    elif avg_score >= 6:
        return "Good week! Try to identify what made your best days great."
    elif avg_score >= 4:
        return "Mixed week. Consider adding a short daily walk."
    else:
        return "Tough week. Please reach out to someone you trust."


@extend_schema(
    tags=['AI Analysis'],
    summary='Analyze journal entry emotions',
    description='Uses Google Gemini AI to detect emotions and provide wellness suggestions.'
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@ratelimit(key='user', rate='5/m', block=False)
def analyze_entry(request, pk):
    # Check rate limiting
    if getattr(request, 'limited', False):
        return Response(
            {'error': 'Rate limit exceeded. You can only analyze 5 entries per minute.'},
            status=429
        )

    try:
        entry = JournalEntry.objects.get(
            pk=pk,
            user=request.user
        )
    except JournalEntry.DoesNotExist:
        return Response(
            {'error': 'Journal entry not found'},
            status=404
        )

    try:
        result = analyze_emotion(entry.entry_text)

        EmotionAnalysis.objects.update_or_create(
            entry=entry,
            defaults={
                'emotion': result['emotion'],
                'sentiment': result['sentiment'],
                'mood_score': result['mood_score'],
                'ai_feedback': result['feedback'],
            }
        )

        # Update entry mood score with AI score
        entry.mood_score = result['mood_score']
        entry.save()

        return Response({
            'message': 'Analysis complete',
            'entry_id': pk,
            'emotion': result['emotion'],
            'sentiment': result['sentiment'],
            'mood_score': result['mood_score'],
            'feedback': result['feedback'],
            'keywords': result.get('keywords', [])
        }, status=200)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


@extend_schema(
    tags=['AI Analysis'],
    summary='Simulate journal entry emotions without authentication',
    description='Uses Google Gemini AI to analyze a journal entry without saving it.'
)
@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/m', block=False)
def simulate_analysis(request):
    # Check rate limiting
    if getattr(request, 'limited', False):
        return Response(
            {'error': 'Rate limit exceeded. You can only simulate 5 analyses per minute.'},
            status=429
        )

    text = request.data.get('text', '').strip()
    if not text:
        return Response(
            {'error': 'Text content is required'},
            status=400
        )

    try:
        result = analyze_emotion(text)
        return Response({
            'emotion': result.get('emotion', 'neutral'),
            'sentiment': result.get('sentiment', 'neutral'),
            'mood_score': result.get('mood_score', 5),
            'feedback': result.get('feedback', ''),
            'keywords': result.get('keywords', [])
        }, status=200)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


def home_page(request):
    """
    Renders the MindTrack AI landing / home page.
    """
    return render(request, 'journals/home.html')