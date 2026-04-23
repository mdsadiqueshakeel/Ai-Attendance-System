import api from './api';

const getAllStudents = async () => {
  try {
    const response = await api.get('/api/students');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addStudent = async (studentData) => {
  try {
    const response = await api.post('/api/students', studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadStudentImage = async (studentId, imageUri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'student.jpg',
      type: 'image/jpeg',
    });

    const response = await api.post(`/api/students/${studentId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { getAllStudents, addStudent, uploadStudentImage };
