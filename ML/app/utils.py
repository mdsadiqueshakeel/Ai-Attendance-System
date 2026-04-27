import cv2
import numpy as np

def load_image_from_bytes(image_bytes: bytes):
    """
    Converts image bytes to a NumPy array for OpenCV and face_recognition.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        return None
    # Convert BGR to RGB for face_recognition
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
