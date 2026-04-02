import API from './api';

export const getVault = () => API.get('/vault');

export const updateVault = (encryptedBlob) =>
  API.put('/vault', { encryptedBlob });
