# Smart Attendance System - ML Microservice

This is a face recognition microservice built with FastAPI, OpenCV, and the `face_recognition` library. It serves as a backend component for identifying users from images and returning their IDs for attendance marking.

## Project Structure

```text
ml/
├── app/
│   ├── main.py          # FastAPI application & endpoints
│   ├── face_service.py   # Core face recognition logic
│   └── utils.py         # Image processing utilities
├── data/
│   ├── known_faces/     # User folders containing face images
│   ├── encodings.npy    # Serialized face encodings (generated)
│   └── mapping.json     # Index to User ID mapping (generated)
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## Setup Instructions

### 1. Prerequisites
- Python 3.8+
- CMake (required for `face_recognition` / `dlib` installation)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Data Preparation
Place user face images in `ml/data/known_faces/`. Each folder should be named with the `user_id`:
```text
ml/data/known_faces/
├── user101/
│   ├── img1.jpg
│   └── img2.jpg
└── user102/
    └── img1.jpg
```

### 4. Run the Service
```bash
uvicorn app.main:app --reload
```
The service will be available at `http://localhost:8000`.

## API Endpoints

### `POST /load-encodings`
Traverses the `known_faces` directory, extracts 128-d encodings, and saves them to disk. It also updates the in-memory cache.
- **Response**: `{"message": "Encodings loaded and saved successfully."}`

### `POST /recognize`
Accepts an image and returns a list of recognized users.
- **Input**: `multipart/form-data` with an `image` file.
- **Response**:
  ```json
  [
    {
      "user_id": "user101",
      "confidence": 0.92
    }
  ]
  ```

## Integration Details
- **Model**: Pre-trained ResNet-based face recognition model (128-d encodings).
- **Threshold**: Euclidean distance threshold of 0.6 (Confidence = 1 - Distance).
- **Performance**: Encodings are cached in memory for fast inference.
