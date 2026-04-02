import API from './api';

// Setup MFA
export const setupMfa = () => API.post('/mfa/setup');

// Enable MFA
export const verifyAndEnableMfa = (token) =>
  API.post('/mfa/verify', { token });

// 🔥 FIXED: use email instead of userId
export const validateLoginMfa = (email, token) =>
  API.post('/mfa/validate', { email, token });
