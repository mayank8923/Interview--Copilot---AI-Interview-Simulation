# Interview Copilot — AI Interview Simulation System

[![CI Pipeline](https://github.com/your-org/interview-copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/interview-copilot/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.x-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/atlas)

**Interview Copilot** is an AI-powered interview preparation platform designed for students, fresh graduates, and job seekers to prepare for technical (DSA, CS Fundamentals) and HR/Behavioral interviews in one unified place.

---

## 🚀 Key Features

- 🎯 **Target Role & Company Customization:** Tailor practice and interview sessions specifically to target roles (e.g. Full Stack Developer, Data Analyst) and target companies.
- 💡 **Curated Practice Bank:** 50+ DSA and CS questions with interactive split-pane code editor and instant AI feedback.
- ⏱️ **AI Mock Interview Room:** 15/30-minute adaptive simulated interview sessions with live countdown timers and auto-submission.
- 📊 **Multidimensional Evaluation Reports:** Detailed scorecard with 5-dimension radar charts (Technical, Problem-Solving, Communication, Completeness, Confidence) and actionable improvement suggestions.
- 📄 **AI Resume Scanner:** PDF resume upload, keyword gap analysis, and section-by-section role alignment suggestions.
- 📈 **Candidate Dashboard & Readiness Meter:** Dynamic Readiness Score indicator $(0–100)$, score trends, and topic weakness heatmaps.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Zustand, Lucide Icons, Recharts, Axios |
| **Backend** | Java 17 LTS, Spring Boot 3.2.x, Spring Security 6 (JWT + OAuth2), Spring WebFlux (WebClient), Apache PDFBox 3.x |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB |
| **AI Integration** | OpenAI API (`gpt-4o-mini`) / Google Gemini API (`gemini-1.5-flash`) |
| **CI/CD & Hosting** | GitHub Actions, Railway / Render / Vercel |

---

## 📂 Project Structure

```
interview-copilot/
├── backend/               # Java 17 + Spring Boot 3 REST API
│   ├── src/main/java/     # Application logic (controllers, services, security)
│   ├── src/main/resources/# Configuration profiles (application.yml)
│   └── pom.xml            # Maven project descriptor
├── frontend/              # React 18 + Vite 5 + Tailwind CSS SPA
│   ├── src/               # React components, pages, hooks, state
│   ├── tailwind.config.js # Design system tokens
│   └── package.json       # Node dependencies
├── docs/                  # System specifications & architecture docs
│   ├── PRD.md             # Product Requirements Document
│   ├── SRS.md             # Software Requirements Specification
│   ├── SystemArchitecture.md # System Architecture Document
│   ├── UI_UX_DESIGN.md    # UI/UX Design System & Screen Specs
│   ├── DEVELOPMENT_PLAN.md# 8-Week Sprint Engineering Roadmap
│   └── RTM.md             # Requirements Traceability Matrix
├── .github/workflows/     # CI/CD pipelines
└── docker-compose.yml     # Local services container orchestration
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+** & **npm**
- **MongoDB** (Local instance or MongoDB Atlas Connection URI)

### 1. Clone & Environment Setup

```bash
git clone https://github.com/your-org/interview-copilot.git
cd interview-copilot
```

### 2. Backend Setup (Spring Boot)

```bash
cd backend
# Copy environment template
cp .env.example .env

# Compile and run backend (defaults to port 8080)
mvn clean spring-boot:run
```

The backend will be available at: `http://localhost:8080`  
Health check endpoint: `http://localhost:8080/api/v1/health`

### 3. Frontend Setup (React / Vite)

```bash
cd ../frontend
# Copy environment template
cp .env.example .env

# Install dependencies and start Vite dev server
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🧪 Testing

```bash
# Backend unit & integration tests
cd backend && mvn test

# Frontend build & typecheck
cd frontend && npm run build
```

---

## 📜 Documentation Links

- 📋 [Product Requirements Document (PRD)](docs/PRD.md)
- 📐 [Software Requirements Specification (SRS)](docs/SRS.md)
- 🏗️ [System Architecture Document (SAD)](docs/SystemArchitecture.md)
- 🎨 [UI/UX Specification & Design System](docs/UI_UX_DESIGN.md)
- 🗺️ [Development Plan & Sprint Roadmap](docs/DEVELOPMENT_PLAN.md)
- 🔍 [Requirements Traceability Matrix (RTM)](docs/RTM.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

