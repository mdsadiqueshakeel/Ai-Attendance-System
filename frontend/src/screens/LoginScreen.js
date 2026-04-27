import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, LogIn, Users, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    loadRememberedCredentials();
  }, []);

  const loadRememberedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('remembered_email');
      const savedPassword = await AsyncStorage.getItem('remembered_password');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPassword) setPassword(savedPassword);
    } catch (error) {
      console.error('Error loading remembered credentials', error);
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async () => {
  if (!validate()) return;

  setLoading(true);
  try {
    const res = await authService.login(email, password);
    
    // Save credentials if Remember Me is checked
    if (rememberMe) {
      await AsyncStorage.setItem('remembered_email', email);
      await AsyncStorage.setItem('remembered_password', password);
    } else {
      await AsyncStorage.removeItem('remembered_email');
      await AsyncStorage.removeItem('remembered_password');
    }

    const role = String(res?.user?.role || '').toUpperCase();
    navigation.replace(role === 'STUDENT' ? 'StudentApp' : 'AdminApp');
  } catch (error) {
    // Error is handled globally in api.js interceptor
  } finally {
    setLoading(false);
  }
};

  return (
    <LinearGradient
      colors={['#EEF2FF', '#EFF6FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Users size={40} color="#fff" />
              </View>
              <Text style={styles.title}>Smart Attendance</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                  <Mail size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="teacher@school.edu"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                  <Lock size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#94A3B8" />
                    ) : (
                      <Eye size={20} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.rememberMeContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <View style={styles.checkboxInner} />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <LogIn size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Sign In</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.registerLink} 
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerTextBold}>Register</Text></Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              Protected by biometric authentication
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#4F46E5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerTextBold: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 24,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default LoginScreen;
