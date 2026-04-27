import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Image as ImageIcon, Upload, Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GalleryUploadScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Updated from MediaTypeOptions.Images
        allowsEditing: false, // User requested simple flow
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const handleMarkAttendance = () => {
    if (!image) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    // Navigate to ProcessingScreen with the selected image
    navigation.navigate('Processing', { photoUri: image.uri });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#2563EB']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gallery Upload</Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        {!image ? (
          <TouchableOpacity 
            style={styles.uploadPlaceholder} 
            onPress={pickImage}
          >
            <View style={styles.iconCircle}>
              <ImageIcon size={48} color="#4F46E5" />
            </View>
            <Text style={styles.uploadTitle}>Select Image</Text>
            <Text style={styles.uploadSubtitle}>Choose a group photo from your gallery</Text>
            <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
              <Text style={styles.pickButtonText}>Open Gallery</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewContainer}>
            <View style={styles.imageFrame}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => setImage(null)}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.retakeButton} 
                onPress={pickImage}
              >
                <ImageIcon size={20} color="#4F46E5" />
                <Text style={styles.retakeButtonText}>Change Image</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.markButton} 
                onPress={handleMarkAttendance}
              >
                <Check size={20} color="#fff" />
                <Text style={styles.markButtonText}>Mark Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  uploadPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  pickButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFrame: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    width: '100%',
    gap: 16,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: '#fff',
    gap: 10,
  },
  retakeButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    gap: 10,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  markButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GalleryUploadScreen;
