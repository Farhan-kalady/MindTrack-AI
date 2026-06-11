# 🧠 MindTrack AI

![Django CI](https://github.com/Farhan-kalady/MindTrack-AI/actions/workflows/django.yml/badge.svg)

AI-powered mental health journal...

### AI-Powered Mental Health Journal & Emotion Tracker

MindTrack AI is a socially impactful wellness platform that helps users record their daily thoughts and emotions through journaling. Using Artificial Intelligence, the system analyzes journal entries to identify emotions, track mood patterns, and provide personalized wellness insights.

---

## 📌 Problem Statement

Mental health challenges such as stress, anxiety, and emotional burnout are increasingly common among students and professionals. Many individuals struggle to understand their emotional patterns and maintain consistent self-reflection habits.

MindTrack AI provides a secure digital journaling platform that leverages AI to help users track emotions, understand mood trends, and receive supportive wellness suggestions.

---

## 🎯 Objectives

* Enable users to maintain daily journal entries.
* Detect emotions using AI.
* Track mood history and emotional trends.
* Generate personalized wellness recommendations.
* Promote emotional awareness and self-reflection.

---

## ✨ Key Features

### User Management

* User Registration
* User Login
* Secure Authentication with Supabase

### Journal Management

* Create Journal Entries
* View Journal History
* Update Journal Entries
* Delete Journal Entries

### AI Features

* Emotion Detection
* Sentiment Analysis
* Mood Scoring (0–10)
* Personalized Wellness Suggestions
* Weekly Mood Summary Generation

### Analytics

* Mood Tracking Dashboard
* Emotion Trends Visualization
* Weekly Wellness Reports

---

## 🤖 AI Integration

The platform uses OpenAI APIs to:

* Analyze journal entries
* Detect emotions (Happy, Sad, Anxious, Angry, Neutral, etc.)
* Perform sentiment analysis
* Generate supportive and personalized wellness suggestions
* Create weekly emotional summaries

### Example

**Journal Entry**

> "I have been feeling stressed about my exams and future career."

**AI Output**

```json
{
  "emotion": "Anxiety",
  "sentiment": "Negative",
  "mood_score": 4,
  "suggestion": "Break your goals into smaller tasks and take regular breaks to reduce stress."
}
```

---

## 🏗️ Tech Stack

| Component         | Technology                |
| ----------------- | ------------------------- |
| Backend           | Django REST Framework     |
| Database          | Supabase PostgreSQL       |
| Authentication    | Supabase Auth             |
| AI Integration    | OpenAI API                |
| API Documentation | Swagger / drf-spectacular |
| Deployment        | Railway                   |
| Version Control   | Git & GitHub              |

---

## 📂 Project Structure

```text
mindtrack-ai/
│
├── backend/
├── users/
├── journal/
├── docs/
├── tests/
│
├── requirements.txt
├── manage.py
├── README.md
└── .env
```

---

## 🔌 API Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | /api/auth/register/ | Register User        |
| POST   | /api/auth/login/    | Login User           |
| GET    | /api/journals/      | Get Journal Entries  |
| POST   | /api/journals/      | Create Journal Entry |
| GET    | /api/journals/{id}/ | Retrieve Entry       |
| PUT    | /api/journals/{id}/ | Update Entry         |
| DELETE | /api/journals/{id}/ | Delete Entry         |
| POST   | /api/analyze/{id}/  | Analyze Emotion      |
| GET    | /api/mood/history/  | Mood History         |
| GET    | /api/mood/summary/  | Weekly Summary       |

---

## 🚀 Deployment

The application will be deployed using Railway and connected to Supabase PostgreSQL.

---

## 🔮 Future Enhancements

* Mobile Application
* Voice Journal Entries
* AI Mood Prediction
* Mental Wellness Resource Recommendations
* Community Support Features

---

## 🌍 Social Impact

MindTrack AI aims to improve emotional awareness and mental well-being by providing users with an intelligent journaling experience. The platform encourages healthy self-reflection and helps users understand their emotions through AI-powered insights.

---

## 👨‍💻 Author

**Mohammed Farhan K**

* GitHub: https://github.com/Farhan-kalady
* LinkedIn: [www.linkedin.com/in/farhan-kalady-70651523b](http://www.linkedin.com/in/farhan-kalady-70651523b)

---

## 📄 License

This project is developed as part of an AI Internship Project and is intended for educational and learning purposes.
