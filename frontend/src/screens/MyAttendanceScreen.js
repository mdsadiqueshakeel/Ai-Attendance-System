import React, { useEffect, useMemo, useState } from 'react';
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

import meService from '../services/meService';
import DatePickerField from '../components/DatePickerField';
import { getTodayYMD } from '../utils/dateUtils';

const MyAttendanceScreen = ({ navigation }) => {
  const [loadingDate, setLoadingDate] = useState(true);
  const [loadingRange, setLoadingRange] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayYMD());
  const [fromDate, setFromDate] = useState(getTodayYMD());
  const [toDate, setToDate] = useState(getTodayYMD());
  const [attendance, setAttendance] = useState(null);
  const [range, setRange] = useState([]);
  const [errorDate, setErrorDate] = useState('');
  const [errorRange, setErrorRange] = useState('');

  const status = String(attendance?.status || 'ABSENT').toUpperCase();
  const present = status === 'PRESENT';
  const marked = !!attendance?.marked;

  const loadForDate = async (date) => {
    setLoadingDate(true);
    setErrorDate('');
    try {
      const data = await meService.getMyAttendanceByDate(date);
      setAttendance(data);
    } catch (e) {
      setAttendance(null);
      const s = e?.response?.status;
      if (s === 403) setErrorDate('Student access is required.');
      else if (s === 401) setErrorDate('Please login again.');
      else setErrorDate('No attendance found.');
    } finally {
      setLoadingDate(false);
    }
  };

  const loadRange = async (from, to) => {
    setLoadingRange(true);
    setErrorRange('');
    try {
      const data = await meService.getMyAttendanceRange(from, to);
      setRange(Array.isArray(data) ? data : []);
    } catch (e) {
      setRange([]);
      const s = e?.response?.status;
      if (s === 403) setErrorRange('Student access is required.');
      else if (s === 401) setErrorRange('Please login again.');
      else setErrorRange('No attendance found for this range.');
    } finally {
      setLoadingRange(false);
    }
  };

  useEffect(() => {
    loadForDate(selectedDate);
  }, [selectedDate]);

  const rangeSummary = useMemo(() => {
    const presentCount = range.filter((r) => String(r?.status || '').toUpperCase() === 'PRESENT').length;
    return { total: range.length, presentCount, absentCount: Math.max(0, range.length - presentCount) };
  }, [range]);

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
              <Text style={styles.title}>My Attendance</Text>
              <Text style={styles.subtitle}>By date & range</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>By Date</Text>
            <DatePickerField label="Date" value={selectedDate} onChange={setSelectedDate} />
            {!!errorDate && <Text style={styles.errorText}>{errorDate}</Text>}

            {loadingDate ? (
              <ActivityIndicator size="small" color="#4F46E5" style={{ marginTop: 14 }} />
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
                <Text style={styles.muted}>{marked ? 'Marked' : 'Not marked'}</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Range</Text>
            <View style={styles.rangeRow}>
              <View style={{ flex: 1 }}>
                <DatePickerField label="From" value={fromDate} onChange={setFromDate} />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <DatePickerField label="To" value={toDate} onChange={setToDate} />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.rangeButton, loadingRange && styles.rangeButtonDisabled]}
              onPress={() => loadRange(fromDate, toDate)}
              disabled={loadingRange}
              activeOpacity={0.85}
            >
              {loadingRange ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.rangeButtonText}>Load Range</Text>
              )}
            </TouchableOpacity>

            {!!errorRange && <Text style={styles.errorText}>{errorRange}</Text>}

            {range.length === 0 ? (
              <Text style={styles.emptyText}>No attendance found</Text>
            ) : (
              <>
                <Text style={styles.rangeSummary}>
                  Total: {rangeSummary.total} • Present: {rangeSummary.presentCount} • Absent: {rangeSummary.absentCount}
                </Text>
                <View style={styles.list}>
                  {range.map((r) => {
                    const s = String(r?.status || 'ABSENT').toUpperCase();
                    const p = s === 'PRESENT';
                    return (
                      <View key={`${r.studentId}-${r.date}`} style={styles.entryRow}>
                        <Text style={styles.entryDate}>{String(r?.date || '—')}</Text>
                        <Text style={[styles.entryBadge, p ? styles.badgePresent : styles.badgeAbsent]}>
                          {p ? 'Present' : 'Absent'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>
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
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  statusCard: {
    marginTop: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  muted: {
    color: '#6B7280',
    fontWeight: '700',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rangeButton: {
    marginTop: 14,
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rangeButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  rangeButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  errorText: {
    marginTop: 10,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '700',
  },
  rangeSummary: {
    marginTop: 12,
    color: '#374151',
    fontWeight: '700',
  },
  list: {
    marginTop: 10,
    gap: 10,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  entryDate: {
    fontWeight: '800',
    color: '#111827',
  },
  entryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
  },
  badgePresent: {
    backgroundColor: '#10B981',
  },
  badgeAbsent: {
    backgroundColor: '#EF4444',
  },
});

export default MyAttendanceScreen;
