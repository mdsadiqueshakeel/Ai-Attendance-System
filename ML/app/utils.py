import cv2
import numpy as np

def load_image_from_bytes(image_bytes: bytes): 
    import numpy as np 
    import cv2 
    from PIL import Image 
    import io 

    # Read image via PIL (better for EXIF handling) 
    try: 
        pil_image = Image.open(io.BytesIO(image_bytes)) 

        # Fix EXIF orientation 
        try: 
            from PIL import ExifTags 
            for orientation in ExifTags.TAGS.keys(): 
                if ExifTags.TAGS[orientation] == 'Orientation': 
                    break 
            exif = pil_image._getexif() 

            if exif is not None: 
                orientation_value = exif.get(orientation) 
                if orientation_value == 3: 
                    pil_image = pil_image.rotate(180, expand=True) 
                elif orientation_value == 6: 
                    pil_image = pil_image.rotate(270, expand=True) 
                elif orientation_value == 8: 
                    pil_image = pil_image.rotate(90, expand=True) 
        except: 
            pass 

        # Convert to OpenCV format 
        image = np.array(pil_image) 

        # Convert RGB → BGR → RGB clean pipeline 
        if len(image.shape) == 3: 
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) 
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 

        # OPTIONAL: Resize for consistency 
        max_width = 800 
        if image.shape[1] > max_width: 
            scale = max_width / image.shape[1] 
            image = cv2.resize(image, (0, 0), fx=scale, fy=scale) 

        return image 

    except Exception: 
        return None 
