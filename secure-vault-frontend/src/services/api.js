
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://15.206.112.159:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
