import { createBlockusApiClient } from "./blockusApiClient";
import { env } from "./config";
import {
  generateKeyPair,
  readKeys,
  saveKeys,
  signJWT,
  verifyJWT,
  TokenPayload,
} from "./index";

/**
 * Demonstrates the complete JWT workflow
 */
async function runDemo() {
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
    sub: "0x01", // GAME DB USER ID
    iss: env.BLOCKUS_ISS,
  };

  // Sign the token
  console.log(`Signing token with payload: \n`, payload);
  const didToken = signJWT(payload, privateKey);
  console.log(`didToken: \n`, { didToken });

  // Verify the token
  try {
    console.log("Verifying token...");
    const decoded = verifyJWT(didToken, publicKey);
    console.log(`Token verified. Decoded payload: \n`, decoded);
  } catch (error) {
    console.error("Verification failed:", error);
  }

  // Generate a Blockus Access Token (BAT) using Blockus API
  const blockusClient = createBlockusApiClient();
  // Login a player
  try {
    const { accessToken: blockusAccessToken } = await blockusClient.loginPlayer(
      didToken
    );
    console.log(`Player logged in successfully with token: \n`, {
      blockusAccessToken,
    });

    // Generate redirect URL
    const url = `${env.BLOCKUS_REDIRECT_URL}${blockusAccessToken}`;
    console.log({ redirectUrl: url });
  } catch (error) {
    console.error("Login failed:", error);
  }
}

// Run the demo
runDemo().catch(console.error);
