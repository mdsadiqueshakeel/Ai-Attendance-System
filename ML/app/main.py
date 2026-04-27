from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.face_service import face_service
from app.utils import load_image_from_bytes
import uvicorn

app = FastAPI(title="Face Recognition Microservice")

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

        # Recognize faces
        # Threshold: 0.5–0.6 as per requirements
        results = face_service.recognize_faces(image_rgb, threshold=0.6)
        
        return results
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
