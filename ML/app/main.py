from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from app.face_service import face_service
from app.utils import load_image_from_bytes
import uvicorn

app = FastAPI(title="Face Recognition Microservice")

# Configuration
RECOGNITION_THRESHOLD = 0.6

@app.post("/load-encodings")
async def load_encodings():
    """
    Endpoint to trigger loading and encoding of faces from the known_faces directory.
    """
    success = face_service.load_encodings()
    if success:
        return {"message": "Encodings loaded and saved successfully."}
    else:
        raise HTTPException(status_code=500, detail="Failed to load encodings. Check data directory.")

@app.post("/reload-encodings")
async def reload_encodings():
    """
    Manually reload encodings and mapping from disk into memory.
    """
    success = face_service.load_from_disk()
    if success:
        return {"message": "Encodings reloaded from disk successfully.", "total": len(face_service.known_encodings)}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload encodings from disk.")

@app.delete("/user-faces/{user_id}")
async def delete_user_faces(user_id: str):
    """
    Delete all face data for a specific user_id.
    """
    success, message = face_service.delete_user_faces(user_id)
    if not success:
        raise HTTPException(status_code=404, detail=message)
    return {"message": message}

@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    """
    Endpoint to recognize faces in an uploaded image.
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        # Read image bytes
        contents = await file.read()
        image_rgb = load_image_from_bytes(contents)
        
        if image_rgb is None:
            raise HTTPException(status_code=400, detail="Invalid image file.")

        # Recognize faces with strict threshold
        results = face_service.recognize_faces(image_rgb, threshold=RECOGNITION_THRESHOLD)
        
        return results
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

@app.post("/register-face")
async def register_face(user_id: str = Form(...), file: UploadFile = File(...)):
    """
    Endpoint to register a new face for a student.
    """
    # Reject placeholder IDs
    if user_id.lower() == "string":
        raise HTTPException(status_code=400, detail="Invalid user_id. Please provide a real student ID.")

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        # Read image bytes
        contents = await file.read()
        image_rgb = load_image_from_bytes(contents)
        
        if image_rgb is None:
            raise HTTPException(status_code=400, detail="Invalid image file.")

        # Register face
        success, message = face_service.register_face(user_id, image_rgb)
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
            
        return {
            "message": message,
            "user_id": user_id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
