# 🗳️ VoteWise — AI-Powered Election Assistant

> **Built with AI | Prompt Wars Virtual Hackathon**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-blue?style=for-the-badge&logo=google-cloud)](https://election-frontend-q64fufwmwa-uc.a.run.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Pro-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Analytics-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

VoteWise is an AI-powered election assistant that helps citizens navigate the democratic process with confidence. It combines interactive guides, real-time timelines, civic quizzes, and an AI chatbot to deliver a comprehensive voter education platform.

## 🚀 Live Demo

**[https://election-frontend-q64fufwmwa-uc.a.run.app/](https://election-frontend-q64fufwmwa-uc.a.run.app/)**

## ✨ Key Features

| Feature | Description | Google Service |
|---------|-------------|----------------|
| **🤖 AI Election Assistant** | Gemini Pro-powered chatbot for election queries | Google Gemini API |
| **📋 Interactive Guide** | Step-by-step voter registration walkthrough with images | — |
| **📅 Election Timeline** | Visual milestone tracker with Google Calendar sync | Google Calendar |
| **🧠 Civic Knowledge Quiz** | Interactive quiz with scoring and explanations | — |
| **📊 Analytics Dashboard** | User engagement tracking | Firebase Analytics |
| **🔒 Security Hardened** | CSP, XSS protection, input sanitization, rate limiting | — |

## 🏗️ Architecture

```
Election_App/
├── frontend/                  # React 19 + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── constants/         # Centralized app data & configuration
│   │   ├── hooks/             # Custom React hooks (useChat)
│   │   ├── utils/             # Shared utilities (sanitize, debounce)
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   └── __tests__/         # Vitest test suites (62 tests)
│   └── index.html             # Entry point with security headers
├── backend/                   # FastAPI + Google Gemini Pro
│   ├── main.py                # API server with rate limiting & CORS
│   └── test_main.py           # Backend pytest suite
└── .gitignore
```

## 🛠️ Tech Stack

### Frontend
- **React 19** with lazy-loaded routes and `React.memo` optimization
- **Tailwind CSS 4** with glassmorphism design system
- **Framer Motion** for micro-animations
- **Vite 8** with ES2020 build target
- **Vitest** — 62 passing tests across 5 test files

### Backend
- **FastAPI** with async request handling
- **Google Gemini Pro** for AI responses
- **SlowAPI** rate limiting (20 req/min)
- **GZip middleware** for response compression
- **Pydantic** input validation

### Google Services
- **Google Gemini API** — AI chatbot backend
- **Firebase Analytics** — User engagement tracking
- **Google Calendar API** — One-click event scheduling
- **Google Cloud Run** — Serverless deployment

## 🧪 Testing Strategy

```bash
# Run all 62 frontend tests
cd frontend && npm run test

# Run backend tests
cd backend && pytest test_main.py -v
```

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| `helpers.test.js` | 14 | Utility functions: sanitize, debounce, calendar, clamp |
| `constants.test.js` | 20 | Data integrity: nav items, quiz, timeline, guide |
| `Quiz.test.jsx` | 12 | Full user workflow, ARIA, edge cases |
| `Guide.test.jsx` | 10 | Rendering, navigation, accessibility |
| `App.test.jsx` | 8 | Integration: routing, landmarks, skip links |
| `test_main.py` | 6 | API endpoints, security headers, rate limiting |

## 🔒 Security

- **Content Security Policy** (CSP) via `<meta>` tags
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Camera, mic, geolocation disabled
- **DOMPurify** sanitization on all user inputs
- **Rate limiting** on API endpoints (20/min)
- **CORS** restricted to allowed origins
- **HSTS** with 1-year max-age

## ♿ Accessibility

- **Skip-to-content** link for keyboard navigation
- **ARIA landmarks**: `role="navigation"`, `role="log"`, `role="progressbar"`
- **`aria-current="step"`** on active guide steps
- **`aria-checked`** on quiz radio options
- **`aria-live="polite"`** on chat message area
- **Semantic HTML**: `<article>`, `<time>`, `<nav>`, `<section>`, `<main>`
- **`loading="lazy"`** on all non-critical images

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/Meowz-18/ElectionGuide.git
cd ElectionGuide

# Frontend
cd frontend
npm install
npm run dev          # → http://localhost:5173

# Backend (separate terminal)
cd backend
pip install fastapi uvicorn google-generativeai python-dotenv slowapi pydantic
uvicorn main:app --reload  # → http://localhost:8000
```

## 📄 License

Built for the **Prompt Wars Virtual Hackathon** by [Google for Developers](https://developers.google.com/) × [Hack2Skill](https://hack2skill.com/).

---

<p align="center">
  <b>#BuildwithAI #PromptWarsVirtual</b><br/>
  <i>Empowering informed democracy through AI.</i>
</p>
