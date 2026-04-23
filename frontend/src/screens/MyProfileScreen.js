import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, Mail, User2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import meService from '../services/meService';
import AuthImage from '../components/AuthImage';

const MyProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [student, setStudent] = useState(null);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

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
                <View style={styles.avatar}>
                  {student?.imageUrl ? <AuthImage uri={student.imageUrl} style={styles.avatar} /> : null}
                </View>
                <Text style={styles.name}>{me?.name || 'Student'}</Text>
                <Text style={styles.roll}>Roll: {student?.rollNumber || '—'}</Text>
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#EEF2FF',
    marginBottom: 14,
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
});

export default MyProfileScreen;

