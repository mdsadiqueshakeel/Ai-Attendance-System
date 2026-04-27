import os
import json
import numpy as np
import face_recognition
import cv2

class FaceService:
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        # Try to find the known faces directory
        self.known_faces_dir = os.path.join(self.data_dir, "known_faces")
        if not os.path.exists(self.known_faces_dir):
            # Fallback to 'known faces' with space if 'known_faces' doesn't exist
            alt_dir = os.path.join(self.data_dir, "known faces")
            if os.path.exists(alt_dir):
                self.known_faces_dir = alt_dir
        
        self.encodings_path = os.path.join(self.data_dir, "encodings.npy")
        self.mapping_path = os.path.join(self.data_dir, "mapping.json")
        
        self.known_encodings = []
        self.mapping = {}
        
        # Load existing encodings if they exist
        self.load_from_disk()

    def load_encodings(self):
        """
        Traverses the known_faces directory, encodes faces, and saves to disk.
        """
        new_encodings = []
        new_mapping = {}
        index = 0

        if not os.path.exists(self.known_faces_dir):
            print(f"Directory {self.known_faces_dir} not found.")
            return False

        for user_id in os.listdir(self.known_faces_dir):
            user_path = os.path.join(self.known_faces_dir, user_id)
            if not os.path.isdir(user_path):
                continue

            for image_name in os.listdir(user_path):
                image_path = os.path.join(user_path, image_name)
                try:
                    # Load image
                    image = face_recognition.load_image_file(image_path)
                    
                    # Detect faces and get encodings
                    # Using 'hog' for CPU performance, 'cnn' is better but slower
                    encodings = face_recognition.face_encodings(image)
                    
                    if len(encodings) > 0:
                        # Take the first face detected in the image
                        new_encodings.append(encodings[0])
                        new_mapping[str(index)] = user_id
                        index += 1
                        print(f"Encoded {image_name} for user {user_id}")
                    else:
                        print(f"No face detected in {image_path}")
                except Exception as e:
                    print(f"Error processing {image_path}: {e}")

        if new_encodings:
            self.known_encodings = new_encodings
            self.mapping = new_mapping
            
            # Save to disk
            np.save(self.encodings_path, np.array(self.known_encodings))
            with open(self.mapping_path, 'w') as f:
                json.dump(self.mapping, f, indent=4)
            return True
        
        return False

    def load_from_disk(self):
        """
        Loads encodings and mapping from disk into memory.
        """
        if os.path.exists(self.encodings_path) and os.path.exists(self.mapping_path):
            try:
                self.known_encodings = np.load(self.encodings_path).tolist()
                with open(self.mapping_path, 'r') as f:
                    self.mapping = json.load(f)
                print("Loaded encodings and mapping from disk.")
                return True
            except Exception as e:
                print(f"Error loading from disk: {e}")
        return False

    def recognize_faces(self, image_rgb, threshold=0.6):
        """
        Recognizes faces in the given RGB image with strict filtering and deduplication.
        Returns a list of {"user_id": "...", "confidence": ...} sorted by confidence.
        """
        print(f"DEBUG: Recognizing against {len(self.known_encodings)} encodings")
        print(f"DEBUG: Known User IDs: {list(set(self.mapping.values()))}")
        
        if not self.known_encodings:
            return []

        # Detect all faces in the input image
        face_locations = face_recognition.face_locations(image_rgb)
        face_encodings = face_recognition.face_encodings(image_rgb, face_locations)

        # Dictionary to store unique user results and their best confidence
        # user_id -> max_confidence
        unique_matches = {}

        for face_encoding in face_encodings:
            # Calculate Euclidean distances to all known encodings
            distances = face_recognition.face_distance(self.known_encodings, face_encoding)
            
            if len(distances) == 0:
                continue

            # Find the best match (minimum distance) for THIS specific face
            best_match_index = np.argmin(distances)
            min_distance = distances[best_match_index]
            
            # Convert distance to confidence (0-1)
            confidence = float(1.0 - min_distance)

            # REQUIREMENT 1: CONFIDENCE FILTER (MANDATORY >= 0.6)
            if confidence >= threshold:
                user_id = self.mapping.get(str(best_match_index), "unknown")
                
                # REQUIREMENT 4: REMOVE DUPLICATES (One entry per user)
                # If user already found in this image, keep the one with higher confidence
                if user_id not in unique_matches or confidence > unique_matches[user_id]:
                    unique_matches[user_id] = round(confidence, 2)

        # Convert dictionary to strict output format list
        results = [
            {"user_id": uid, "confidence": conf} 
            for uid, conf in unique_matches.items()
        ]

        # REQUIREMENT 5: SORT OUTPUT (Confidence DESC)
        results.sort(key=lambda x: x["confidence"], reverse=True)

        return results

    def register_face(self, user_id, image_rgb):
        """
        Registers a single face for a user.
        Validates that exactly one face is present.
        """
        # Detect all faces in the input image
        face_locations = face_recognition.face_locations(image_rgb)
        
        if len(face_locations) == 0:
            return False, "No face detected in the image."
        if len(face_locations) > 1:
            return False, "Multiple faces detected. Please provide an image with only one face."

        # Get encoding for the single face
        encodings = face_recognition.face_encodings(image_rgb, face_locations)
        if not encodings:
            return False, "Could not extract face encoding."

        new_encoding = encodings[0]
        
        # Add to memory
        index = len(self.known_encodings)
        self.known_encodings.append(new_encoding)
        self.mapping[str(index)] = user_id

        # Save to disk
        try:
            np.save(self.encodings_path, np.array(self.known_encodings))
            with open(self.mapping_path, 'w') as f:
                json.dump(self.mapping, f, indent=4)
            return True, "Face registered successfully."
        except Exception as e:
            return False, f"Error saving registration: {str(e)}"

    def delete_user_faces(self, user_id):
        """
        Removes all encodings and mapping entries for a specific user_id.
        """
        if not self.known_encodings:
            return False, "No encodings loaded."

        # Find indices to keep
        indices_to_keep = [int(idx) for idx, uid in self.mapping.items() if uid != user_id]
        
        if len(indices_to_keep) == len(self.known_encodings):
            return False, f"No entries found for user_id: {user_id}"

        # Update encodings and mapping
        new_encodings = [self.known_encodings[i] for i in indices_to_keep]
        new_mapping = {str(i): user_id for i, user_id in enumerate([self.mapping[str(idx)] for idx in indices_to_keep])}

        self.known_encodings = new_encodings
        self.mapping = new_mapping

        # Save to disk
        try:
            np.save(self.encodings_path, np.array(self.known_encodings))
            with open(self.mapping_path, 'w') as f:
                json.dump(self.mapping, f, indent=4)
            return True, f"All faces for user {user_id} deleted successfully."
        except Exception as e:
            return False, f"Error saving after deletion: {str(e)}"

# Singleton instance
face_service = FaceService()
