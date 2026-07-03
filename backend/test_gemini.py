import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.analysis.gemini import analyze_entry

print("=== TEST ENTRY ===")
result1 = analyze_entry("I am extremely happy today, everything went perfectly!")
print("Happy Result:", result1)

result2 = analyze_entry("I feel so sad and lonely today, nothing is going right")
print("Sad Result:", result2)
print("==================")
