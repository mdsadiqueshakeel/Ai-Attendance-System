import api from './api';

const markAttendance = async ({ studentId, date, status }) => {
  try {
    const response = await api.post('/api/attendance/mark', {
      studentId,
      date,
      status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getStudentAttendance = async (studentId, date) => {
  try {
    const response = await api.get(`/api/attendance/student/${studentId}`, {
      params: { date },
      _skipErrorAlert: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAttendanceReport = async (date) => {
  try {
    const response = await api.get('/api/attendance/report', {
      params: { date },
      _skipErrorAlert: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { markAttendance, getStudentAttendance, getAttendanceReport };
