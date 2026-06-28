from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from apps.journal.models import JournalEntry
from apps.analysis.models import EmotionAnalysis
from .models import WeeklyReport
from .serializers import WeeklyReportSerializer
from apps.analysis.gemini import generate_weekly_summary
from django.db.models import Count

class MoodHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        analyses = EmotionAnalysis.objects.filter(
            entry__user=request.user.profile,
            entry__created_at__gte=start_date
        ).order_by('entry__created_at')

        data = []
        for a in analyses:
            data.append({
                'date': a.entry.created_at.strftime('%Y-%m-%d'),
                'mood_score': a.mood_score,
                'emotion': a.emotion,
            })
        return Response(data)

class MoodSparklineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        analyses = EmotionAnalysis.objects.filter(
            entry__user=request.user.profile,
            entry__created_at__gte=start_date
        ).order_by('entry__created_at')

        scores = [a.mood_score for a in analyses]
        dates = [a.entry.created_at.strftime('%b %d') for a in analyses]

        return Response({
            "scores": scores,
            "dates": dates
        })

class EmotionSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        counts = EmotionAnalysis.objects.filter(
            entry__user=request.user.profile,
            entry__created_at__gte=start_date
        ).values('emotion').annotate(count=Count('emotion'))
        
        result = {item['emotion']: item['count'] for item in counts}
        return Response(result)

class LatestWeeklyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        report = WeeklyReport.objects.filter(user=request.user.profile).order_by('-week_start').first()
        if report:
            return Response(WeeklyReportSerializer(report).data)
        return Response({"detail": "No weekly report found."}, status=404)

class GenerateWeeklyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        entries = JournalEntry.objects.filter(
            user=request.user.profile,
            created_at__date__gte=week_start,
            created_at__date__lte=week_end
        ).select_related('analysis')

        if not entries.exists():
            return Response({"error": "No entries this week to analyze."}, status=400)

        entries_data = []
        for e in entries:
            analysis = getattr(e, 'analysis', None)
            entries_data.append({
                "date": e.created_at.strftime('%Y-%m-%d'),
                "content": e.content,
                "emotion": analysis.emotion if analysis else "neutral",
                "mood_score": analysis.mood_score if analysis else 5
            })

        result = generate_weekly_summary(entries_data)

        report, _ = WeeklyReport.objects.update_or_create(
            user=request.user.profile,
            week_start=week_start,
            defaults={
                'week_end': week_end,
                'dominant_emotion': result.get('dominant_emotion', 'neutral'),
                'average_mood_score': result.get('average_mood_score', 5.0),
                'mood_trend': result.get('mood_trend', 'stable'),
                'week_summary': result.get('week_summary', ''),
                'weekly_suggestion': result.get('weekly_suggestion', ''),
                'entries_count': entries.count()
            }
        )

        return Response(WeeklyReportSerializer(report).data)
