import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { Camera, FileText, Users, TrendingUp, ChevronRight, LogOut, CheckSquare } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import authService from '../services/authService';
import { isSeedEnabled } from '../utils/devFlags';

const DashboardScreen = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const seedEnabled = isSeedEnabled();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    const role = await authService.getRole();
    setIsAdmin(role === 'ADMIN');
  };

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
        }
      }
    ]);
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4F46E5', '#2563EB']}
          style={styles.header}
        >
          <SafeAreaView>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <LogOut size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>Professor Smith</Text>
              {seedEnabled && (
                <View style={styles.seedBadge}>
                  <Text style={styles.seedBadgeText}>Demo Data (Dev Seed)</Text>
                </View>
              )}
              
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Today's Classes</Text>
                  <Text style={styles.statValue}>3 Sections</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
                  <Text style={styles.statLabel}>Avg. Attendance</Text>
                  <Text style={styles.statValue}>87%</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <TouchableOpacity 
            style={styles.mainAction}
            onPress={() => navigateTo('Camera')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#4F46E5', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainActionGradient}
            >
              <View style={styles.mainActionContent}>
                <View style={styles.cameraIconContainer}>
                  <Camera size={32} color="#fff" />
                </View>
                <View style={styles.mainActionTextContainer}>
                  <Text style={styles.mainActionTitle}>Auto Attendance</Text>
                  <Text style={styles.mainActionSubtitle}>Face recognition capture</Text>
                </View>
              </View>
              <ChevronRight size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.grid}>
            {isAdmin && (
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => navigateTo('Attendance')}
              >
                <View style={[styles.gridIconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <CheckSquare size={24} color="#10B981" />
                </View>
                <Text style={styles.gridTitle}>Manual</Text>
                <Text style={styles.gridSubtitle}>Mark attendance</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.gridItem}
              onPress={() => navigateTo('Reports')}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <FileText size={24} color="#2563EB" />
              </View>
              <Text style={styles.gridTitle}>Reports</Text>
              <Text style={styles.gridSubtitle}>Analytics & stats</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gridItem}
              onPress={() => navigateTo('Students')}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: '#EEF2FF' }]}>
                <Users size={24} color="#4F46E5" />
              </View>
              <Text style={styles.gridTitle}>Students</Text>
              <Text style={styles.gridSubtitle}>Manage roster</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentActivity}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TrendingUp size={20} color="#10B981" />
            </View>

            <View style={styles.activityItem}>
              <View>
                <Text style={styles.activityName}>CS101 - Morning</Text>
                <Text style={styles.activityTime}>Today, 9:00 AM</Text>
              </View>
              <Text style={styles.activityStatus}>45/48 Present</Text>
            </View>

            <View style={styles.activityItem}>
              <View>
                <Text style={styles.activityName}>CS202 - Afternoon</Text>
                <Text style={styles.activityTime}>Today, 2:00 PM</Text>
              </View>
              <Text style={styles.activityStatus}>38/42 Present</Text>
            </View>

            {__DEV__ && (
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => navigateTo('SystemStatus')}
                activeOpacity={0.85}
              >
                <Text style={styles.devButtonText}>System Status (Dev)</Text>
              </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 60,
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
    marginBottom: 24,
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
    padding: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    paddingHorizontal: 24,
    marginTop: -30,
  },
  mainAction: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  mainActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  mainActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
    marginRight: 16,
  },
  mainActionTextContainer: {
    justifyContent: 'center',
  },
  mainActionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  mainActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridIconContainer: {
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
  gridSubtitle: {
    fontSize: 10,
    color: '#6B7280',
  },
  recentActivity: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  devButton: {
    marginTop: 14,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  devButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
});

export default DashboardScreen;
