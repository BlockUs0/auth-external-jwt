import * as crypto from "crypto";
import * as fs from "node:fs";

/**
 * Generates RSA key pair for JWT signing
 * @returns Object containing the private and public keys
 */
export function generateKeyPair(): { privateKey: string; publicKey: string } {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
}

/**
 * Saves keys to files
 * @param privateKey The private key to save
 * @param publicKey The public key to save
 */
export function saveKeys(privateKey: string, publicKey: string): void {
  // Create the keys directory if it doesn't exist
  if (!fs.existsSync("./keys")) {
    fs.mkdirSync("./keys", { recursive: true });
    console.log("Created keys directory");
  }

  fs.writeFileSync("./keys/private.pem", privateKey);
  fs.writeFileSync("./keys/public.pem", publicKey);
  console.log("Keys saved to ./keys/private.pem and ./keys/public.pem");
}

/**
 * Reads keys from files
 * @returns Object containing the private and public keys
 */
export function readKeys(): { privateKey: string; publicKey: string } {
  try {
    const privateKey = fs.readFileSync("./keys/private.pem", "utf8");
    const publicKey = fs.readFileSync("./keys/public.pem", "utf8");
    return { privateKey, publicKey };
  } catch (error) {
    console.error("Error reading keys:", error);
    throw new Error("Could not read keys");
  }
}
