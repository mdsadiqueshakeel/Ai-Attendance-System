import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import ResultScreen from './src/screens/ResultScreen';
import StudentScreen from './src/screens/StudentScreen';
import AddStudentScreen from './src/screens/AddStudentScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import ReportScreen from './src/screens/ReportScreen';
import StudentAttendanceScreen from './src/screens/StudentAttendanceScreen';
import StudentDashboardScreen from './src/screens/StudentDashboardScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';
import MyAttendanceScreen from './src/screens/MyAttendanceScreen';
import SystemStatusScreen from './src/screens/SystemStatusScreen';

const Stack = createStackNavigator();

const AdminStack = createStackNavigator();
const StudentStack = createStackNavigator();

const AdminApp = () => {
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <AdminStack.Screen name="Dashboard" component={DashboardScreen} />
      <AdminStack.Screen name="Camera" component={CameraScreen} />
      <AdminStack.Screen name="Processing" component={ProcessingScreen} />
      <AdminStack.Screen name="Result" component={ResultScreen} />
      <AdminStack.Screen name="Students" component={StudentScreen} />
      <AdminStack.Screen name="AddStudent" component={AddStudentScreen} />
      <AdminStack.Screen name="Attendance" component={AttendanceScreen} />
      <AdminStack.Screen name="Reports" component={ReportScreen} />
      <AdminStack.Screen name="StudentAttendance" component={StudentAttendanceScreen} />
      {__DEV__ && (
        <AdminStack.Screen name="SystemStatus" component={SystemStatusScreen} />
      )}
    </AdminStack.Navigator>
  );
};

const StudentApp = () => {
  return (
    <StudentStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <StudentStack.Screen name="Dashboard" component={StudentDashboardScreen} />
      <StudentStack.Screen name="MyProfile" component={MyProfileScreen} />
      <StudentStack.Screen name="MyAttendance" component={MyAttendanceScreen} />
    </StudentStack.Navigator>
  );
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      const role = (await AsyncStorage.getItem('user_role')) || '';
      if (token) {
        setInitialRoute(role.toUpperCase() === 'STUDENT' ? 'StudentApp' : 'AdminApp');
      } else {
        setInitialRoute('Login');
      }
    })();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        key={initialRoute}
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminApp" component={AdminApp} />
        <Stack.Screen name="StudentApp" component={StudentApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
