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

const autoMarkAttendance = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageFile.uri,
      name: 'attendance_image.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post('/api/attendance/auto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data) => data, // Ensure axios doesn't stringify FormData
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { 
  markAttendance, 
  getStudentAttendance, 
  getAttendanceReport,
  autoMarkAttendance
};
