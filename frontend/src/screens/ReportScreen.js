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
import { TrendingUp, Calendar, Users, BarChart3, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ReportScreen = ({ navigation }) => {
  const weeklyData = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 95 },
    { day: 'Thu', attendance: 87 },
    { day: 'Fri', attendance: 90 },
  ];

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
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <ArrowLeft size={20} color="#fff" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              <Text style={styles.title}>Reports & Analytics</Text>
              <Text style={styles.subtitle}>Track attendance trends</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.grid}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.statCard}
            >
              <Users size={32} color="rgba(255, 255, 255, 0.9)" style={styles.statIcon} />
              <Text style={styles.statValue}>142</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statCard}
            >
              <TrendingUp size={32} color="rgba(255, 255, 255, 0.9)" style={styles.statIcon} />
              <Text style={styles.statValue}>87%</Text>
              <Text style={styles.statLabel}>Avg. Attendance</Text>
            </LinearGradient>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weekly Overview</Text>
              <BarChart3 size={20} color="#4F46E5" />
            </View>
            
            <View style={styles.chartContainer}>
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>100%</Text>
                <Text style={styles.yAxisLabel}>75%</Text>
                <Text style={styles.yAxisLabel}>50%</Text>
                <Text style={styles.yAxisLabel}>25%</Text>
                <Text style={styles.yAxisLabel}>0%</Text>
              </View>
              <View style={styles.barsContainer}>
                {weeklyData.map((data, index) => (
                  <View key={index} style={styles.barWrapper}>
                    <View style={styles.barBackground}>
                      <View 
                        style={[
                          styles.barFill, 
                          { height: `${data.attendance}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.xAxisLabel}>{data.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.recentSessions}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <Calendar size={20} color="#4F46E5" />
            </View>

            <View style={styles.sessionItem}>
              <View>
                <Text style={styles.sessionName}>CS101 - Morning Batch</Text>
                <Text style={styles.sessionDate}>April 23, 2026 • 9:00 AM</Text>
              </View>
              <View style={styles.sessionStats}>
                <Text style={styles.sessionCount}>45/48</Text>
                <Text style={styles.sessionPercent}>94%</Text>
              </View>
            </View>

            <View style={styles.sessionItem}>
              <View>
                <Text style={styles.sessionName}>CS202 - Afternoon</Text>
                <Text style={styles.sessionDate}>April 23, 2026 • 2:00 PM</Text>
              </View>
              <View style={styles.sessionStats}>
                <Text style={styles.sessionCount}>38/42</Text>
                <Text style={styles.sessionPercent}>90%</Text>
              </View>
            </View>

            <View style={[styles.sessionItem, { borderBottomWidth: 0 }]}>
              <View>
                <Text style={styles.sessionName}>CS303 - Evening Lab</Text>
                <Text style={styles.sessionDate}>April 22, 2026 • 5:00 PM</Text>
              </View>
              <View style={styles.sessionStats}>
                <Text style={styles.sessionCount}>29/30</Text>
                <Text style={styles.sessionPercent}>97%</Text>
              </View>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💡 Insight</Text>
            <Text style={styles.insightText}>
              Attendance peaks on Wednesdays (95%) and drops on Thursdays (87%). Consider adjusting scheduling for better engagement.
            </Text>
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
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    marginBottom: 12,
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
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: 'center',
    width: '15%',
  },
  barBackground: {
    width: '100%',
    height: 160,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 8,
  },
  recentSessions: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sessionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  sessionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  sessionPercent: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});

export default ReportScreen;
