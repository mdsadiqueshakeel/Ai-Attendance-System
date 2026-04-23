import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Plus, Search, ArrowLeft, UserCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import studentService from '../services/studentService';
import authService from '../services/authService';
import AuthImage from '../components/AuthImage';

const StudentScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkRole();
    fetchStudents();
  }, []);

  const checkRole = async () => {
    const role = await authService.getRole();
    setIsAdmin(role === 'ADMIN');
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {loading ? 'Fetching students...' : `All Students (${filteredStudents.length})`}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 50 }} />
          ) : (
            <View style={styles.list}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const Card = isAdmin ? TouchableOpacity : View;
                  const cardProps = isAdmin
                    ? {
                        activeOpacity: 0.85,
                        onPress: () =>
                          navigation.navigate('StudentAttendance', {
                            studentId: student.id,
                            name: student.name,
                            rollNumber: student.rollNumber,
                            imageUrl: student.imageUrl,
                          }),
                      }
                    : {};
                  return (
                  <Card
                    key={student.id}
                    style={styles.studentCard}
                    {...cardProps}
                  >
                    <View style={styles.avatarContainer}>
                      {student.imageUrl ? (
                        <AuthImage uri={student.imageUrl} style={styles.avatarImage} />
                      ) : (
                        <UserCircle size={40} color="#94A3B8" />
                      )}
                    </View>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentRoll}>Roll: {student.rollNumber}</Text>
                    </View>
                    <View style={styles.attendanceInfo}>
                      <Text style={styles.attendanceValue}>{student.attendancePercentage || 0}%</Text>
                      <Text style={styles.attendanceLabel}>Attendance</Text>
                    </View>
                  </Card>
                );
              })
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No students found</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {isAdmin && (
        <TouchableOpacity 
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <Plus size={32} color="#fff" />
        </TouchableOpacity>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
});

export default StudentScreen;
