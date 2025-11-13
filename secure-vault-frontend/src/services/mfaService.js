
import API from './api';

export const setupMfa = () => API.post('/mfa/setup');
export const verifyAndEnableMfa = (token) => API.post('/mfa/verify', { token });
export const validateLoginMfa = (userId, token) => API.post('/mfa/validate', { userId, token });
