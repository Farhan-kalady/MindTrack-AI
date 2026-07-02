import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import UserProfile
from apps.journal.models import JournalEntry

profiles = UserProfile.objects.all()
for profile in profiles:
    entries = JournalEntry.objects.filter(user=profile).order_by('created_at')
    
    current_streak = 0
    longest_streak = 0
    last_date = None
    
    for entry in entries:
        entry_date = entry.created_at.date()
        
        if last_date == entry_date:
            continue
        elif last_date is None:
            current_streak = 1
        elif last_date and (entry_date - last_date).days == 1:
            current_streak += 1
        else:
            current_streak = 1
            
        if current_streak > longest_streak:
            longest_streak = current_streak
            
        last_date = entry_date
        
    profile.current_streak = current_streak
    profile.longest_streak = longest_streak
    profile.last_entry_date = last_date
    profile.save()
    print(f"Updated {profile.email}: streak={current_streak}, longest={longest_streak}, last_entry={last_date}")

print("Streak recalculation complete!")
