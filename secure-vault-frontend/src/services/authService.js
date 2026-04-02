import API from './api';

export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
