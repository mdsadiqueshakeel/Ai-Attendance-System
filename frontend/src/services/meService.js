import api from './api';

const getMe = async () => {
  const response = await api.get('/api/me', { _skipErrorAlert: true });
  return response.data;
};

const getMyStudent = async () => {
  const response = await api.get('/api/me/student', { _skipErrorAlert: true });
  return response.data;
};

const getMyAttendanceByDate = async (date) => {
  const response = await api.get('/api/me/attendance', {
    params: { date },
    _skipErrorAlert: true,
  });
  return response.data;
};

const getMyAttendanceRange = async (from, to) => {
  const response = await api.get('/api/me/attendance/range', {
    params: { from, to },
    _skipErrorAlert: true,
  });
  return response.data;
};

const uploadMyImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'profile.jpg',
    type: 'image/jpeg',
  });

  const response = await api.post('/api/me/student/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  getMe,
  getMyStudent,
  getMyAttendanceByDate,
  getMyAttendanceRange,
  uploadMyImage,
};

