import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, LogOut, User2 } from 'lucide-react-native';

import authService from '../services/authService';
import meService from '../services/meService';
import { getTodayYMD } from '../utils/dateUtils';
import { isSeedEnabled } from '../utils/devFlags';

const StudentDashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [errorText, setErrorText] = useState('');

  const today = useMemo(() => getTodayYMD(), []);
  const seedEnabled = isSeedEnabled();

  const load = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const [m, a] = await Promise.all([
        meService.getMe(),
        meService.getMyAttendanceByDate(today),
      ]);
      setMe(m);
      setTodayAttendance(a);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 403) setErrorText('Student access is required for this screen.');
      else if (status === 401) setErrorText('Please login again.');
      else setErrorText('Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await authService.logout();
          const parent = navigation.getParent?.();
          if (parent?.replace) parent.replace('Login');
          else navigation.navigate('Login');
        },
      },
    ]);
  };

  const status = String(todayAttendance?.status || 'ABSENT').toUpperCase();
  const present = status === 'PRESENT';
  const marked = !!todayAttendance?.marked;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4F46E5', '#2563EB']} style={styles.header}>
          <SafeAreaView>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <LogOut size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Welcome,</Text>
              <Text style={styles.userName}>{me?.name || 'Student'}</Text>
              <Text style={styles.subLine}>{me?.email || ''}</Text>
              {seedEnabled && (
                <View style={styles.seedBadge}>
                  <Text style={styles.seedBadgeText}>Demo Data (Dev Seed)</Text>
                </View>
              )}

              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Today</Text>
                  <Text style={styles.statValue}>{today}</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
                  <Text style={styles.statLabel}>Status</Text>
                  <Text style={styles.statValue}>
                    {present ? 'Present' : 'Absent'}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 30 }} />
          ) : (
            <>
              {!!errorText && (
                <View style={styles.errorCard}>
                  <Text style={styles.errorText}>{errorText}</Text>
                </View>
              )}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Today’s Attendance</Text>
                <Text style={[styles.badge, present ? styles.badgePresent : styles.badgeAbsent]}>
                  {present ? 'Present' : 'Absent'}
                </Text>
                <Text style={styles.muted}>{marked ? 'Marked' : 'Not marked'}</Text>
              </View>

              <View style={styles.grid}>
                <TouchableOpacity
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('MyProfile')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.gridIcon, { backgroundColor: '#EEF2FF' }]}>
                    <User2 size={22} color="#4F46E5" />
                  </View>
                  <Text style={styles.gridTitle}>My Profile</Text>
                  <Text style={styles.gridSub}>View details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('MyAttendance')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.gridIcon, { backgroundColor: '#ECFDF5' }]}>
                    <Calendar size={22} color="#10B981" />
                  </View>
                  <Text style={styles.gridTitle}>My Attendance</Text>
                  <Text style={styles.gridSub}>By date & range</Text>
                </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 50,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subLine: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginBottom: 18,
  },
  seedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  seedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    paddingHorizontal: 24,
    marginTop: -20,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    marginBottom: 8,
  },
  badgePresent: {
    backgroundColor: '#10B981',
  },
  badgeAbsent: {
    backgroundColor: '#EF4444',
  },
  muted: {
    color: '#6B7280',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
  },
  gridIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  gridSub: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default StudentDashboardScreen;
