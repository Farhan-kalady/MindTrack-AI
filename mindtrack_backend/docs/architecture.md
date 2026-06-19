# MindTrack AI — Architecture

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                        │
│         (Browser / Mobile App)                  │
└────────────────────┬────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────┐
│           DJANGO REST FRAMEWORK                 │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  users/  │  │journals/ │  │  Swagger UI  │  │
│  │  views   │  │  views   │  │ /api/schema/ │  │
│  └────┬─────┘  └────┬─────┘  └──────────────┘  │
│       │              │                           │
│  ┌────▼──────────────▼──────────────────────┐   │
│  │         JWT Authentication               │   │
│  │    (djangorestframework-simplejwt)       │   │
│  └──────────────────┬───────────────────────┘   │
└─────────────────────┼───────────────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
           ▼                     ▼
┌─────────────────┐   ┌─────────────────────────┐
│   SUPABASE      │   │     GOOGLE GEMINI AI     │
│   PostgreSQL    │   │    gemini-2.0-flash      │
│                 │   │                          │
│ • users         │   │ Input: journal text      │
│ • journals_     │   │ Output: JSON emotion     │
│   journalentry  │   │ analysis                 │
│ • journals_     │   └─────────────────────────┘
│   emotionana..  │
└─────────────────┘
```

## Data Flow

1. User sends request with JWT token
2. Django validates token
3. For journal entries → saved to Supabase
4. For AI analysis → text sent to Gemini API
5. Gemini returns emotion JSON
6. Result saved to EmotionAnalysis table
7. Response returned to user