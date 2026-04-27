import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// 1. IMPORTANT: Replace this with your computer's actual local IP address (e.g., 192.168.1.10)
// 2. Ensure your backend server is running and listening on 0.0.0.0 (not just localhost)
// 3. Ensure your phone and computer are on the same Wi-Fi network
export const BASE_URL = 'http://10.234.205.73:8080'; 

console.log('Connecting to Backend at:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const skipAlert = !!error?.config?._skipErrorAlert;

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Something went wrong';

      switch (status) {
        case 401:
          // Unauthorized: Auto Logout
          await AsyncStorage.removeItem('jwt_token');
          await AsyncStorage.removeItem('user_role');
          await AsyncStorage.removeItem('user_name');
          await AsyncStorage.removeItem('user_email');
          if (!skipAlert) {
            Alert.alert('Session Expired', 'Please login again');
          }
          // Note: In a real app, you might want to use a navigation ref to navigate to Login
          break;
        case 400:
          if (!skipAlert) {
            Alert.alert('Validation Error', message);
          }
          break;
        case 403:
          if (!skipAlert) {
            Alert.alert('Forbidden', 'You do not have permission to perform this action');
          }
          break;
        case 404:
          if (!skipAlert) {
            Alert.alert('Not Found', 'No data found for your request.');
          }
          break;
        case 500:
          if (!skipAlert) {
            Alert.alert('Server Error', 'Internal server error. Please try again later.');
          }
          break;
        default:
          if (!skipAlert) {
            Alert.alert('Error', message);
          }
      }
    } else {
      if (!skipAlert) {
        Alert.alert('Network Error', 'Please check your internet connection');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
