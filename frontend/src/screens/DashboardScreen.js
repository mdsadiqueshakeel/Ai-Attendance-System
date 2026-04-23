import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { Camera, FileText, Users, TrendingUp, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

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
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>Professor Smith</Text>
              
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
                  <Text style={styles.mainActionTitle}>Take Attendance</Text>
                  <Text style={styles.mainActionSubtitle}>Capture classroom photo</Text>
                </View>
              </View>
              <ChevronRight size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.grid}>
            <TouchableOpacity 
              style={styles.gridItem}
              onPress={() => navigateTo('Reports')}
            >
              <View style={[styles.gridIconContainer, { backgroundColor: '#EFF6FF' }]}>
                <FileText size={24} color="#2563EB" />
              </View>
              <Text style={styles.gridTitle}>View Reports</Text>
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

            <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
              <View>
                <Text style={styles.activityName}>CS303 - Evening</Text>
                <Text style={styles.activityTime}>Yesterday, 5:00 PM</Text>
              </View>
              <Text style={styles.activityStatus}>29/30 Present</Text>
            </View>
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
    paddingBottom: 60,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
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
    gap: 16,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
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
  gridIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 12,
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
});

export default DashboardScreen;
