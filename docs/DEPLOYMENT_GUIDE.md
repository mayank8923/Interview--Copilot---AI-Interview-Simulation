# Interview Copilot Deployment Guide

This guide explains how to deploy the Interview Copilot system to production for free (or very low cost) using modern cloud platforms.

## Overview
1. **Database:** MongoDB Atlas (Free Tier)
2. **Backend:** Render or Railway (Docker Container)
3. **Frontend:** Vercel or Netlify (Static Hosting)

---

## 1. Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free M0 cluster.
2. Under **Database Access**, create a user with a strong password.
3. Under **Network Access**, click **Add IP Address**. Choose **Allow Access from Anywhere** (`0.0.0.0/0`). This is required so your cloud backend can connect to it.
4. Click **Connect** -> **Drivers** and copy your Connection String (URI). Replace `<password>` with your actual password.

---

## 2. Backend (Render / Railway)

We recommend using [Render](https://render.com/) or [Railway](https://railway.app/).

1. Connect your GitHub repository to Render/Railway.
2. Create a new **Web Service**.
3. Point it to your repository.
4. **Important:** Specify the Root Directory as `backend` (or ensure it finds the `Dockerfile` inside the `backend` folder).
5. Add the following **Environment Variables**:
   - `MONGODB_URI`: The connection string you copied from Atlas.
   - `JWT_SECRET`: Generate a long, random string (at least 256 bits).
   - `CORS_ALLOWED_ORIGINS`: Set this to your frontend URL later (e.g., `https://my-frontend.vercel.app`). For testing, you can use `*`.
   - `AI_API_KEY`: Your OpenAI/Gemini API key.

The platform will automatically detect the `Dockerfile`, build the Java application, and launch it.

---

## 3. Frontend (Vercel)

We recommend using [Vercel](https://vercel.com/) for the React frontend.

1. Create a new project in Vercel and import your GitHub repository.
2. Edit the **Root Directory** to be `frontend`.
3. Vercel will automatically detect that it's a Vite project. The Build Command should be `npm run build` and Output Directory `dist`.
4. Add the following **Environment Variable**:
   - `VITE_API_BASE_URL`: Set this to the public URL of your deployed backend (e.g., `https://interview-copilot-backend.onrender.com/api/v1`).
5. Click **Deploy**.

Once deployed, copy the Vercel URL and add it to the `CORS_ALLOWED_ORIGINS` environment variable in your Backend service so the browser allows the requests.

---

## 4. Final Smoke Test
- Go to your Vercel URL.
- Create an account.
- Start a mock interview or upload a resume to verify the AI and Database are communicating correctly in the cloud!

