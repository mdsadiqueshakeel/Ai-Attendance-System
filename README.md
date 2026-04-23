# 🚀 AI Attendance System (Monorepo)

A scalable, production-ready **AI-powered Attendance Management System** built using modern backend architecture and designed for future ML integration.

---

## 🧠 Overview

This project is a **full-stack attendance system** designed to automate and manage attendance efficiently using secure authentication, role-based access control, and modular architecture.

It follows a **microservice-ready structure** with separate layers for backend, frontend, and machine learning services.

---

## 🏗️ Tech Stack

### Backend

* Java + Spring Boot
* Spring Security (JWT Authentication)
* Hibernate / JPA
* MySQL / PostgreSQL
* REST APIs

### Frontend

* React Native (Expo)
* Axios for API communication
* AsyncStorage for session handling

### DevOps & Tools

* AWS EC2 (Deployment)
* Docker (Containerization)
* Nginx (Reverse Proxy)
* PM2 (Process Management)

### Future Scope

* Python ML Service (Face Recognition / Smart Attendance)
* Microservices Architecture

---

## 📦 Project Structure

```
AI-Attendance-System/
│
├── Backend/      # Spring Boot REST API
├── frontend/     # React Native Mobile App
├── ML/           # Machine Learning Service (Planned)
```

---

## 🔐 Features Implemented

### ✅ Authentication & Authorization

* JWT-based login system
* Secure token storage
* Role-Based Access Control (RBAC)

  * Admin
  * Teacher
  * Student

### ✅ User Management

* Register new users
* Login with validation
* Role-based access handling

### ✅ Attendance System

* Mark attendance
* Fetch attendance reports by date
* Secure API endpoints

### ✅ Global Error Handling

* Centralized API error handling (frontend + backend)
* HTTP status-based responses

### ✅ Production-Level API Handling

* Axios interceptors (JWT injection + error handling)
* Clean service layer abstraction

---

## 📡 API Highlights

* `POST /api/auth/login` → User login (JWT)
* `POST /api/auth/register` → Register user
* `GET /api/attendance/report?date=YYYY-MM-DD` → Fetch attendance report

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

```bash
cd Backend
./mvnw spring-boot:run
```

OR

```bash
mvn clean install
java -jar target/app.jar
```

---

### 📱 Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

---

## 🌐 Environment Configuration

For real device testing:

```js
BASE_URL = http://<your-local-ip>:8080
```

Example:

```
http://192.168.1.10:8080
```

---

## 🚧 Current Status

* ✅ Backend API complete (Phase 1)
* ✅ Authentication & Attendance working
* ✅ Frontend integration complete
* 🚧 ML Integration (Upcoming)

---

## 🔮 Future Enhancements

* Face Recognition-based Attendance (Python ML)
* Real-time attendance tracking
* Admin dashboard analytics
* Push notifications
* Microservices migration

---

## 💡 Why This Project Matters

This project demonstrates:

* Real-world backend architecture
* Secure authentication systems
* API design & integration
* Deployment & DevOps practices
* Scalability planning (ML + microservices)

---

## 👨‍💻 Author

**Sadique**
Engineering Student | Backend Developer | MERN + Java

---

## ⭐ Support

If you like this project, give it a ⭐ and feel free to contribute!
