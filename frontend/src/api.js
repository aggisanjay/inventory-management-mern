import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000
});

// attach token automatically
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;
