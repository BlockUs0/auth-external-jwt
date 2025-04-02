import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  BLOCKUS_API_URL: z.string().url("BLOCKUS_API_URL must be a valid URL."),
  BLOCKUS_API_KEY: z.string().min(1, "BLOCKUS_API_KEY is required."),
  BLOCKUS_API_PROJECT: z.string().min(1, "BLOCKUS_API_PROJECT is required."),
  BLOCKUS_REDIRECT_URL: z.string().min(1, "BLOCKUS_REDIRECT_URL is required."),
  BLOCKUS_ISS: z.string().min(1, "BLOCKUS_ISS is required."),
});

// Parse and validate environment variables
const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error("❌ Invalid environment variables:");
  console.error(envParse.error.format());
  throw new Error("Invalid environment variables");
}

// Export typed environment variables
export const env = envParse.data;
