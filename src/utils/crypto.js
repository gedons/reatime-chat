// --- Helper Functions for Base64 conversion ---
export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// --- ECDH Key Functions ---
// Generate an ECDH key pair using the P-256 curve.
export async function generateECDHKeys() {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    true, // extractable so we can export the public key
    ["deriveKey", "deriveBits"]
  );
}

// Export a public key in JWK format.
export async function exportPublicKey(publicKey) {
  return await window.crypto.subtle.exportKey("jwk", publicKey);
}

// Import a public key from its JWK representation.
export async function importPublicKey(jwk) {
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    true,
    []
  );
}

// Derive a shared AES-GCM key from your private ECDH key and the other party's public key.
export async function deriveSharedKey(privateKey, otherPublicKey) {
  return await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: otherPublicKey
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false, // non-extractable for security
    ["encrypt", "decrypt"]
  );
}

// --- AES-GCM Encryption/Decryption using a shared key ---
export async function encryptWithSharedKey(sharedKey, plainText) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV recommended for AES-GCM
  const encoder = new TextEncoder();
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    sharedKey,
    encoder.encode(plainText)
  );
  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv)
  };
}

export async function decryptWithSharedKey(sharedKey, ciphertext, ivStr) {
  const iv = base64ToArrayBuffer(ivStr);
  const ciphertextBuffer = base64ToArrayBuffer(ciphertext);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv
    },
    sharedKey,
    ciphertextBuffer
  );
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

// --- Fallback Key Derivation using PBKDF2 ---
export async function getKey() {
  const passphrase = import.meta.env.VITE_PASSPHRASE || 'chat%^@fdfhghf$gt123';
  const encoder = new TextEncoder();
  // Import the passphrase as a key
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  // Derive a key using PBKDF2
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('fixedSalt'), // For demo only; in production use a unique salt per user/session
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
}
