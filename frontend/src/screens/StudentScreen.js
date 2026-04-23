import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  TextInput,
  StatusBar
} from 'react-native';
import { Plus, Search, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StudentScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const students = [
    { id: 1, name: 'Emma Johnson', roll: 'CS001', image: '👩', attendance: 95 },
    { id: 2, name: 'Michael Chen', roll: 'CS002', image: '👨', attendance: 92 },
    { id: 3, name: 'Sarah Williams', roll: 'CS003', image: '👩', attendance: 98 },
    { id: 4, name: 'James Brown', roll: 'CS004', image: '👨', attendance: 88 },
    { id: 5, name: 'Olivia Davis', roll: 'CS005', image: '👩', attendance: 94 },
    { id: 6, name: 'Daniel Garcia', roll: 'CS006', image: '👨', attendance: 90 },
    { id: 7, name: 'Sophia Martinez', roll: 'CS007', image: '👩', attendance: 96 },
    { id: 8, name: 'Liam Anderson', roll: 'CS008', image: '👨', attendance: 87 },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              
              <Text style={styles.title}>Students</Text>
              
              <View style={styles.searchBar}>
                <Search size={20} color="rgba(255, 255, 255, 0.6)" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or roll number"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>
            All Students ({filteredStudents.length})
          </Text>

          <View style={styles.list}>
            {filteredStudents.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{student.image}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentRoll}>Roll: {student.roll}</Text>
                </View>
                <View style={styles.attendanceInfo}>
                  <Text style={styles.attendanceValue}>{student.attendance}%</Text>
                  <Text style={styles.attendanceLabel}>Attendance</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 54,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
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
  attendanceInfo: {
    alignItems: 'flex-end',
  },
  attendanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  attendanceLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    backgroundColor: '#4F46E5',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default StudentScreen;
