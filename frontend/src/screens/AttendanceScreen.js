import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  Platform
} from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import attendanceService from '../services/attendanceService';
import DatePickerField from '../components/DatePickerField';
import { getTodayYMD } from '../utils/dateUtils';

const AttendanceScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayYMD());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attendance, setAttendance] = useState({}); // { studentId: true/false }
  const [original, setOriginal] = useState({}); // { studentId: { status, marked } }
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  const fetchReport = async (date) => {
    setLoading(true);
    setErrorText('');
    try {
      const data = await attendanceService.getAttendanceReport(date);
      const reportEntries = Array.isArray(data?.entries) ? data.entries : [];
      setEntries(reportEntries);

      const originalMap = {};
      const initialAttendance = {};
      reportEntries.forEach((e) => {
        const status = (e?.status || 'ABSENT').toUpperCase();
        const marked = !!e?.marked;
        originalMap[e.studentId] = { status, marked };
        initialAttendance[e.studentId] = status === 'PRESENT';
      });
      setOriginal(originalMap);
      setAttendance(initialAttendance);
    } catch (e) {
      setEntries([]);
      setAttendance({});
      setOriginal({});
      const status = e?.response?.status;
      if (status === 403) setErrorText('You do not have permission to view this screen.');
      else if (status === 401) setErrorText('Please login again.');
      else setErrorText('Unable to load attendance report.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveAttendance = async () => {
    setSubmitting(true);
    try {
      const studentIds = Object.keys(attendance);
      const toUpdate = studentIds
        .map((studentId) => {
          const newStatus = attendance[studentId] ? 'PRESENT' : 'ABSENT';
          const was = original[studentId];
          const needsSave = !was?.marked || was?.status !== newStatus;
          return needsSave ? { studentId, status: newStatus } : null;
        })
        .filter(Boolean);

      if (toUpdate.length === 0) {
        Alert.alert('No Changes', 'Attendance is already up-to-date.');
        return;
      }

      for (const item of toUpdate) {
        // Backend marks attendance per student (single request).
        // Keeping sequential to avoid overloading backend on slow devices.
        // eslint-disable-next-line no-await-in-loop
        await attendanceService.markAttendance({
          studentId: item.studentId,
          date: selectedDate,
          status: item.status,
        });
      }

      Alert.alert('Success', 'Attendance marked successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#2563EB']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Mark Attendance</Text>
              <Text style={styles.subtitle}>{selectedDate}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 16 }}>
              <DatePickerField label="Select Date" value={selectedDate} onChange={setSelectedDate} />
              {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
            </View>

            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No students available</Text>
              </View>
            ) : (
              <View style={styles.list}>
                {entries.map((entry) => {
                  const isPresent = !!attendance[entry.studentId];
                  const marked = !!entry.marked;
                  return (
                    <View key={entry.studentId} style={styles.attendanceItem}>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{entry.name}</Text>
                        <Text style={styles.studentRoll}>Roll: {entry.rollNumber}</Text>
                        <Text style={styles.markedText}>
                          {marked ? 'Marked' : 'Not marked'}
                        </Text>
                      </View>
                      <View style={styles.actionSection}>
                        <Text
                          style={[
                            styles.statusLabel,
                            isPresent ? styles.presentText : styles.absentText,
                          ]}
                        >
                          {isPresent ? 'Present' : 'Absent'}
                        </Text>
                        <Switch
                          value={isPresent}
                          onValueChange={() => toggleAttendance(entry.studentId)}
                          trackColor={{ false: '#FECACA', true: '#A7F3D0' }}
                          thumbColor={isPresent ? '#10B981' : '#EF4444'}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.saveButton, submitting && styles.buttonDisabled]} 
              onPress={handleSaveAttendance}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Save size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Submit Attendance</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  list: {
    gap: 12,
  },
  errorText: {
    marginTop: 10,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: 12,
    color: '#6B7280',
  },
  markedText: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  presentText: {
    color: '#10B981',
  },
  absentText: {
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  saveButton: {
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
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;
