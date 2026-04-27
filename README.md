# 📸 Smart Attendance System (AI-Powered)

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-00584C?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A professional, full-stack automated attendance management system leveraging **AI Face Recognition** to streamline classroom management. This project demonstrates a modern microservice-style architecture integrating Java, Python, and JavaScript.

---

## 📖 Project Overview

Traditional attendance marking is time-consuming and prone to errors. This **Smart Attendance System** solves this by allowing teachers to simply capture a group photo of the classroom. The system then automatically identifies students using high-accuracy face recognition and marks their attendance instantly in the database.

### 🌟 Why this project?
- **Efficiency**: Reduces attendance time from minutes to seconds.
- **Accuracy**: Uses 128-dimensional face encodings for reliable identification.
- **Scalability**: Decoupled ML service allows for independent scaling.
- **Mobile First**: Easy-to-use mobile interface for teachers on the go.

---

## ✨ Features

*   🔐 **Secure Authentication**: JWT-based login with role-based access control (RBAC).
*   👨‍🎓 **Student Management**: Full CRUD operations for managing student records and profile images.
*   🧠 **AI Face Recognition**: High-performance face detection and matching using a pre-trained Dlib model.
*   ⚡ **Auto Attendance**: Instant marking of attendance from a single group photo.
*   📊 **Detailed Reports**: Daily attendance analytics with present/absent counts.
*   🖼️ **Image Optimization**: Automatic compression (max 800px, 70% quality) to save storage and improve performance.
*   🧮 **Strict Filtering**: Confidence-based matching (threshold >= 0.6) to eliminate false positives.
*   🗂 **Static File Serving**: Efficient local storage and serving of student images.

---

## 🏗️ System Architecture

The system consists of three main components communicating via RESTful APIs:

1.  **Frontend (Mobile App)**: Built with **React Native (Expo)**, it handles the camera interface and displays attendance results.
2.  **Backend (Core Service)**: Built with **Spring Boot**, it manages business logic, student data, security, and image processing.
3.  **ML Service (Face Recognition)**: A **FastAPI** microservice that performs heavy computational tasks like face encoding and matching.

### 🔄 Data Flow
1. **Teacher** takes a photo via the mobile app.
2. **Mobile App** sends the multipart image to the **Backend**.
3. **Backend** compresses the image and forwards it to the **ML Service**.
4. **ML Service** detects faces, generates 128-d encodings, and compares them against known student encodings.
5. **ML Service** returns a list of identified `user_ids` with confidence scores.
6. **Backend** marks identified students as `PRESENT` and others as `ABSENT` for the current date.
7. **Mobile App** displays the final attendance summary to the teacher.

---

## 🛠️ Tech Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React Native (Expo), Axios, React Navigation, Lucide Icons, Expo Camera |
| **Backend** | Java 17, Spring Boot 3, Spring Security (JWT), Hibernate/JPA, Thumbnailator |
| **ML Service** | Python 3.9+, FastAPI, Face Recognition, Dlib, OpenCV, NumPy |
| **Database** | PostgreSQL |

---

## 📦 Project Structure

```text
Smart-Attendance-System/
├── backend/            # Spring Boot Application (Business Logic & API)
│   ├── src/main/java   # Java Source Code
│   └── src/resources   # Configuration & Static Assets
├── ml/                 # FastAPI Service (Face Recognition Logic)
│   ├── app/            # Microservice logic
│   └── known_faces/    # Directory for storing student face encodings
└── frontend/           # React Native Mobile Application
    ├── src/screens     # UI Components & Screens
    └── src/services    # API Communication Layer
```

---

## 🧠 Machine Learning Implementation

The system uses **One-Shot Learning** logic, meaning it doesn't require retraining for new students.
- **Feature Extraction**: Converts face images into 128-dimensional numerical vectors (encodings).
- **Matching**: Uses **Euclidean Distance** to compare the input face with stored encodings.
- **Thresholding**: A strict threshold of **0.6** is applied. Distance < 0.4 (Confidence > 0.6) is considered a match.
- **Performance**: Encodings are cached in memory for near-instant recognition.

---

## 📡 API Documentation

### Backend APIs (Spring Boot)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Authenticate user and return JWT |
| `/api/students` | `GET/POST` | Manage student records |
| `/api/students/{id}/image` | `POST` | Upload and compress student face image |
| `/api/attendance/auto` | `POST` | Process group photo for auto-attendance |
| `/api/attendance/report` | `GET` | Get class attendance report by date |
| `/files/**` | `GET` | Serve student profile images |

### ML APIs (FastAPI)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/recognize` | `POST` | Detect and identify faces in a multipart image |
| `/load-encodings` | `POST` | Re-scan storage to update in-memory encodings |

---

## 🚀 Setup Instructions

### 1. ML Service (Python)
```bash
cd ml
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Backend (Java)
- Configure PostgreSQL in `src/main/resources/application.properties`.
- Update `app.ml.service-url=http://localhost:8000`.
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend (Mobile)
```bash
cd frontend
npm install
npx expo start
```

---

## 📈 Future Roadmap
- [ ] **Cloud Storage**: Migrate from local storage to AWS S3.
- [ ] **Anti-Spoofing**: Implement liveness detection to prevent photo-based cheating.
- [ ] **Real-time Dashboard**: Build a web-based analytics dashboard for administrators.
- [ ] **Push Notifications**: Notify parents when a student is marked absent.

---

## 🤝 Contribution
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author
**Saad**
*   Engineering Student | Software Developer
*   [GitHub](https://github.com/yourusername)
*   [LinkedIn](https://linkedin.com/in/yourusername)
