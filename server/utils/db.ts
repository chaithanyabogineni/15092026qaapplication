import fs from "fs";
import path from "path";
import dotenv from "dotenv";

/**
 * Returns the path to the .env file in the current working directory.
 */
export function getEnvFilePath(): string {
  return path.join(process.cwd(), ".env");
}

/**
 * Parses the .env file directly from disk.
 * Returns { exists: boolean, env: Record<string, string> }.
 */
export function readEnvDirectly(): { exists: boolean; env: Record<string, string> } {
  const envPath = getEnvFilePath();
  if (!fs.existsSync(envPath)) {
    return { exists: false, env: {} };
  }
  try {
    const raw = fs.readFileSync(envPath, "utf-8");
    const parsed = dotenv.parse(raw) || {};
    // Also parse YAML-style 'KEY: VALUE' lines if dotenv didn't capture them
    raw.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      if (!trimmed.includes("=") && trimmed.includes(":")) {
        const colonIdx = trimmed.indexOf(":");
        const k = trimmed.slice(0, colonIdx).trim();
        const v = trimmed.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (k && v && !parsed[k]) {
          parsed[k] = v;
        }
      }
    });
    return { exists: true, env: parsed };
  } catch (err) {
    console.error("[DB Utils] Error reading .env file:", err);
    return { exists: true, env: {} };
  }
}

/**
 * Gets Supabase URL strictly from the .env file on disk.
 * If .env is missing or does not define VITE_SUPABASE_URL, clears process.env and returns empty string.
 */
export const getSupabaseUrl = (): string => {
  const { exists, env } = readEnvDirectly();
  if (!exists) {
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    return "";
  }
  const val = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || "").trim();
  if (!val || val === "https://placeholder.supabase.co") {
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    return "";
  }
  process.env.VITE_SUPABASE_URL = val;
  process.env.SUPABASE_URL = val;
  return val;
};

/**
 * Gets Supabase Anon Key strictly from the .env file on disk.
 * If .env is missing or does not define VITE_SUPABASE_ANON_KEY, clears process.env and returns empty string.
 */
export const getSupabaseAnonKey = (): string => {
  const { exists, env } = readEnvDirectly();
  if (!exists) {
    delete process.env.VITE_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    return "";
  }
  const val = (env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || "").trim();
  if (!val || val.length < 15 || val === "placeholder_key") {
    delete process.env.VITE_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_ANON_KEY;
    return "";
  }
  process.env.VITE_SUPABASE_ANON_KEY = val;
  process.env.SUPABASE_ANON_KEY = val;
  return val;
};

/**
 * Gets Supabase Service Role Key strictly from the .env file on disk.
 * If .env is missing or does not define SUPABASE_SERVICE_ROLE_KEY, clears process.env and returns empty string.
 */
export const getSupabaseServiceKey = (): string => {
  const { exists, env } = readEnvDirectly();
  if (!exists) {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    return "";
  }
  const val = (env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!val || val.length < 15 || val === "placeholder_key") {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    return "";
  }
  process.env.SUPABASE_SERVICE_ROLE_KEY = val;
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY = val;
  return val;
};

/**
 * Inspects whether the .env file exists and contains all required DB credentials.
 */
export const checkEnvDbCredentials = (): {
  envExists: boolean;
  isConfigured: boolean;
  missingCredentials: string[];
  url: string;
  anonKey: string;
  serviceKey: string;
} => {
  const { exists, env } = readEnvDirectly();
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const serviceKey = getSupabaseServiceKey();

  const missing: string[] = [];
  if (!url || !url.startsWith("https://")) {
    missing.push("VITE_SUPABASE_URL");
  }
  if (!anonKey || anonKey.length < 15) {
    missing.push("VITE_SUPABASE_ANON_KEY");
  }
  if (!serviceKey || serviceKey.length < 15) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  const isConfigured = exists && missing.length === 0;

  return {
    envExists: exists,
    isConfigured,
    missingCredentials: missing,
    url,
    anonKey,
    serviceKey
  };
};

/**
 * Saves database credentials EXCLUSIVELY to the .env file.
 * If .env does not exist, it creates the file.
 * If .env exists, it updates or adds the database credentials while preserving any other existing keys.
 */
export function saveToEnvFile(entries: Record<string, string>): string {
  const envPath = getEnvFilePath();
  const { env: existing } = readEnvDirectly();
  const merged: Record<string, string> = { ...existing };

  for (const [k, v] of Object.entries(entries)) {
    const trimmedVal = (v || "").trim();
    if (trimmedVal) {
      merged[k] = trimmedVal;
      process.env[k] = trimmedVal;
    } else {
      delete merged[k];
      delete process.env[k];
    }
  }

  // Ensure DB credentials appear cleanly in .env
  const lines: string[] = [];
  // Prioritize DB credentials at the top
  const priorityKeys = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
  for (const key of priorityKeys) {
    if (merged[key]) {
      lines.push(`${key}=${merged[key]}`);
    }
  }
  for (const [key, val] of Object.entries(merged)) {
    if (!priorityKeys.includes(key)) {
      lines.push(`${key}=${val}`);
    }
  }

  fs.writeFileSync(envPath, lines.join("\n").trim() + "\n", "utf-8");

  try {
    dotenv.config({ path: envPath, override: true });
  } catch {}

  return envPath;
}

/**
 * Persists database credentials strictly to .env file.
 */
export const setDatabaseCredentials = (url: string, anonKey: string, serviceRoleKey?: string): void => {
  saveToEnvFile({
    VITE_SUPABASE_URL: (url || "").trim(),
    VITE_SUPABASE_ANON_KEY: (anonKey || "").trim(),
    SUPABASE_SERVICE_ROLE_KEY: (serviceRoleKey || "").trim()
  });
};

/**
 * Clears database credentials from .env file and in-memory process.env.
 */
export const clearDatabaseCredentials = (): void => {
  delete process.env.VITE_SUPABASE_URL;
  delete process.env.SUPABASE_URL;
  delete process.env.VITE_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  saveToEnvFile({
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
    SUPABASE_SERVICE_ROLE_KEY: ""
  });
};

export { getAppCredentialFromDB } from "./credentials.ts";
