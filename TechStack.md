# Tech Stack Document
## MindTrack AI — Mental Health Journal & Emotion Tracker

**Author:** Mohammed Farhan K
**Version:** 1.0
**Status:** Active Build
**Last Updated:** June 2026

---

## Overview

MindTrack AI is a full-stack web application with a **React frontend**, a **Django REST Framework backend**, **Supabase** for database and auth, and the **Gemini API** for AI emotion analysis. The entire system is deployed on **Render** (backend) and **Vercel** (frontend).

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                    React (Vercel CDN)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST API calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Django REST Framework (Render)                  │
│    - Auth validation (Supabase JWT verify)                  │
│    - Journal CRUD endpoints                                  │
│    - AI orchestration (calls Gemini API)                    │
│    - Analytics / mood history endpoints                     │
└──────────┬───────────────────────────────┬──────────────────┘
           │                               │
           ▼                               ▼
┌─────────────────────┐       ┌────────────────────────────┐
│  Supabase           │       │  Google Gemini API         │
│  - PostgreSQL DB    │       │  - gemini-1.5-flash        │
│  - Supabase Auth    │       │  - Emotion analysis        │
│  - Row Level        │       │  - Weekly summaries        │
│    Security (RLS)   │       │  - Function calling        │
└─────────────────────┘       └────────────────────────────┘
```

---

## 1. Frontend

### Technology: React 18 + Vite

| Item | Choice | Version | Why |
|---|---|---|---|
| Framework | React | 18.x | Component model fits journal card + analysis result patterns |
| Build tool | Vite | 5.x | Fast HMR, easy env var handling, smaller bundles than CRA |
| Language | JavaScript (JSX) | ES2022 | No TS overhead for a 1-month internship build |
| Routing | React Router DOM | 6.x | Client-side routing, nested routes for journal/[id] |
| State management | React Context + useState | built-in | Lightweight enough; no Redux needed for this scope |
| HTTP client | Axios | 1.x | Interceptors for JWT auto-attach, cleaner than fetch |
| Charts | Recharts | 2.x | Declarative, React-native, good LineChart + BarChart |
| Icons | Lucide React | 0.383.0 | Matches the icon style visible in the screenshot |
| Styling | Tailwind CSS | 3.x | Utility-first, fast to build, consistent spacing |
| Toast notifications | React Hot Toast | 2.x | Simple, no-config, matches design system |
| Form handling | React Hook Form | 7.x | Minimal re-renders, easy validation |
| Date formatting | date-fns | 3.x | Lightweight, tree-shakeable |

### Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                   # All Axios API calls
│   │   ├── auth.js            # register, login, logout
│   │   ├── journal.js         # CRUD for entries
│   │   ├── analysis.js        # trigger analysis, get result
│   │   └── mood.js            # history, sparkline, summary
│   │
│   ├── components/            # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── PageWrapper.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EmotionBadge.jsx
│   │   │   ├── MoodBar.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── CrisisBanner.jsx
│   │   ├── journal/
│   │   │   ├── JournalCard.jsx
│   │   │   ├── JournalForm.jsx
│   │   │   └── AnalysisResult.jsx
│   │   └── charts/
│   │       ├── MoodLineChart.jsx
│   │       └── EmotionDonutChart.jsx
│   │
│   ├── pages/                 # One file per route
│   │   ├── Home.jsx           # /
│   │   ├── Login.jsx          # /login
│   │   ├── Register.jsx       # /register
│   │   ├── Dashboard.jsx      # /dashboard
│   │   ├── Journal.jsx        # /journal
│   │   ├── JournalNew.jsx     # /journal/new
│   │   ├── JournalDetail.jsx  # /journal/:id
│   │   ├── MoodTracker.jsx    # /mood
│   │   ├── AIAssistant.jsx    # /ai-assistant
│   │   ├── Insights.jsx       # /insights
│   │   └── Profile.jsx        # /profile
│   │
│   ├── context/
│   │   └── AuthContext.jsx    # JWT token, user state, login/logout
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useJournal.js
│   │   └── useMoodHistory.js
│   │
│   ├── utils/
│   │   ├── emotionColors.js   # EMOTION_COLORS map from design doc
│   │   ├── moodColor.js       # getMoodColor(score)
│   │   └── formatDate.js
│   │
│   ├── App.jsx                # Router setup, protected routes
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind imports + CSS variables
│
├── .env                       # VITE_API_BASE_URL
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### Environment Variables (Frontend)

```env
# .env (frontend)
VITE_API_BASE_URL=http://localhost:8000/api   # dev
# VITE_API_BASE_URL=https://mindtrack-ai.onrender.com/api  # prod
```

### Axios Configuration

```javascript
// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

### Protected Route Pattern

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

### Key npm Commands

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios recharts lucide-react react-hot-toast react-hook-form date-fns
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev       # development server: http://localhost:5173
npm run build     # production build → dist/
```

---

## 2. Backend

### Technology: Django 4.2 + Django REST Framework

| Item | Choice | Version | Why |
|---|---|---|---|
| Framework | Django | 4.2 LTS | Stable LTS, security updates until 2026 |
| API layer | djangorestframework | 3.15.x | ViewSets + Serializers = fast CRUD API |
| API docs | drf-spectacular | 0.27.x | Auto Swagger/OpenAPI from code — internship requirement |
| Auth | djangorestframework-simplejwt | 5.x | JWT validation for Supabase tokens |
| Env vars | django-environ | 0.11.x | `.env` file loading, type casting |
| AI client | google-generativeai | 0.7.x | Official Gemini Python SDK |
| Rate limiting | django-ratelimit | 4.x | Cap AI calls per user per hour |
| CORS | django-cors-headers | 4.x | Allow React frontend to call Django |
| DB driver | psycopg2-binary | 2.9.x | PostgreSQL adapter for Supabase |
| Supabase client | supabase | 2.x | Direct Supabase queries where needed |
| Testing | pytest-django | 4.x | Preferred over unittest for DRF projects |
| Coverage | pytest-cov | 4.x | ≥70% coverage — internship KPI |
| Linting | flake8 | 7.x | Code quality |

### Project Structure

```
backend/
├── config/                    # Django project settings
│   ├── __init__.py
│   ├── settings.py            # Main settings file
│   ├── urls.py                # Root URL config
│   └── wsgi.py
│
├── apps/
│   ├── users/                 # User profile, account deletion
│   │   ├── models.py          # Extended user profile
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── journal/               # Journal CRUD
│   │   ├── models.py          # JournalEntry model
│   │   ├── serializers.py
│   │   ├── views.py           # JournalEntryViewSet
│   │   └── urls.py
│   │
│   ├── analysis/              # AI emotion analysis
│   │   ├── models.py          # EmotionAnalysis model
│   │   ├── serializers.py
│   │   ├── views.py           # AnalyzeEntryView
│   │   ├── urls.py
│   │   └── gemini.py          # Gemini API service (all AI logic lives here)
│   │
│   └── reports/               # Mood history, weekly reports
│       ├── models.py          # WeeklyReport model
│       ├── serializers.py
│       ├── views.py           # MoodHistoryView, WeeklyReportView
│       └── urls.py
│
├── tests/
│   ├── conftest.py            # Fixtures: test user, test entry, mock Gemini
│   ├── test_auth.py
│   ├── test_journal.py
│   ├── test_analysis.py       # Mocks Gemini API
│   └── test_reports.py
│
├── docs/
│   └── architecture.md
│
├── .env                       # Secret values (never commit)
├── .env.example               # Template (commit this)
├── .gitignore
├── manage.py
├── requirements.txt
├── Procfile                   # For Render: web: gunicorn config.wsgi
└── pyproject.toml             # pytest config
```

### Environment Variables (Backend)

```env
# .env — never commit this file

# Django
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres

# Gemini
GEMINI_API_KEY=your-gemini-api-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

```env
# .env.example — commit this

DJANGO_SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
GEMINI_API_KEY=
CORS_ALLOWED_ORIGINS=
```

### settings.py Key Sections

```python
import environ
env = environ.Env()
environ.Env.read_env()

SECRET_KEY = env('DJANGO_SECRET_KEY')
DEBUG = env.bool('DEBUG', default=False)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'drf_spectacular',
    'corsheaders',
    'django_ratelimit',
    # Local apps
    'apps.users',
    'apps.journal',
    'apps.analysis',
    'apps.reports',
]

DATABASES = {
    'default': env.db('DATABASE_URL')
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'MindTrack AI API',
    'DESCRIPTION': 'Mental Health Journal & Emotion Tracker API',
    'VERSION': '1.0.0',
}

CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')
```

### requirements.txt

```
Django==4.2.13
djangorestframework==3.15.2
drf-spectacular==0.27.2
djangorestframework-simplejwt==5.3.1
django-environ==0.11.2
django-cors-headers==4.4.0
django-ratelimit==4.1.0
psycopg2-binary==2.9.9
supabase==2.5.0
google-generativeai==0.7.2
gunicorn==22.0.0
pytest==8.2.2
pytest-django==4.8.0
pytest-cov==5.0.0
flake8==7.1.0
```

### Key pip Commands

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver        # dev: http://localhost:8000
```

---

## 3. Database

### Technology: Supabase PostgreSQL

| Item | Detail |
|---|---|
| Provider | Supabase (managed PostgreSQL) |
| Version | PostgreSQL 15 |
| Connection | Via `DATABASE_URL` (direct connection string) |
| ORM | Django ORM (models defined in Django, migrations applied to Supabase) |
| Direct queries | `supabase-py` client for Supabase-specific operations |

### Tables

Django manages the schema via migrations. Run `python manage.py migrate` to create all tables in Supabase.

#### users_userprofile
```sql
CREATE TABLE users_userprofile (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id    UUID UNIQUE NOT NULL,  -- Supabase auth.users.id
    name            VARCHAR(200) NOT NULL,
    email           VARCHAR(254) UNIQUE NOT NULL,
    current_streak  INTEGER DEFAULT 0,
    longest_streak  INTEGER DEFAULT 0,
    last_entry_date DATE,
    consent_given   BOOLEAN DEFAULT FALSE,
    consent_ts      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### journal_journalentry
```sql
CREATE TABLE journal_journalentry (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users_userprofile(id) ON DELETE CASCADE,
    title       VARCHAR(200),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_journal_user_created ON journal_journalentry(user_id, created_at DESC);
```

#### analysis_emotionanalysis
```sql
CREATE TABLE analysis_emotionanalysis (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id            UUID UNIQUE NOT NULL REFERENCES journal_journalentry(id) ON DELETE CASCADE,
    emotion             VARCHAR(50) NOT NULL DEFAULT 'neutral',
    sentiment           VARCHAR(10) NOT NULL DEFAULT 'neutral',
    mood_score          INTEGER CHECK (mood_score BETWEEN 0 AND 10),
    wellness_suggestion TEXT,
    crisis_detected     BOOLEAN DEFAULT FALSE,
    gemini_model_used   VARCHAR(50),
    analysis_error      BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

#### reports_weeklyreport
```sql
CREATE TABLE reports_weeklyreport (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users_userprofile(id) ON DELETE CASCADE,
    week_start          DATE NOT NULL,
    week_end            DATE NOT NULL,
    dominant_emotion    VARCHAR(50),
    average_mood_score  FLOAT,
    mood_trend          VARCHAR(20),
    week_summary        TEXT,
    weekly_suggestion   TEXT,
    entries_count       INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);
```

### Row Level Security (RLS) Policies

Enable RLS on all tables in Supabase dashboard, then run these SQL policies:

```sql
-- Enable RLS
ALTER TABLE journal_journalentry    ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_emotionanalysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports_weeklyreport    ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_userprofile       ENABLE ROW LEVEL SECURITY;

-- Users can only access their own journal entries
CREATE POLICY "users_own_entries" ON journal_journalentry
    FOR ALL USING (
        user_id = (
            SELECT id FROM users_userprofile
            WHERE auth_user_id = auth.uid()
        )
    );

-- Users can only access their own analysis records
CREATE POLICY "users_own_analysis" ON analysis_emotionanalysis
    FOR ALL USING (
        entry_id IN (
            SELECT je.id FROM journal_journalentry je
            JOIN users_userprofile up ON je.user_id = up.id
            WHERE up.auth_user_id = auth.uid()
        )
    );

-- Users can only access their own weekly reports
CREATE POLICY "users_own_reports" ON reports_weeklyreport
    FOR ALL USING (
        user_id = (
            SELECT id FROM users_userprofile
            WHERE auth_user_id = auth.uid()
        )
    );

-- Users can only see and edit their own profile
CREATE POLICY "users_own_profile" ON users_userprofile
    FOR ALL USING (auth_user_id = auth.uid());
```

---

## 4. Authentication

### How It Works

```
1. User registers → POST /api/auth/register/
   → Django creates Supabase Auth user (via supabase-py)
   → Creates UserProfile row in DB
   → Returns JWT access token + refresh token

2. User logs in → POST /api/auth/login/
   → Django calls Supabase Auth sign_in_with_password()
   → Supabase returns session with access_token (JWT)
   → Django returns that token to the frontend
   → Frontend stores in localStorage as 'access_token'

3. Every subsequent request:
   → Frontend Axios interceptor adds: Authorization: Bearer <token>
   → Django SimpleJWT middleware validates the JWT signature
   → If valid: request proceeds with request.user populated
   → If invalid/expired: 401 returned → frontend redirects to /login
```

### Supabase Auth Configuration

In Supabase dashboard → Authentication → Settings:
- Email confirmations: **OFF** for MVP (easier testing)
- JWT expiry: **3600 seconds** (1 hour)
- Refresh token rotation: **ON**

### Django Auth Views

```python
# apps/users/views.py

from supabase import create_client
from django.conf import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')
        name     = request.data.get('name')
        consent  = request.data.get('consent_given', False)

        if not consent:
            return Response({'error': 'You must accept the AI data processing consent.'}, status=400)

        # Create Supabase Auth user
        res = supabase.auth.sign_up({'email': email, 'password': password})
        if res.user is None:
            return Response({'error': 'Registration failed.'}, status=400)

        # Create UserProfile
        UserProfile.objects.create(
            auth_user_id=res.user.id,
            email=email,
            name=name,
            consent_given=True,
            consent_ts=now()
        )

        return Response({
            'access_token':  res.session.access_token,
            'refresh_token': res.session.refresh_token,
            'user': {'name': name, 'email': email}
        }, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')

        res = supabase.auth.sign_in_with_password({'email': email, 'password': password})
        if res.user is None:
            return Response({'error': 'Invalid credentials.'}, status=401)

        return Response({
            'access_token':  res.session.access_token,
            'refresh_token': res.session.refresh_token,
            'user': {'email': res.user.email}
        })
```

---

## 5. AI Integration

### Technology: Google Gemini API

| Item | Detail |
|---|---|
| Provider | Google AI Studio / Gemini API |
| SDK | `google-generativeai` Python SDK |
| Model (per-entry) | `gemini-1.5-flash` — fast, free tier |
| Model (weekly summary) | `gemini-1.5-flash` — free tier sufficient |
| Model (function calling) | `gemini-1.5-flash` — supported on free tier |
| Output format | Forced JSON via `response_mime_type: "application/json"` |
| Free tier limits | 15 RPM, 1,500 requests/day, 1M tokens/day |

### All AI Logic Lives in `apps/analysis/gemini.py`

```python
# apps/analysis/gemini.py

import json
import logging
import google.generativeai as genai
from django.conf import settings
from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

VALID_EMOTIONS = {
    "happy", "sad", "anxious", "angry", "neutral",
    "excited", "frustrated", "hopeful", "exhausted", "grateful"
}

FALLBACK = {
    "emotion": "neutral", "sentiment": "neutral",
    "mood_score": 5,
    "wellness_suggestion": "We couldn't analyze your entry right now. Try again shortly.",
    "crisis_detected": False, "error": True
}


def analyze_entry(text: str) -> dict:
    """Analyze a journal entry. Always returns a dict — never raises."""
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        prompt = f"""
Analyze the following journal entry. Return a JSON object with exactly these fields:
{{
  "emotion": "one of: happy, sad, anxious, angry, neutral, excited, frustrated, hopeful, exhausted, grateful",
  "sentiment": "one of: positive, negative, neutral",
  "mood_score": <integer 0-10>,
  "wellness_suggestion": "<1-2 sentence personalized suggestion>",
  "crisis_detected": <true only if entry contains self-harm or suicidal signals, else false>
}}

Journal entry:
\"\"\"
{text[:3000]}
\"\"\"

Return ONLY the JSON. No explanation. No markdown.
"""
        response = model.generate_content(prompt)
        raw = response.text.strip().lstrip('\ufeff')
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())

        # Validate emotion
        result["emotion"] = result.get("emotion", "neutral").lower()
        if result["emotion"] not in VALID_EMOTIONS:
            result["emotion"] = "neutral"

        # Validate mood_score
        score = result.get("mood_score", 5)
        result["mood_score"] = max(0, min(10, int(score)))

        result["error"] = False
        return result

    except ResourceExhausted:
        logger.warning("Gemini quota exceeded")
        return {**FALLBACK, "error_type": "quota_exceeded"}
    except DeadlineExceeded:
        logger.warning("Gemini timeout")
        return {**FALLBACK, "error_type": "timeout"}
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        logger.error(f"Gemini parse error: {e}")
        return {**FALLBACK, "error_type": "parse_error"}
    except Exception as e:
        logger.error(f"Gemini unexpected error: {e}")
        return {**FALLBACK, "error_type": "unknown"}


def generate_weekly_summary(entries: list[dict]) -> dict:
    """Generate weekly mood summary from a list of entry dicts."""
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        entries_text = "\n\n".join([
            f"[{e['date']}] Emotion: {e['emotion']} | Score: {e['mood_score']}/10\n{e['content'][:500]}"
            for e in entries
        ])
        prompt = f"""
Analyze this week's journal entries and return:
{{
  "dominant_emotion": "<most frequent emotion>",
  "average_mood_score": <float>,
  "mood_trend": "one of: improving, declining, stable",
  "week_summary": "<2-3 sentence narrative>",
  "weekly_suggestion": "<1-2 sentence recommendation for the coming week>"
}}

Entries:
{entries_text}
"""
        response = model.generate_content(prompt)
        raw = response.text.strip()
        return json.loads(raw)
    except Exception as e:
        logger.error(f"Weekly summary error: {e}")
        return {
            "dominant_emotion": "neutral", "average_mood_score": 5.0,
            "mood_trend": "stable", "week_summary": "Could not generate summary.",
            "weekly_suggestion": "Keep journaling consistently.", "error": True
        }
```

### Rate Limiting on AI Endpoint

```python
# apps/analysis/views.py
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

@method_decorator(ratelimit(key='user', rate='10/h', method='POST', block=True), name='dispatch')
class AnalyzeEntryView(APIView):
    def post(self, request, pk):
        entry = get_object_or_404(JournalEntry, pk=pk, user=request.user.profile)
        result = analyze_entry(entry.content)

        analysis, _ = EmotionAnalysis.objects.update_or_create(
            entry=entry,
            defaults={
                'emotion':             result['emotion'],
                'sentiment':           result['sentiment'],
                'mood_score':          result['mood_score'],
                'wellness_suggestion': result['wellness_suggestion'],
                'crisis_detected':     result['crisis_detected'],
                'gemini_model_used':   'gemini-1.5-flash',
                'analysis_error':      result.get('error', False),
            }
        )
        return Response(EmotionAnalysisSerializer(analysis).data)
```

---

## 6. Hosting & Deployment

### Backend: Render

| Item | Detail |
|---|---|
| Platform | Render (render.com) |
| Service type | Web Service |
| Build command | `pip install -r requirements.txt && python manage.py migrate` |
| Start command | `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT` |
| Environment | Set all `.env` vars in Render dashboard → Environment |
| Auto-deploy | ON — triggers on push to `main` branch |
| Health check | `GET /api/health/` → returns `{"status": "ok"}` |
| Live URL | https://mindtrack-ai.onrender.com |

**Procfile** (in backend root):
```
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2
```

**Health check endpoint:**
```python
# config/urls.py
from django.http import JsonResponse
urlpatterns = [
    path('api/health/', lambda r: JsonResponse({'status': 'ok'})),
    # ... rest of urls
]
```

### Frontend: Vercel

| Item | Detail |
|---|---|
| Platform | Vercel (vercel.com) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment vars | Set `VITE_API_BASE_URL` in Vercel project settings |
| Auto-deploy | ON — triggers on push to `main` branch |

**Deployment steps:**
```bash
# 1. Push frontend/ to GitHub
# 2. Go to vercel.com → New Project → Import GitHub repo
# 3. Set root directory: frontend/
# 4. Add env var: VITE_API_BASE_URL = https://mindtrack-ai.onrender.com/api
# 5. Deploy
```

### CORS Configuration

Django must allow the Vercel domain:
```python
# settings.py
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')
# In production .env:
# CORS_ALLOWED_ORIGINS=https://mindtrack-ai.vercel.app
```

---

## 7. API Documentation

### Swagger UI via drf-spectacular

```python
# config/urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/schema/',             SpectacularAPIView.as_view(),      name='schema'),
    path('api/schema/swagger-ui/',  SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # App URLs
    path('api/auth/',     include('apps.users.urls')),
    path('api/entries/',  include('apps.journal.urls')),
    path('api/analyze/',  include('apps.analysis.urls')),
    path('api/mood/',     include('apps.reports.urls')),
    path('api/health/',   lambda r: JsonResponse({'status': 'ok'})),
]
```

Swagger UI live at: `https://mindtrack-ai.onrender.com/api/schema/swagger-ui/`

---

## 8. Testing

### Framework: pytest + pytest-django

```ini
# pyproject.toml
[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings"
python_files = ["test_*.py"]
addopts = "--cov=apps --cov-report=term-missing --cov-fail-under=70"
```

### What to Test

| Test file | What it covers |
|---|---|
| `test_auth.py` | Register, login, 401 on unauthenticated requests |
| `test_journal.py` | CRUD for entries, user isolation (user A can't read user B's entries) |
| `test_analysis.py` | Emotion validation, fallback on Gemini error (mock Gemini), crisis_detected flag |
| `test_reports.py` | Mood history endpoint, date filtering, weekly report generation |

### Mocking Gemini in Tests

```python
# tests/conftest.py
import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_gemini_success():
    mock_response = MagicMock()
    mock_response.text = '{"emotion":"happy","sentiment":"positive","mood_score":8,"wellness_suggestion":"Keep it up!","crisis_detected":false}'
    with patch('apps.analysis.gemini.genai.GenerativeModel') as mock_model:
        mock_model.return_value.generate_content.return_value = mock_response
        yield mock_model

@pytest.fixture
def mock_gemini_error():
    with patch('apps.analysis.gemini.genai.GenerativeModel') as mock_model:
        mock_model.return_value.generate_content.side_effect = Exception("Gemini down")
        yield mock_model
```

```bash
# Run tests
pytest
pytest --cov=apps --cov-report=html   # HTML report in htmlcov/
```

---

## 9. Git & GitHub Workflow

```
main            ← production-ready only. Auto-deploys to Render + Vercel.
  └── develop   ← integration branch
        ├── feat/journal-crud
        ├── feat/gemini-analysis
        ├── feat/mood-history
        └── feat/weekly-report
```

**Commit message format:**
```
feat: add emotion analysis endpoint
fix: handle Gemini quota exceeded error
docs: add API endpoint examples to README
test: add journal CRUD tests
chore: update requirements.txt
```

**GitHub Actions CI** (`.github/workflows/ci.yml`):
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with: { python-version: '3.12' }
      - run: pip install -r requirements.txt
      - run: pytest
        env:
          DJANGO_SECRET_KEY: test-secret-key
          DATABASE_URL: sqlite:///test.db
          GEMINI_API_KEY: fake-key-for-tests
          DEBUG: True
          ALLOWED_HOSTS: localhost
```

---

## 10. Complete Stack Summary

| Layer | Technology | Version | Hosted On |
|---|---|---|---|
| **Frontend** | React + Vite | React 18, Vite 5 | Vercel |
| **Routing** | React Router DOM | 6.x | — |
| **Charts** | Recharts | 2.x | — |
| **HTTP client** | Axios | 1.x | — |
| **Styling** | Tailwind CSS | 3.x | — |
| **Backend** | Django + DRF | Django 4.2, DRF 3.15 | Render |
| **API Docs** | drf-spectacular | 0.27 | Render |
| **Database** | Supabase PostgreSQL | PostgreSQL 15 | Supabase |
| **Auth** | Supabase Auth + SimpleJWT | — | Supabase |
| **AI API** | Google Gemini | gemini-1.5-flash | Google |
| **Rate Limiting** | django-ratelimit | 4.x | — |
| **Testing** | pytest-django + pytest-cov | 4.x / 5.x | GitHub Actions |
| **CI/CD** | GitHub Actions | — | GitHub |
| **Monitoring** | UptimeRobot (free) | — | UptimeRobot |

---

*MindTrack AI Tech Stack Document — ZLAQA Internship 2026*
