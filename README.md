# ANTIGRAVITY - AI-Powered Career Intelligence Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farjav527%2FAI-Powered-Career-Intelligence-Platform&env=VITE_API_URL&build-command=npm%20run%20build&install-command=npm%20install&output-directory=frontend%2Fdist&root-directory=frontend)

## Overview
Antigravity is an industry-level SaaS application designed to help job seekers optimize their career trajectory using AI. It provides resume matching, skill gap analysis, salary prediction, and ATS compatibility scoring.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Recharts, jsPDF
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **ML Service**: Python, FastAPI, Scikit-learn, NLTK, Pandas

## Features
- **Job Matching**: TF-IDF & Cosine Similarity to match resumes with job descriptions.
- **Skill Gap Analysis**: Identifies missing skills for a target role.
- **Salary Prediction**: Estimates salary based on experience and skills.
- **ATS Scoring**: Simulates Applicant Tracking System scoring.
- **PDF Reports**: Generates downloadable career reports.
- **Dark Mode**: Fully responsive UI with dark/light themes.

## Setup & partial Installation

### Prerequisites
- Node.js (v16+)
- Python (3.8+)
- MongoDB Atlas (Connection String)

### 1. Clone & Install
```bash
git clone <repo-url>
cd antigravity
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file
# PORT=5000
# MONGO_URI=mongodb+srv://...
# JWT_SECRET=your_secret
# ML_SERVICE_URL=http://localhost:8000/api/v1
npm run dev
```

### 3. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment Guide

### 1. Deploying Backend & ML Service (Render)
This project includes a `render.yaml` Blueprint for easy deployment.

1.  Push this repository to your GitHub.
2.  Log in to [Render](https://render.com).
3.  Go to **Blueprints** -> **New Blueprint Instance**.
4.  Connect your repository.
5.  Render will automatically detect `antigravity-backend` and `antigravity-ml-service`.
6.  **Important**: You must add the following Environment Variables in the Render Dashboard for `antigravity-backend`:
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A secure random string.

### 2. Deploying Frontend (Vercel)
1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Select `Vite`.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://antigravity-backend.onrender.com`).
7.  Click **Deploy**.

## API Endpoints
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Login
- `GET /api/reports` - Get user reports
- `POST /api/reports` - Create new analysis
