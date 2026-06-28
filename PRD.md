# Product Requirements Document (PRD)
## MindTrack AI — Mental Health Journal & Emotion Tracker
### Enhanced Edition — Gemini API Focus

**Author:** Mohammed Farhan K  
**Document type:** Internship Project — PRD  
**Version:** 2.0 (Enhanced)  
**Status:** Active Build  
**Deployment:** Render (live: https://mindtrack-ai.onrender.com)  
**Stack:** Django REST Framework · Supabase · Gemini API · Railway/Render

---

## 1. Summary

MindTrack AI is an AI-powered journaling and emotional wellness platform. Users write daily journal entries; the system uses the **Gemini API (gemini-1.5-flash)** to detect the dominant emotion, score mood on a 0–10 scale, classify sentiment, and return a short personalized wellness suggestion. Over time, the platform aggregates this data into mood trends and weekly wellness reports, helping users build a habit of self-reflection.

**Why Gemini API?**
- Free tier: 15 requests/minute, 1 million tokens/day — sufficient for MVP.
- `gemini-1.5-flash` is fast and cheap; `gemini-1.5-pro` for complex tasks like weekly summaries.
- Supports structured JSON output (`response_mime_type: "application/json"`) — critical for reliable parsing.
- Generous context window (1M tokens) — allows sending multiple entries in one call for weekly summaries.

---

## 2. What Exactly Are We Building?

A full-stack web application consisting of:

- **A backend API** (Django REST Framework) handling auth, journal CRUD, and Gemini API orchestration.
- **A managed data layer** (Supabase PostgreSQL + Supabase Auth) storing users, journal entries, and emotion-analysis records.
- **An AI analysis pipeline** that takes raw journal text → sends to Gemini API → parses structured JSON response into: emotion label, sentiment, mood score, wellness suggestion.
- **Analytics endpoints** turning stored entries into mood-history time series and weekly summary reports.
- **API documentation** via Swagger / drf-spectacular.

In short: **a journal app where every entry is automatically "read" by AI and turned into emotional insight.**

### Explicitly NOT in scope (v1):
- Clinical diagnostic tool or therapy replacement.
- Mobile-native app (web/API only for MVP).
- Real-time chat/companion bot.
- Anything requiring real-time streaming from Gemini.

---

## 3. Who Is It For?

| Segment | Why they need this |
|---|---|
| **Students** | High academic stress, exam anxiety, limited counseling access; want low-friction mood tracking. |
| **Working professionals** | Burnout, work stress; want quick daily check-ins without a therapist. |
| **Job seekers** | Uncertainty and rejection stress; want to track emotional resilience over time. |
| **Wellness enthusiasts** | Already journaling; want AI-assisted insight layered on top. |

### Out of scope (v1)
- Clinicians/therapists as users.
- Enterprise/HR wellness programs.
- Children/minors (restrict to 18+ explicitly).

---

## 4. Problems Solved

| Problem | How MindTrack AI Addresses It |
|---|---|
| People don't consistently reflect on their emotional state. | Simple journaling habit loop: write → get instant AI feedback. |
| People miss mood patterns over time. | Mood History + Weekly Summary turn isolated entries into visible trends. |
| Free-form journaling feels like writing into a void. | Every entry returns emotion label, sentiment, mood score, and a suggestion — journaling feels responsive. |
| Generic mood trackers need manual self-rating. | AI infers mood score from natural language — zero extra effort from the user. |
| Mental wellness support is inaccessible. | Low-cost, private, always-available self-awareness tool — complement to professional care. |

---

## 5. Goals & Success Metrics

### Product Objectives
- Enable daily journal entries.
- Analyze emotions using Gemini AI.
- Track mood trends over time.
- Generate personalized wellness suggestions.
- Promote self-awareness and emotional reflection.

### Measurable KPIs
| Metric | Target |
|---|---|
| Activation rate | ≥50% of registered users create ≥1 entry within 24h |
| Retention | ≥30% of users log an entry in ≥3 distinct weeks |
| AI reliability | ≥95% of `/api/analyze/{id}/` calls return valid parsed payload |
| API latency | p95 < 3 seconds for emotion analysis |
| Test coverage | ≥70% (required by internship KPI) |
| Swagger docs | Live at `/api/schema/swagger-ui/` |

---

## 6. Features

### 6.1 Must-Have (MVP — Phase 1)

| # | Feature | Description |
|---|---|---|
| 1 | **User Registration & Login** | Supabase Auth (email + password). JWT tokens returned, stored in Django session. |
| 2 | **Journal CRUD** | Create, read, update, delete personal journal entries. Each entry stores: title, content, created_at, updated_at, user FK. |
| 3 | **AI Emotion Detection** | Each entry analyzed via Gemini API → returns dominant emotion (happy, sad, anxious, angry, neutral, etc.). |
| 4 | **Mood Score Tracking** | Numeric mood score 0–10 generated per entry, stored in EmotionAnalysis table. |
| 5 | **Basic Wellness Suggestion** | Short AI-generated, personalized suggestion based on detected emotion, saved to DB. |

**Supporting infrastructure (non-negotiable for a working MVP):**
- Token-based auth on all protected endpoints.
- Graceful Gemini API error handling (timeout, malformed JSON, quota exceeded).
- Rate limiting on AI endpoints (`django-ratelimit`) — see Section 8.
- `.env` for all secrets; `.gitignore` enforced.

### 6.2 Core Follow-On (Phase 1.x)

| Feature | Description |
|---|---|
| Sentiment Classification | Positive / Negative / Neutral, separate from emotion label. |
| Weekly Mood Summary | AI-generated narrative of the week's emotional trend (uses `gemini-1.5-pro` for quality). |
| Mood History API | `/api/mood/history/` returns time-series of mood scores, filterable by date range. |
| Emotion Trend Aggregation | Frequency count per emotion label over a date range — chart-ready JSON. |
| Weekly Wellness Report | Combines mood history + AI summary into a downloadable/viewable report. |

### 6.3 Nice-to-Have (Future — Deferred)

| Feature | Notes |
|---|---|
| Voice Journal Entries | Gemini 1.5 supports audio input natively — strong future fit. |
| Mobile App (React Native) | Not in scope for Month 1. |
| Mood Prediction (ML) | Historical pattern modeling — separate from Gemini-based per-entry analysis. |
| Community Features | Peer support / social layer. |
| Mental Wellness Resource Library | Curated content based on user's emotional state. |

### 6.4 Recommended Additions (Safety & Compliance — Add Now)

> These are not in the original spec but are **required before any real user traffic**.

| Addition | Why It Matters | Implementation hint |
|---|---|---|
| **Crisis-content safeguard** | If an entry contains self-harm or suicidal signals, surface crisis resources. This is a safety-critical gap. | Add a `crisis_detected: bool` field in Gemini's prompt response. If true, frontend shows helpline banner. |
| **Privacy consent disclosure** | Journal text leaves the app and goes to Google Gemini servers. Users must consent. | One-time consent modal at registration. Store consent timestamp in user record. |
| **Account & data deletion** | Right to be forgotten. User should be able to delete all entries + analysis + account. | `DELETE /api/users/me/` endpoint that cascades deletes in Supabase. |
| **Minimum age enforcement** | 18+ only, given sensitive subject matter. | Checkbox at registration + documented in ToS. |

---

## 7. Gemini API — Integration Guide

### 7.1 Which Model to Use

| Task | Recommended Model | Why |
|---|---|---|
| Per-entry emotion analysis | `gemini-1.5-flash` | Fast, cheap, free tier covers MVP volume |
| Weekly mood summary (narrative) | `gemini-1.5-flash` or `gemini-1.5-pro` | Flash is sufficient; Pro gives richer narrative |
| Function calling (advanced feature) | `gemini-1.5-flash` | Supported on free tier |

### 7.2 Forcing Structured JSON Output (Critical)

Always use `response_mime_type` to force Gemini to return parseable JSON. This eliminates the most common source of parsing failures.

```python
import google.generativeai as genai
import json

genai.configure(api_key=settings.GEMINI_API_KEY)

def analyze_journal_entry(text: str) -> dict:
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )

    prompt = f"""
    Analyze the following journal entry and return a JSON object with these exact fields:
    {{
        "emotion": "one of: happy, sad, anxious, angry, neutral, excited, frustrated, hopeful, exhausted, grateful",
        "sentiment": "one of: positive, negative, neutral",
        "mood_score": <integer 0-10, where 0=worst, 10=best>,
        "wellness_suggestion": "<1-2 sentence personalized, actionable suggestion>",
        "crisis_detected": <true or false — true ONLY if the text contains self-harm or suicidal signals>
    }}

    Journal entry:
    \"\"\"
    {text}
    \"\"\"

    Return ONLY the JSON object. No explanation, no markdown.
    """

    response = model.generate_content(prompt)
    return json.loads(response.text)
```

### 7.3 Error Handling (Required — Not Optional)

```python
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded
import logging

logger = logging.getLogger(__name__)

FALLBACK_RESPONSE = {
    "emotion": "neutral",
    "sentiment": "neutral",
    "mood_score": 5,
    "wellness_suggestion": "Take a moment to breathe. We weren't able to analyze your entry right now — please try again shortly.",
    "crisis_detected": False,
    "error": True
}

def safe_analyze(text: str) -> dict:
    try:
        return analyze_journal_entry(text)
    except ResourceExhausted:
        logger.warning("Gemini quota exceeded")
        return {**FALLBACK_RESPONSE, "error_type": "quota_exceeded"}
    except DeadlineExceeded:
        logger.warning("Gemini timeout")
        return {**FALLBACK_RESPONSE, "error_type": "timeout"}
    except (json.JSONDecodeError, KeyError) as e:
        logger.error(f"Gemini response parse error: {e}")
        return {**FALLBACK_RESPONSE, "error_type": "parse_error"}
    except Exception as e:
        logger.error(f"Gemini unexpected error: {e}")
        return {**FALLBACK_RESPONSE, "error_type": "unknown"}
```

### 7.4 Weekly Summary Prompt

```python
def generate_weekly_summary(entries: list[dict]) -> dict:
    """
    entries: [{"date": "2026-06-10", "content": "...", "emotion": "sad", "mood_score": 3}, ...]
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )

    entries_text = "\n\n".join(
        [f"[{e['date']}] Emotion: {e['emotion']} | Score: {e['mood_score']}/10\n{e['content']}"
         for e in entries]
    )

    prompt = f"""
    You are a compassionate wellness assistant. Analyze this week's journal entries and return:
    {{
        "dominant_emotion": "<most frequent emotion this week>",
        "average_mood_score": <float>,
        "mood_trend": "one of: improving, declining, stable",
        "week_summary": "<2-3 sentence narrative about the emotional week>",
        "weekly_suggestion": "<1-2 sentence actionable recommendation for the coming week>"
    }}

    This week's entries:
    {entries_text}
    """

    response = model.generate_content(prompt)
    return json.loads(response.text)
```

---

## 8. Gemini API — Limitations You Must Know

These are real constraints that will affect your build decisions.

### 8.1 Rate Limits (Free Tier — As of June 2026)

| Model | Requests/Minute | Tokens/Minute | Requests/Day |
|---|---|---|---|
| `gemini-1.5-flash` | 15 RPM | 1,000,000 TPM | 1,500 RPD |
| `gemini-1.5-pro` | 2 RPM | 32,000 TPM | 50 RPD |

**Implication for your project:**
- At 15 RPM, you cannot serve burst traffic (e.g., 20 users submitting entries simultaneously in a demo).
- Weekly summary generation should use Flash, not Pro, to stay within free limits.
- Add **exponential backoff + retry** when you get a 429 (quota exceeded) response.

**Mitigation:** Use `django-ratelimit` to cap users at 10 AI calls/hour. This protects your Gemini quota.

```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='user', rate='10/h', method='POST', block=True)
def analyze_entry(request, pk):
    ...
```

### 8.2 No Persistent Memory

Gemini has no memory between API calls. Every call is stateless. For weekly summaries, **you must send all relevant entries in the prompt** — you cannot ask Gemini to "remember last week's entries."

**Implication:** Your weekly summary endpoint must pull entries from Supabase, format them into the prompt, and send everything in one call. For users with many entries, this increases token usage.

### 8.3 JSON Parsing Can Still Fail

Even with `response_mime_type: "application/json"`, the model occasionally:
- Returns extra whitespace or BOM characters before the JSON.
- Wraps the JSON in a markdown code fence (```json ... ```) on some edge inputs.

**Always** wrap `json.loads()` in a try-except and strip the response:

```python
raw = response.text.strip().lstrip('\ufeff')
# Strip markdown fences if present
if raw.startswith("```"):
    raw = raw.split("```")[1]
    if raw.startswith("json"):
        raw = raw[4:]
result = json.loads(raw.strip())
```

### 8.4 Emotion Label Hallucination

Gemini may return an emotion label not in your defined list (e.g., "melancholic", "content", "overwhelmed") even when your prompt says "one of:".

**Fix:** Validate the returned emotion against your allowed list. Fall back to "neutral" if invalid.

```python
VALID_EMOTIONS = {"happy", "sad", "anxious", "angry", "neutral", "excited", "frustrated", "hopeful", "exhausted", "grateful"}

emotion = result.get("emotion", "neutral").lower()
if emotion not in VALID_EMOTIONS:
    emotion = "neutral"
```

### 8.5 No Streaming Support Needed (But Available)

For journaling, streaming is not necessary — users can wait 1-2 seconds for a full analysis response. Don't add streaming complexity to MVP.

### 8.6 Context Window vs. Cost Trade-off

`gemini-1.5-flash` has a 1M token context window — more than enough for any journal entry. But **longer prompts = slower responses**. Keep entry-level prompts under 1,000 tokens (your system prompt + journal text). Weekly summaries will be larger — this is acceptable since they're generated once per week, not per entry.

### 8.7 Privacy: Data Leaves Your System

Journal text is sent to Google's Gemini API servers. Google's data usage policies apply. **You must disclose this to users.** Do not store raw Gemini responses in logs (they may contain PII echoed back from the prompt).

---

## 9. Ideas to Make This Project Stand Out

### Idea 1: Streak & Habit Tracker
Track consecutive journaling days. Store a `current_streak` and `longest_streak` on the User model. Display it in the API response. This costs nothing extra — pure Django logic — but dramatically improves engagement and makes your demo more compelling.

### Idea 2: Emotion Tag Cloud Endpoint
Add a `GET /api/mood/emotions/summary/` endpoint that returns emotion frequency counts over a configurable period:
```json
{"happy": 8, "anxious": 5, "sad": 3, "neutral": 2}
```
This is chart-ready data your frontend or Google Sheets dashboard can visualize instantly.

### Idea 3: Gemini Function Calling (Advanced — for Exit Demo)
Give Gemini a tool that can query your Supabase database for the user's past mood scores. Then prompt: *"Based on this user's mood history, what pattern do you notice and what should they focus on this week?"* Gemini decides when to call the tool. This directly fulfills the internship's Function Calling requirement and makes your project genuinely unique.

```python
tools = [
    {
        "function_declarations": [{
            "name": "get_user_mood_history",
            "description": "Get the user's mood scores for the past N days",
            "parameters": {
                "type": "object",
                "properties": {
                    "days": {"type": "integer", "description": "Number of past days to retrieve"}
                },
                "required": ["days"]
            }
        }]
    }
]
```

### Idea 4: Crisis Resource Banner (Safety + Demo Value)
If `crisis_detected: true` is returned by Gemini, surface a crisis resource banner in the API response. Add a `crisis_flag` boolean field to the EmotionAnalysis model. This shows safety thinking in your exit demo — mentors will notice.

```json
{
  "emotion": "sad",
  "mood_score": 1,
  "crisis_detected": true,
  "crisis_resources": {
    "india": "iCall: 9152987821",
    "international": "Befrienders Worldwide: befrienders.org"
  }
}
```

### Idea 5: Mood Score Sparkline Data
Add `GET /api/mood/sparkline/?days=7` — returns last 7 days of mood scores as a simple array:
```json
{"scores": [7, 5, 3, 6, 8, 4, 7], "dates": ["Jun 22", ..., "Jun 28"]}
```
This is directly usable in your Google Sheets dashboard (paste the scores, make a sparkline). Takes 30 minutes to build and looks great in demos.

### Idea 6: Async AI Processing (Django + Celery Alternative)
For better UX, save the journal entry immediately (return 201 instantly), then trigger the Gemini analysis as a background task. Poll a `GET /api/entries/{id}/analysis/` endpoint to check if analysis is ready. This demonstrates async architecture thinking.

---

## 10. Data Models

### Users (managed by Supabase Auth)
Extended with:
- `current_streak` (int, default 0)
- `longest_streak` (int, default 0)
- `last_entry_date` (date, nullable)
- `consent_given` (bool, default False)
- `consent_timestamp` (datetime, nullable)

### JournalEntry
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | FK → User | |
| title | CharField(200) | Optional |
| content | TextField | The journal text sent to Gemini |
| created_at | DateTimeField(auto_now_add) | |
| updated_at | DateTimeField(auto_now) | |

### EmotionAnalysis
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| entry | OneToOneField → JournalEntry | |
| emotion | CharField(50) | From VALID_EMOTIONS set |
| sentiment | CharField(10) | positive / negative / neutral |
| mood_score | IntegerField | 0–10 |
| wellness_suggestion | TextField | AI-generated |
| crisis_detected | BooleanField | Default False |
| gemini_model_used | CharField(50) | For debugging |
| analysis_error | BooleanField | True if fallback was used |
| created_at | DateTimeField(auto_now_add) | |

### WeeklyReport (Phase 1.x)
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | FK → User | |
| week_start | DateField | Monday of the week |
| week_end | DateField | Sunday of the week |
| dominant_emotion | CharField(50) | |
| average_mood_score | FloatField | |
| mood_trend | CharField(20) | improving / declining / stable |
| week_summary | TextField | AI narrative |
| weekly_suggestion | TextField | AI recommendation |
| entries_count | IntegerField | How many entries this week |
| created_at | DateTimeField(auto_now_add) | |

---

## 11. API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | No | Register new user |
| POST | `/api/auth/login/` | No | Login, returns JWT |
| POST | `/api/auth/logout/` | Yes | Invalidate token |
| GET | `/api/entries/` | Yes | List user's journal entries (paginated) |
| POST | `/api/entries/` | Yes | Create new entry (triggers async AI analysis) |
| GET | `/api/entries/{id}/` | Yes | Get single entry with analysis |
| PUT/PATCH | `/api/entries/{id}/` | Yes | Update entry |
| DELETE | `/api/entries/{id}/` | Yes | Delete entry + analysis |
| POST | `/api/analyze/{id}/` | Yes | Manually trigger/re-run AI analysis |
| GET | `/api/mood/history/` | Yes | Mood score time-series (filter: ?days=30) |
| GET | `/api/mood/sparkline/` | Yes | Last N days scores as array |
| GET | `/api/mood/emotions/summary/` | Yes | Emotion frequency counts |
| GET | `/api/mood/summary/` | Yes | Latest weekly report |
| POST | `/api/mood/summary/generate/` | Yes | Generate this week's report |
| DELETE | `/api/users/me/` | Yes | Delete account + all data |
| GET | `/api/schema/swagger-ui/` | No | Swagger docs |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Gemini JSON parsing failure | `response_mime_type: "application/json"` + strip/fallback logic |
| Gemini quota exceeded (15 RPM free) | `django-ratelimit` (10 calls/user/hour) + exponential backoff |
| Emotion label hallucination | Validate against `VALID_EMOTIONS` set; fallback to "neutral" |
| Raw journal text in logs (PII leak) | Never log `request.data['content']` or Gemini prompts at INFO level |
| Crisis content with no support resources | `crisis_detected` field + crisis resource response block |
| No user consent for Gemini data sharing | Consent modal at registration; store timestamp |
| AI analysis latency > 3s | Use `gemini-1.5-flash` (not Pro) for per-entry analysis |
| Supabase RLS misconfigured | Test: user A cannot read user B's entries; verify in Supabase dashboard |

---

## 13. Out of Scope (v1)

- Therapist/clinician-facing features.
- Real-time chat or conversational AI companion.
- Mobile native apps.
- Predictive ML mood forecasting.
- Community/social features.
- Curated mental-health resource library.
- Gemini audio/voice input (future — API supports it).

---

## 14. Conclusion

MindTrack AI's MVP is narrow and well-defined: **register → write → get AI-analyzed emotion + mood score + suggestion**. The Gemini API (gemini-1.5-flash) is the right choice for this — free, fast, and capable of returning structured JSON reliably when prompted correctly.

**The three things that will make this project stand out in your exit demo:**
1. Reliable structured JSON from Gemini with proper error handling and fallback.
2. The crisis detection flag — shows you thought about user safety, not just features.
3. One advanced feature: Gemini function calling OR the streak tracker OR the sparkline endpoint — something beyond the spec that you built because you saw the need.

Ship it. Own it.

---

*MindTrack AI — Built during ZLAQA Python & AI Internship, June–July 2026*
