// Export everything from the modules to create a SDK
export { generateKeyPair, readKeys, saveKeys } from "./keyManager";
export { signJWT, verifyJWT, TokenPayload } from "./jwtService";

// This file only exports the functionality, without containing the demo
// The demo is moved to a separate file (demo.ts) that imports from this index
