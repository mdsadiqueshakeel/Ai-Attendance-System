import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, ImageIcon, Mail, User2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import meService from '../services/meService';
import AuthImage from '../components/AuthImage';

const MyProfileScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [me, setMe] = useState(null);
  const [student, setStudent] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [tempImage, setTempImage] = useState(null);

  // Handle return from custom camera
  useEffect(() => {
    if (route.params?.photoUri) {
      setTempImage(route.params.photoUri);
      // Clear the param so it doesn't trigger again on re-focus
      navigation.setParams({ photoUri: undefined });
    }
  }, [route.params?.photoUri]);

  const loadData = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const [m, s] = await Promise.all([
        meService.getMe(),
        meService.getMyStudent(),
      ]);
      setMe(m);
      setStudent(s);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 403) setErrorText('Student access is required for this screen.');
      else if (status === 401) setErrorText('Please login again.');
      else setErrorText('Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePickImage = async (mode = 'gallery') => {
    try {
      if (mode === 'custom-camera') {
        navigation.navigate('Camera', { returnScreen: 'MyProfile' });
        return;
      }

      let result;
      if (mode === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera access is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Gallery access is required to pick photos.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const uploadImage = async () => {
    if (!tempImage) return;
    setUploading(true);
    try {
      await meService.uploadMyImage(tempImage);
      Alert.alert('Success', 'Profile image and face registered successfully!');
      setTempImage(null);
      loadData(); // Refresh to show new image
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message || 'Upload failed';
      Alert.alert('Upload Failed', msg);
    } finally {
      setUploading(false);
    }
  };

  if (tempImage) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#4F46E5', '#2563EB']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Preview Photo</Text>
              <Text style={styles.subtitle}>Confirm your profile image</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
        
        <View style={styles.previewBody}>
          <View style={styles.previewContainer}>
            <Image source={{ uri: tempImage }} style={styles.previewImage} />
            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.uploadText}>Uploading & Registering Face...</Text>
              </View>
            )}
          </View>
          
          <View style={styles.previewActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.retakeButton]} 
              onPress={() => setTempImage(null)}
              disabled={uploading}
            >
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]} 
              onPress={uploadImage}
              disabled={uploading}
            >
              <Text style={styles.confirmText}>Confirm & Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4F46E5', '#2563EB']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={20} color="#fff" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>My Profile</Text>
              <Text style={styles.subtitle}>Student details</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
          ) : (
            <>
              {!!errorText && (
                <View style={styles.errorCard}>
                  <Text style={styles.errorText}>{errorText}</Text>
                </View>
              )}

              <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    {student?.imageUrl ? (
                      <AuthImage uri={student.imageUrl} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <User2 size={40} color="#94A3B8" />
                      </View>
                    )}
                  </View>
                  {uploading && (
                    <View style={styles.uploadOverlay}>
                      <ActivityIndicator color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={styles.name}>{me?.name || 'Student'}</Text>
                <Text style={styles.roll}>Roll: {student?.rollNumber || '—'}</Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => handlePickImage('custom-camera')}
                    disabled={uploading}
                  >
                    <Camera size={18} color="#4F46E5" />
                    <Text style={styles.actionButtonText}>Smart Cam</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#F3F4F6' }]} 
                    onPress={() => handlePickImage('camera')}
                    disabled={uploading}
                  >
                    <Camera size={18} color="#4F46E5" />
                    <Text style={styles.actionButtonText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#EEF2FF' }]} 
                    onPress={() => handlePickImage('gallery')}
                    disabled={uploading}
                  >
                    <ImageIcon size={18} color="#4F46E5" />
                    <Text style={styles.actionButtonText}>Gallery</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.hint}>Upload a clear face photo for recognition</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <User2 size={18} color="#4F46E5" />
                  <Text style={styles.rowText}>{me?.role || 'STUDENT'}</Text>
                </View>
                <View style={styles.row}>
                  <Mail size={18} color="#4F46E5" />
                  <Text style={styles.rowText}>{me?.email || '—'}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  body: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
  },
  roll: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 12,
  },
  hint: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  rowText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
  previewBody: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  retakeText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  uploadText: {
    color: '#fff',
    marginTop: 12,
    fontWeight: '600',
  },
});

export default MyProfileScreen;

