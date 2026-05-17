import axios from 'axios';

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://hospital-system-api-axkw.onrender.com/api';

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('hms_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
