import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Check, AlertCircle, ArrowLeft, Download } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ResultScreen = ({ navigation }) => {
  const detectedStudents = [
    { id: 1, name: 'Emma Johnson', roll: 'CS001', confidence: 98, image: '👩' },
    { id: 2, name: 'Michael Chen', roll: 'CS002', confidence: 95, image: '👨' },
    { id: 3, name: 'Sarah Williams', roll: 'CS003', confidence: 97, image: '👩' },
    { id: 4, name: 'James Brown', roll: 'CS004', confidence: 92, image: '👨' },
    { id: 5, name: 'Olivia Davis', roll: 'CS005', confidence: 96, image: '👩' },
    { id: 6, name: 'Daniel Garcia', roll: 'CS006', confidence: 94, image: '👨' },
  ];

  const unknownFaces = [
    { id: 1, image: '❓' },
  ];

  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#059669', '#10B981']}
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
              
              <Text style={styles.title}>Attendance Recorded</Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Detected</Text>
                  <Text style={styles.statValue}>7 Faces</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Present</Text>
                  <Text style={[styles.statValue, { color: '#D1FAE5' }]}>6 Students</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Identified Students</Text>
              <Text style={styles.sectionBadge}>{detectedStudents.length} Present</Text>
            </View>
            
            {detectedStudents.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{student.image}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll: {student.roll}</Text>
                </View>
                <View style={styles.studentStatus}>
                  <View style={styles.statusRow}>
                    <Check size={14} color="#059669" />
                    <Text style={styles.statusText}>Present</Text>
                  </View>
                  <Text style={styles.confidenceText}>{student.confidence}% match</Text>
                </View>
              </View>
            ))}
          </View>

          {unknownFaces.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Unknown Faces</Text>
                <Text style={[styles.sectionBadge, { color: '#D97706' }]}>{unknownFaces.length} Unidentified</Text>
              </View>
              
              {unknownFaces.map((face) => (
                <View key={face.id} style={styles.unknownCard}>
                  <View style={styles.unknownAvatarContainer}>
                    <Text style={styles.avatarText}>{face.image}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>Unidentified Person</Text>
                    <Text style={[styles.studentRoll, { color: '#B45309' }]}>Not in student database</Text>
                  </View>
                  <AlertCircle size={24} color="#D97706" />
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={styles.exportButton}
            activeOpacity={0.8}
          >
            <Download size={20} color="#fff" />
            <Text style={styles.exportButtonText}>Export Report</Text>
          </TouchableOpacity>
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
    fontSize: 24,
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
    color: '#059669',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  studentInfo: {
    flex: 1,
    marginLeft: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: 13,
    color: '#6B7280',
  },
  studentStatus: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  confidenceText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  unknownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  unknownAvatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ResultScreen;
