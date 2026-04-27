# 🚀 AI Attendance System (Monorepo)

A scalable, production-ready **AI-powered Attendance Management System** built using modern backend architecture and AI face recognition.

---

## 🧠 Overview

This project is a **full-stack attendance system** designed to automate and manage attendance efficiently using secure authentication, role-based access control, and a dedicated face recognition microservice.

It follows a **modular architecture** with separate layers for backend, frontend, and machine learning services.

---

## 🏗️ Tech Stack

### Backend
* Java + Spring Boot
* Spring Security (JWT Authentication)
* Hibernate / JPA
* MySQL / PostgreSQL
* REST APIs

### Machine Learning (Face Recognition)
* Python + FastAPI
* OpenCV & face_recognition
* NumPy
* Euclidean Distance Matching (128-d encodings)

### Frontend
* React Native (Expo)
* Axios for API communication
* AsyncStorage for session handling

### DevOps & Tools
* AWS EC2 (Deployment)
* Docker (Containerization)
* Nginx (Reverse Proxy)
* PM2 (Process Management)

---

## 📦 Project Structure

```text
AI-Attendance-System/
│
├── backend/      # Spring Boot REST API
├── frontend/     # React Native Mobile App
├── ml/           # FastAPI Face Recognition Service
```

---

## 🔐 Features Implemented

### ✅ AI Face Recognition
* Automatic face detection and 128-d feature extraction.
* One-shot learning (add users via images without retraining).
* Group photo recognition (detects and identifies multiple faces).
* High-performance in-memory encoding cache.

### ✅ Authentication & Authorization
* JWT-based login system
* Secure token storage
* Role-Based Access Control (RBAC) - Admin, Teacher, Student

### ✅ Attendance System
* Mark attendance via face recognition or manual entry.
* Fetch attendance reports by date.
* Secure API endpoints.

---

## 📡 API Highlights

* `POST /api/auth/login` → User login (JWT)
* `POST /api/attendance/report?date=YYYY-MM-DD` → Fetch attendance report
* `POST /recognize` (ML Service) → Identify users in group images

---

## ⚙️ Setup Instructions

### 🔧 ML Service Setup (Python)
```bash
cd ml
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 🔧 Backend Setup (Java)
```bash
cd backend
./mvnw spring-boot:run
```

### 📱 Frontend Setup (React Native)
```bash
cd frontend
npm install
npx expo start
```

---

## 🚧 Current Status

* ✅ Backend API complete
* ✅ Authentication & Attendance working
* ✅ ML Face Recognition Service complete
* ✅ Frontend integration complete
* 🚧 Real-time Dashboard (Upcoming)

---

## 👨‍💻 Author

**Sadique**
Engineering Student | Backend Developer | MERN + Java

---

## ⭐ Support

If you like this project, give it a ⭐ and feel free to contribute!
