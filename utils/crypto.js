// Hash
import bcrypt from "bcrypt";

export async function hashString(string) {
  if (!string) {
    throw new Error("No string has been provided to hash.");
  }

  const hashedString = await bcrypt.hash(string, 10);

  return hashedString;
}

export async function compareHash(string, hash) {
  if (!string || !hash) {
    throw new Error(
      `No ${!string ? "string" : "hash"} has been provided to compare.`,
    );
  }

  const isCorrectString = await bcrypt.compare(string, hash);

  return isCorrectString;
}

// Encrypt
import CryptoJS from "crypto-js";

export function encryptString(string, password) {
  if (!string || !password) {
    throw new Error(
      `No ${!string ? "string" : "password"} has been provided to encrypt.`,
    );
  }

  const encryptedString = CryptoJS.AES.encrypt(string, password).toString();

  return encryptedString;
}

export function decryptString(string, password) {
  if (!string || !password) {
    throw new Error(
      `No ${!string ? "string" : "password"} has been provided to decrypt.`,
    );
  }

  const decryptedString = CryptoJS.AES.decrypt(string, password).toString();

  return decryptedString;
}
