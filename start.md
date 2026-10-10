# Quick Start Guide

This guide explains how to start the portfolio servers locally.

---

## 1. Prerequisites & First-Time Setup

Ensure dependencies are installed:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

---

## 2. Starting the Servers

To use all features (including the macOS Mail app), run both the **Frontend** and **Backend** servers.

### Method A: Two Separate Terminals (Recommended)

#### Terminal 1 — Frontend (Vite)
From the project root:
```bash
npm run dev
```
> **URL:** [http://localhost:5174](http://localhost:5174)

---

#### Terminal 2 — Backend (Express API)
From the project root:
```bash
npm start
```
*Alternatively:*
```bash
cd backend
npm start
```
> **URL:** [http://localhost:3001](http://localhost:3001)  
> The frontend automatically forwards any `/api/*` requests to this backend.

---

### Method B: Single Terminal (PowerShell Background)

If you are using Windows PowerShell and want to launch both in one go:

```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
```

---

## 3. Stopping the Servers

- In any interactive terminal window, press:
  ```text
  Ctrl + C
  ```
  and type `Y` if prompted.

---

## 4. Email Configuration (Optional)

If you want the portfolio Mail app to send real emails, configure your credentials in `backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_RECEIVER=receiver-email@gmail.com
```

> **Note:** For Gmail, generate and use an **App Password** from your Google Account settings, not your regular Gmail password.
