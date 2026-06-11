from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import JournalEntry

class JournalAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_journal_entry(self):
        data = {
            'entry_text': 'Test journal entry today',
            'mood_score': 7
        }
        response = self.client.post('/api/journals/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JournalEntry.objects.count(), 1)

    def test_get_journal_entries(self):
        JournalEntry.objects.create(
            user=self.user,
            entry_text='Test entry',
            mood_score=5
        )
        response = self.client.get('/api/journals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorized_access(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/journals/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_weekly_summary(self):
        JournalEntry.objects.create(
            user=self.user,
            entry_text='Weekly test entry',
            mood_score=8
        )
        response = self.client.get('/api/mood/weekly/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)