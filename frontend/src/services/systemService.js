import api from './api';

const getHealth = async () => {
  const response = await api.get('/actuator/health', { _skipErrorAlert: true });
  return response.data;
};

const getApiDocs = async () => {
  const response = await api.get('/v3/api-docs', { _skipErrorAlert: true });
  return response.data;
};

export default { getHealth, getApiDocs };

