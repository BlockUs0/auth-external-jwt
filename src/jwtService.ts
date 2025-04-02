import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

// Interface for our payload
export interface TokenPayload extends JwtPayload {
  sub: string;
}

/**
 * Signs a JWT with the given payload and private key
 * @param payload Data to include in the token
 * @param privateKey The private key to sign with
 * @param expiresIn Token expiration time (in seconds)
 * @returns The signed JWT string
 */
export function signJWT(
  payload: TokenPayload,
  privateKey: string,
  expiresIn: number = 3600,
  issuer?: string
): string {
  return jwt.sign(
    // Option 1: Include issuer in the payload
    { ...payload, iss: payload.iss || issuer, aud: "blockus" },
    { key: privateKey } as jwt.Secret,
    {
      algorithm: "RS256",
      expiresIn: expiresIn,
    }
  );
}

/**
 * Verifies a JWT using the public key
 * @param token The JWT to verify
 * @param publicKey The public key to verify with
 * @param issuer Expected issuer (optional)
 * @returns The decoded payload if valid
 */
export function verifyJWT(
  token: string,
  publicKey: string,
  issuer?: string // Add optional issuer parameter
): TokenPayload {
  try {
    const options: jwt.VerifyOptions = {
      algorithms: ["RS256"],
    };

    // If issuer is provided, verify it matches
    if (issuer) {
      options.issuer = issuer;
    }

    return jwt.verify(token, publicKey, options) as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
}
