import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeft, CheckCircle2, Users, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import attendanceService from '../services/attendanceService';
import DatePickerField from '../components/DatePickerField';
import { getTodayYMD } from '../utils/dateUtils';

const ReportScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayYMD());
  const [reportData, setReportData] = useState(null);
  const [errorText, setErrorText] = useState('');

  const entries = useMemo(
    () => (Array.isArray(reportData?.entries) ? reportData.entries : []),
    [reportData]
  );

  const markedCount = useMemo(
    () => entries.filter((e) => !!e?.marked).length,
    [entries]
  );

  const notMarkedCount = useMemo(() => {
    const total = reportData?.totalStudents || entries.length || 0;
    return Math.max(0, total - markedCount);
  }, [reportData, entries, markedCount]);

  const fetchReport = async (date) => {
    setLoading(true);
    setErrorText('');
    try {
      const data = await attendanceService.getAttendanceReport(date);
      setReportData(data);
    } catch (e) {
      setReportData(null);
      const status = e?.response?.status;
      if (status === 403) setErrorText('You do not have permission to view reports.');
      else if (status === 401) setErrorText('Please login again.');
      else setErrorText('Unable to load report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await attendanceService.getAttendanceReport(selectedDate);
      setReportData(data);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient colors={['#4F46E5', '#2563EB']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft size={20} color="#fff" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Reports</Text>
              <Text style={styles.subtitle}>Daily class report</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
          ) : (
            <>
              <View style={styles.filterCard}>
                <DatePickerField label="Report Date" value={selectedDate} onChange={setSelectedDate} />
                {!!errorText && <Text style={styles.errorText}>{errorText}</Text>}
              </View>

              <View style={styles.grid}>
                <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.statCard}>
                  <Users size={28} color="rgba(255, 255, 255, 0.95)" style={styles.statIcon} />
                  <Text style={styles.statValue}>{reportData?.totalStudents || 0}</Text>
                  <Text style={styles.statLabel}>Total Students</Text>
                </LinearGradient>

                <LinearGradient colors={['#10B981', '#059669']} style={styles.statCard}>
                  <CheckCircle2 size={28} color="rgba(255, 255, 255, 0.95)" style={styles.statIcon} />
                  <Text style={styles.statValue}>{reportData?.presentCount || 0}</Text>
                  <Text style={styles.statLabel}>Present</Text>
                </LinearGradient>
              </View>

              <View style={styles.grid}>
                <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.statCard}>
                  <XCircle size={28} color="rgba(255, 255, 255, 0.95)" style={styles.statIcon} />
                  <Text style={styles.statValue}>{reportData?.absentCount || 0}</Text>
                  <Text style={styles.statLabel}>Absent</Text>
                </LinearGradient>

                <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.statCard}>
                  <Users size={28} color="rgba(255, 255, 255, 0.95)" style={styles.statIcon} />
                  <Text style={styles.statValue}>{notMarkedCount}</Text>
                  <Text style={styles.statLabel}>Not Marked</Text>
                </LinearGradient>
              </View>

              <View style={styles.listCard}>
                <Text style={styles.sectionTitle}>Entries</Text>

                {entries.length === 0 ? (
                  <Text style={styles.emptyText}>No attendance found</Text>
                ) : (
                  <View style={styles.list}>
                    {entries.map((e) => {
                      const status = String(e?.status || 'ABSENT').toUpperCase();
                      const present = status === 'PRESENT';
                      return (
                        <View key={e.studentId} style={styles.entryRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.entryName}>{e.name}</Text>
                            <Text style={styles.entrySub}>Roll: {e.rollNumber}</Text>
                          </View>
                          <View style={styles.entryRight}>
                            <Text
                              style={[
                                styles.badge,
                                present ? styles.badgePresent : styles.badgeAbsent,
                              ]}
                            >
                              {present ? 'Present' : 'Absent'}
                            </Text>
                            <Text style={styles.markedBadge}>
                              {e.marked ? 'Marked' : 'Not marked'}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
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
  filterCard: {
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
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  list: {
    gap: 10,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  entryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  entrySub: {
    fontSize: 12,
    color: '#6B7280',
  },
  entryRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
  },
  badgePresent: {
    backgroundColor: '#10B981',
  },
  badgeAbsent: {
    backgroundColor: '#EF4444',
  },
  markedBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default ReportScreen;
