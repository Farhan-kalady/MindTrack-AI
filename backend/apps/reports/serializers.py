from rest_framework import serializers
from .models import WeeklyReport

class WeeklyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyReport
        fields = '__all__'
