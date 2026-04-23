import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });

  const { accessToken, user } = response.data;

  if (!accessToken) {
    throw new Error("Token missing in response");
  }

  await AsyncStorage.setItem('jwt_token', accessToken);
  await AsyncStorage.setItem('user_role', user?.role || '');
  await AsyncStorage.setItem('user_name', user?.name || '');
  await AsyncStorage.setItem('user_email', user?.email || '');

  return response.data;
};

const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  await AsyncStorage.removeItem('jwt_token');
  await AsyncStorage.removeItem('user_role');
  await AsyncStorage.removeItem('user_name');
  await AsyncStorage.removeItem('user_email');
};

const getRole = async () => {
  return await AsyncStorage.getItem('user_role');
};

const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('jwt_token');
  return !!token;
};

export default { login, register, logout, getRole, isAuthenticated };
