// JWT Signing with TypeScript
// This example demonstrates how to generate and verify JWTs with RSA keys

import * as crypto from "crypto";
import * as fs from "node:fs";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

// Interface for our payload
interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

/**
 * Generates RSA key pair for JWT signing
 * @returns Object containing the private and public keys
 */
function generateKeyPair(): { privateKey: string; publicKey: string } {
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
function saveKeys(privateKey: string, publicKey: string): void {
  fs.writeFileSync("private.pem", privateKey);
  fs.writeFileSync("public.pem", publicKey);
  console.log("Keys saved to private.pem and public.pem");
}

/**
 * Reads keys from files
 * @returns Object containing the private and public keys
 */
function readKeys(): { privateKey: string; publicKey: string } {
  try {
    const privateKey = fs.readFileSync("private.pem", "utf8");
    const publicKey = fs.readFileSync("public.pem", "utf8");
    return { privateKey, publicKey };
  } catch (error) {
    console.error("Error reading keys:", error);
    throw new Error("Could not read keys");
  }
}

/**
 * Signs a JWT with the given payload and private key
 * @param payload Data to include in the token
 * @param privateKey The private key to sign with
 * @param expiresIn Token expiration time (in seconds)
 * @returns The signed JWT string
 */
function signJWT(
  payload: TokenPayload,
  privateKey: string,
  expiresIn: number = 3600
): string {
  return jwt.sign(payload, { key: privateKey } as jwt.Secret, {
    algorithm: "RS256",
    expiresIn: expiresIn,
  });
}

/**
 * Verifies a JWT using the public key
 * @param token The JWT to verify
 * @param publicKey The public key to verify with
 * @returns The decoded payload if valid
 */
function verifyJWT(token: string, publicKey: string): TokenPayload {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
}

// Main function to demonstrate usage
async function main() {
  let privateKey: string;
  let publicKey: string;

  // Check if keys already exist, if not generate new ones
  try {
    const keys = readKeys();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
    console.log("Using existing keys");
  } catch (error) {
    console.log("Generating new key pair...");
    const keys = generateKeyPair();
    privateKey = keys.privateKey;
    publicKey = keys.publicKey;
    saveKeys(privateKey, publicKey);
  }

  // Create a payload
  const payload: TokenPayload = {
    userId: "user123",
    role: "admin",
  };

  // Sign the token
  console.log("Signing token with payload:", payload);
  const token = signJWT(payload, privateKey);
  console.log("Token:", token);

  // Verify the token
  try {
    console.log("Verifying token...");
    const decoded = verifyJWT(token, publicKey);
    console.log("Token verified. Decoded payload:", decoded);
  } catch (error) {
    console.error("Verification failed:", error);
  }

  // Example: Create a token that expires in 5 seconds
  console.log("\nCreating short-lived token (5 seconds)...");
  const shortLivedToken = signJWT(payload, privateKey, 5);

  console.log("Short-lived token:", shortLivedToken);
  console.log("Waiting 6 seconds...");

  await new Promise((resolve) => setTimeout(resolve, 6000));

  try {
    console.log("Verifying expired token...");
    verifyJWT(shortLivedToken, publicKey);
  } catch (error) {
    console.log("Expected error: Token expired");
  }
}

// Run the demo
main().catch(console.error);
