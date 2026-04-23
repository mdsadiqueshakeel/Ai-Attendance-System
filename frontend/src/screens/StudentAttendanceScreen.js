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
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import attendanceService from '../services/attendanceService';
import DatePickerField from '../components/DatePickerField';
import AuthImage from '../components/AuthImage';
import { getTodayYMD } from '../utils/dateUtils';

const StudentAttendanceScreen = ({ navigation, route }) => {
  const { studentId, name, rollNumber, imageUrl } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(getTodayYMD());
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [errorText, setErrorText] = useState('');

  const fetchAttendance = async (date) => {
    setLoading(true);
    setErrorText('');
    try {
      const data = await attendanceService.getStudentAttendance(studentId, date);
      setAttendance(data);
    } catch (e) {
      setAttendance(null);
      const status = e?.response?.status;
      if (status === 403) setErrorText('You do not have permission to view this student.');
      else if (status === 401) setErrorText('Please login again.');
      else setErrorText('Unable to load attendance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    fetchAttendance(selectedDate);
  }, [selectedDate, studentId]);

  const status = String(attendance?.status || 'ABSENT').toUpperCase();
  const present = status === 'PRESENT';
  const marked = !!attendance?.marked;

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
              <Text style={styles.title}>Student Attendance</Text>
              <Text style={styles.subtitle}>View by date</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              {imageUrl ? <AuthImage uri={imageUrl} style={styles.avatar} /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{name || 'Student'}</Text>
              <Text style={styles.roll}>Roll: {rollNumber || '—'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <DatePickerField label="Date" value={selectedDate} onChange={setSelectedDate} />
            {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 30 }} />
          ) : (
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                {present ? (
                  <CheckCircle2 size={22} color="#059669" />
                ) : (
                  <XCircle size={22} color="#DC2626" />
                )}
                <Text style={styles.statusTitle}>{present ? 'Present' : 'Absent'}</Text>
              </View>
              <Text style={styles.statusSub}>{marked ? 'Marked' : 'Not marked'}</Text>
            </View>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EEF2FF',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  roll: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  errorText: {
    marginTop: 10,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  statusSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default StudentAttendanceScreen;
