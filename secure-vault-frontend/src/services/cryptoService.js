import AES from 'crypto-js/aes';
import PBKDF2 from 'crypto-js/pbkdf2';
import encHex from 'crypto-js/enc-hex';
import encUtf8 from 'crypto-js/enc-utf8';
import WordArray from 'crypto-js/lib-typedarrays'; // Import WordArray for the IV

// ... (deriveAuthKey and deriveEncryptionKey are unchanged) ...
const SALT_ITERATIONS = 100000;
const KEY_SIZE = 256 / 32;

export const deriveAuthKey = (password, salt) => {
  const key = PBKDF2(password, salt, { keySize: KEY_SIZE, iterations: SALT_ITERATIONS });
  return key.toString(encHex);
};

const deriveEncryptionKey = (password) => {
    const salt = 'secure-vault-encryption-salt';
    return PBKDF2(password, salt, { keySize: KEY_SIZE, iterations: SALT_ITERATIONS });
};


export const encrypt = (data, password) => {
  const key = deriveEncryptionKey(password);
  const dataToEncrypt = data || '';
  
  // --- FINAL ATTEMPT: Manually create an IV to force a different code path ---
  const iv = WordArray.random(128 / 8); // Create a 128-bit random IV

  const encrypted = AES.encrypt(dataToEncrypt, key, { iv: iv });

  // Combine iv and ciphertext for storage: iv.toString() + encrypted.toString()
  return iv.toString(encHex) + encrypted.toString();
};


export const decrypt = (encryptedData, password) => {
  const key = deriveEncryptionKey(password);
  
  // --- FINAL ATTEMPT: Manually parse the IV ---
  // The IV is the first 32 hex characters (128 bits)
  const ivHex = encryptedData.substring(0, 32);
  const ciphertext = encryptedData.substring(32);
  const iv = encHex.parse(ivHex);

  const decrypted = AES.decrypt(ciphertext, key, { iv: iv });

  return decrypted.toString(encUtf8);
};