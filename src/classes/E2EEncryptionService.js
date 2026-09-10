/**
 * E2EEncryptionService
 * Client-Side End-to-End Encryption (E2EE) using Web Crypto API (SubtleCrypto).
 * Uses AES-GCM 256-bit encryption with PBKDF2 key derivation from user passphrase.
 * Allows users to store private model evaluation notes and verify payload integrity.
 */

export class E2EEncryptionService {
  /**
   * Derives a 256-bit AES-GCM CryptoKey from a user passphrase and salt
   */
  static async deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts plaintext message into a base64 encrypted payload
   * @param {string} plaintext 
   * @param {string} passphrase 
   * @returns {Promise<string>} Base64 bundle containing salt + iv + ciphertext
   */
  static async encrypt(plaintext, passphrase = 'modelhub-master-key') {
    if (!window.crypto || !window.crypto.subtle) {
      // Fallback for non-secure contexts
      return btoa(unescape(encodeURIComponent(plaintext)));
    }

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(passphrase, salt);

    const enc = new TextEncoder();
    const encodedData = enc.encode(plaintext);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encodedData
    );

    // Combine salt (16) + iv (12) + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, 16);
    combined.set(new Uint8Array(ciphertext), 28);

    let binary = '';
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  }

  /**
   * Decrypts base64 encrypted payload back to plaintext
   * @param {string} base64Payload 
   * @param {string} passphrase 
   * @returns {Promise<string>} Decrypted plaintext
   */
  static async decrypt(base64Payload, passphrase = 'modelhub-master-key') {
    if (!window.crypto || !window.crypto.subtle) {
      return decodeURIComponent(escape(atob(base64Payload)));
    }

    try {
      const binary = atob(base64Payload);
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
      }

      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const ciphertext = combined.slice(28);

      const key = await this.deriveKey(passphrase, salt);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      return dec.decode(decrypted);
    } catch {
      throw new Error('E2EE decryption failed. Invalid key or tampered message.');
    }
  }
}
