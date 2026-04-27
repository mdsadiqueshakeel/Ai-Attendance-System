import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X, ArrowLeft, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuthImage from '../components/AuthImage';

const ResultScreen = ({ navigation, route }) => {
  const { result } = route.params || {};
  
  // Default values if result is missing
  const date = result?.date || new Date().toISOString().split('T')[0];
  const totalStudents = result?.totalStudents || 0;
  const presentCount = result?.present || 0;
  const absentCount = result?.absent || 0;
  const details = result?.details || [];

  const presentStudents = details.filter(d => d.status === 'PRESENT');
  const absentStudents = details.filter(d => d.status === 'ABSENT');

  const handleBack = () => {
    navigation.navigate('Dashboard');
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
              <TouchableOpacity 
                onPress={handleBack}
                style={styles.backButton}
              >
                <ArrowLeft size={20} color="#fff" />
                <Text style={styles.backButtonText}>Back to Dashboard</Text>
              </TouchableOpacity>
              
              <Text style={styles.title}>Attendance Summary</Text>
              <Text style={styles.dateText}>{date}</Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total</Text>
                  <Text style={styles.statValue}>{totalStudents}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Present</Text>
                  <Text style={[styles.statValue, { color: '#D1FAE5' }]}>{presentCount}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Absent</Text>
                  <Text style={[styles.statValue, { color: '#FEE2E2' }]}>{absentCount}</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          {presentStudents.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Present Students</Text>
                <Text style={styles.sectionBadge}>{presentStudents.length}</Text>
              </View>
              
              {presentStudents.map((student, index) => (
                <View key={student.studentId || index} style={styles.studentCard}>
                  <View style={[styles.avatarContainer, { backgroundColor: '#D1FAE5' }]}>
                    {student.imageUrl ? (
                      <AuthImage uri={student.imageUrl} style={styles.avatarImage} />
                    ) : (
                      <User size={16} color="#059669" />
                    )}
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentRoll}>Roll: {student.rollNumber}</Text>
                  </View>
                  <View style={styles.studentStatus}>
                    <View style={styles.statusRow}>
                      <Check size={14} color="#059669" />
                      <Text style={[styles.statusText, { color: '#059669' }]}>Present</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {absentStudents.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Absent Students</Text>
                <Text style={[styles.sectionBadge, { color: '#DC2626', backgroundColor: '#FEE2E2' }]}>{absentStudents.length}</Text>
              </View>
              
              {absentStudents.map((student, index) => (
                <View key={student.studentId || index} style={styles.studentCard}>
                  <View style={[styles.avatarContainer, { backgroundColor: '#FEE2E2' }]}>
                    {student.imageUrl ? (
                      <AuthImage uri={student.imageUrl} style={styles.avatarImage} />
                    ) : (
                      <User size={16} color="#DC2626" />
                    )}
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentRoll}>Roll: {student.rollNumber}</Text>
                  </View>
                  <View style={styles.studentStatus}>
                    <View style={styles.statusRow}>
                      <X size={14} color="#DC2626" />
                      <Text style={[styles.statusText, { color: '#DC2626' }]}>Absent</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {details.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No students found.</Text>
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
    marginBottom: 24,
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
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
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
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: 12,
    color: '#6B7280',
  },
  studentStatus: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
  }
});

export default ResultScreen;
