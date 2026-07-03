# 🧠 MindTrack AI — AI-Powered Mental Health Journal & Emotion Tracker

[![CI Pipeline](https://github.com/Farhan-kalady/mindtrack-ai/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Farhan-kalady/mindtrack-ai/actions)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-REST%20Framework-092E20?style=flat&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat&logo=google&logoColor=white)](https://aistudio.google.com)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

> Write. Reflect. Understand. — MindTrack AI turns your daily journal entries into emotional insight using Google Gemini AI.

---

## 🌐 Live Demo

| | URL |
|---|---|
| **🖥️ Web App** | [https://mind-track-ai-phi.vercel.app/](https://mind-track-ai-phi.vercel.app/) |
| **📋 Swagger API Docs** | [https://mindtrack-ai-lw6i.onrender.com/api/schema/swagger-ui/](https://mindtrack-ai-lw6i.onrender.com/api/schema/swagger-ui/) |
| **📖 ReDoc** | [https://mindtrack-ai-lw6i.onrender.com/api/schema/redoc/](https://mindtrack-ai-lw6i.onrender.com/api/schema/redoc/) |
| **📬 Postman Collection** | [View Collection](https://documenter.getpostman.com/view/50265930/2sBXwvJ8EF) |

---

## 📸 Screenshots

### 🏠 Home — Landing Page
![Home Page](docs/screenshots/home.png)

### 📝 Journal — My Entries
![Journal Page](docs/screenshots/journal.png)

### 📊 Dashboard — Mood Analytics
![Dashboard Page](docs/screenshots/dashboard.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure register & login with Supabase Auth |
| 📝 **Journal CRUD** | Create, read, update, delete personal journal entries |
| 🤖 **AI Emotion Detection** | Google Gemini AI detects dominant emotion from every entry |
| 📊 **Mood Score Tracking** | AI scores your mood 0–10 based on what you wrote |
| 💡 **Wellness Suggestions** | Personalized AI-generated wellness advice per entry |
| 📈 **Mood History & Trends** | Visualize mood over 7 days, 30 days, or all time |
| 📅 **Weekly AI Reports** | AI narrative summary of your emotional week |
| 🚨 **Crisis Detection** | Distress signals flagged — helpline resources shown immediately |
| 🔍 **Search & Filter** | Search journal entries by title or content |
| 📖 **Live Swagger Docs** | Interactive API documentation always live |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · Vite · Tailwind CSS · Recharts · Framer Motion |
| **Backend** | Django REST Framework · Python 3.13 |
| **Database** | Supabase (PostgreSQL 15 + Auth + RLS) |
| **AI** | Google Gemini API (gemini-2.0-flash) |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **API Docs** | drf-spectacular (Swagger UI + ReDoc) |
| **Deployment** | Render (backend) · Vercel (frontend) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | UptimeRobot |

---

## 📖 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register/` | Register new user | ❌ |
| POST | `/api/auth/login/` | Login & get JWT token | ❌ |
| GET | `/api/journals/` | List all journal entries | ✅ |
| POST | `/api/journals/` | Create new journal entry | ✅ |
| GET | `/api/journals/{id}/` | Get single entry | ✅ |
| PUT | `/api/journals/{id}/` | Update entry | ✅ |
| DELETE | `/api/journals/{id}/` | Delete entry | ✅ |
| POST | `/api/journals/{id}/analyze/` | AI emotion analysis | ✅ |
| GET | `/api/mood/history/` | Mood score time-series | ✅ |
| GET | `/api/mood/summary/` | Mood statistics | ✅ |
| GET | `/api/mood/weekly/` | Weekly AI report | ✅ |
| GET | `/api/health/` | Health check | ❌ |

Full interactive docs → [Swagger UI](https://mindtrack-ai-lw6i.onrender.com/api/schema/swagger-ui/)

---

## ⚙️ Environment Variables

Create a `.env` file inside `backend/`:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## 🏃 Run Locally

You need **two terminals** open at the same time.

### Terminal 1 — Backend

```bash
# Clone the repository
git clone https://github.com/Farhan-kalady/mindtrack-ai.git
cd mindtrack-ai/backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run database migrations
python manage.py migrate

# Start Django server
python manage.py runserver
# Backend running at http://127.0.0.1:8000
```

### Terminal 2 — Frontend

```bash
cd mindtrack-ai/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Start React dev server
npm run dev
# Frontend running at http://localhost:5173
```

### Verify Everything is Running

| URL | Expected |
|---|---|
| `http://127.0.0.1:8000/api/health/` | `{"status": "ok"}` |
| `http://127.0.0.1:8000/api/schema/swagger-ui/` | Swagger UI loads |
| `http://localhost:5173` | MindTrack AI home page |

---

## 🧪 Run Tests

```bash
cd backend
pytest --cov=apps --cov-report=term-missing
```

Expected output: **82/82 tests passing · 82% coverage**

---

## 🔒 Security Features

- **Rate Limiting** — AI analysis endpoint limited to 5 requests/minute per user (`django-ratelimit`)
- **CORS** — Configured with `django-cors-headers` for secure frontend connections
- **Input Validation** — Journal entries require 10–5000 characters (serializer enforced)
- **Row Level Security** — Supabase RLS ensures users only access their own data
- **JWT Auth** — All protected endpoints require valid Bearer token

---

## 📐 Architecture

```
React Frontend (Vercel)
        ↓ HTTPS / REST
Django REST API (Render)
    ↙           ↘
Supabase      Google Gemini API
PostgreSQL    (gemini-2.0-flash)
+ Auth + RLS
```

See full architecture → [docs/architecture.md](backend/docs/architecture.md)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 👤 Author

**Mohammed Farhan K**
- 🐙 GitHub: [@Farhan-kalady](https://github.com/Farhan-kalady/)
- 💼 LinkedIn: [Mohammed Farhan K](https://www.linkedin.com/in/mohammed-farhan-k)
- 📧 Email: farhancherushola@gmail.com

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built during the ZLAQA Python & AI Internship 2026 — Zero Barriers. One Voice.*