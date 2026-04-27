import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { Users } from 'lucide-react-native';
import attendanceService from '../services/attendanceService';

const ProcessingScreen = ({ navigation, route }) => {
  const { photoUri } = route.params;
  const [error, setError] = useState(null);

  useEffect(() => {
    processAttendance();
  }, []);

  const processAttendance = async () => {
    try {
      const result = await attendanceService.autoMarkAttendance({
        uri: photoUri
      });
      navigation.replace('Result', { result });
    } catch (err) {
      console.error('Auto attendance error:', err);
      let errorMsg = 'Failed to process attendance. Please try again.';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message === 'ML service unavailable') {
        errorMsg = 'Face recognition service is currently unavailable.';
      }
      
      Alert.alert('Error', errorMsg, [
        { text: 'Go Back', onPress: () => navigation.goBack() }
      ]);
      setError(errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.loaderContainer}>
          <View style={styles.backgroundCircle} />
          <ActivityIndicator size={120} color="#4F46E5" style={styles.spinner} />
          <View style={styles.iconContainer}>
            <Users size={48} color="#4F46E5" />
          </View>
        </View>
        
        <Text style={styles.title}>Processing Faces...</Text>
        <Text style={styles.subtitle}>This may take a few moments</Text>
        
        <View style={styles.dotContainer}>
          <View style={[styles.dot, { opacity: 0.4 }]} />
          <View style={[styles.dot, { opacity: 0.7 }]} />
          <View style={[styles.dot, { opacity: 1.0 }]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loaderContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#EEF2FF',
  },
  spinner: {
    position: 'absolute',
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#EEF2FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
});

export default ProcessingScreen;
