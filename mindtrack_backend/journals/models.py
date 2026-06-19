class JournalEntry(models.Model):
    """
    Stores a single journal entry for a user.

    Fields:
        user: ForeignKey to Django auth User
        entry_text: The main journal content written by user
        mood_score: Manual mood rating (1-10) by user
        created_at: Timestamp when entry was created
        updated_at: Timestamp when entry was last modified
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    entry_text = models.TextField()
    mood_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at.date()}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Journal Entry'
        verbose_name_plural = 'Journal Entries'


class EmotionAnalysis(models.Model):
    """
    Stores AI emotion analysis results for a journal entry.

    Fields:
        entry: OneToOne link to JournalEntry
        emotion: Detected emotion (happy/sad/anxious etc)
        sentiment: positive/negative/neutral
        mood_score: AI-assigned mood score (1-10)
        ai_feedback: Personalized wellness suggestion from AI
        created_at: When the analysis was performed
    """
    entry = models.OneToOneField(
        JournalEntry, on_delete=models.CASCADE
    )
    emotion = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=20)
    mood_score = models.IntegerField()
    ai_feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.emotion} - Entry #{self.entry.id}"