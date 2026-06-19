# 🧠 MindTrack AI

![Django CI](https://github.com/Farhan-kalady/MindTrack-AI/actions/workflows/django.yml/badge.svg?branch=master)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![Django](https://img.shields.io/badge/Django-6.0.2-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

> AI-powered Mental Health Journal & Emotion Tracker

MindTrack AI is a mental wellness platform where users journal their
daily thoughts and receive AI-powered emotion analysis, mood tracking,
and personalized wellness suggestions using Google Gemini AI.

---

## 🚀 Features

- 🔐 JWT Authentication (Register & Login)
- 📝 Full Journal CRUD (Create, Read, Update, Delete)
- 🤖 AI Emotion Detection via Google Gemini
- 📊 Mood History & Trend Analytics
- 📅 Weekly Wellness Summary Reports
- 🔍 Search & Filter Journal Entries
- 📖 Live Swagger API Documentation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django REST Framework |
| Database | Supabase PostgreSQL |
| Authentication | JWT (djangorestframework-simplejwt) |
| AI Integration | Google Gemini API (gemini-2.0-flash) |
| API Docs | drf-spectacular (Swagger UI) |
| Deployment | Railway |
| CI/CD | GitHub Actions |

---

## 📖 API Documentation

Live Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`

🌐 **Live URL:** `coming soon (Railway deployment)`

### Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register/` | Register new user | ❌ |
| POST | `/api/auth/login/` | Login & get JWT token | ❌ |
| GET | `/api/journals/` | List all entries | ✅ |
| POST | `/api/journals/` | Create journal entry | ✅ |
| GET | `/api/journals/{id}/` | Get single entry | ✅ |
| PUT | `/api/journals/{id}/` | Update entry | ✅ |
| DELETE | `/api/journals/{id}/` | Delete entry | ✅ |
| POST | `/api/journals/{id}/analyze/` | AI emotion analysis | ✅ |
| GET | `/api/mood/history/` | Mood history | ✅ |
| GET | `/api/mood/summary/` | Mood statistics | ✅ |
| GET | `/api/mood/weekly/` | Weekly report | ✅ |

---

## ⚙️ Environment Variables

Create a `.env` file in `mindtrack_backend/`:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | True for development |
| `DATABASE_URL` | Supabase PostgreSQL URL |
| `GEMINI_API_KEY` | Google Gemini API key |

---

## 🏃 Run Locally

```bash
# Clone the repo
git clone https://github.com/Farhan-kalady/MindTrack-AI.git
cd MindTrack-AI/mindtrack_backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

---

## 📸 Screenshots

### Swagger UI
![Swagger UI](docs/swagger-screenshot.png)

---

## 📐 Architecture

See [docs/architecture.md](mindtrack_backend/docs/architecture.md)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📬 Postman Collection

[View API Collection](https://documenter.getpostman.com/view/50265930/2sBXwvJ8EF)

---

## 🧪 Run Tests

```bash
python manage.py test journals
```

---

## 👤 Author

**Mohammed Farhan K**
- GitHub: [@Farhan-kalady](https://github.com/Farhan-kalady)

---

## 📄 License

MIT License