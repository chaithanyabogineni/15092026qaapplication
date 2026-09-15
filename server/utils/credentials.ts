import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceKey, getSupabaseAnonKey, saveToEnvFile } from "./db.ts";
import fs from "fs";
import path from "path";

const CREDENTIALS_FILE = path.join(process.cwd(), "app_credentials.json");

function readLocalCredentialsFile(): Record<string, string> {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

function writeLocalCredentialsFile(key: string, val: string) {
  try {
    const existing = readLocalCredentialsFile();
    if (val) {
      existing[key] = val;
    } else {
      delete existing[key];
    }
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (e) {
    console.warn("[Credentials] Could not write to local credentials file:", e);
  }
}

/**
 * Retrieves an application credential securely from the Supabase database.
 * Falls back to process.env and local persistent storage.
 */
export async function getAppCredentialFromDB(key: string): Promise<string> {
  let val = "";
  const localCreds = readLocalCredentialsFile();
  if (localCreds[key]) {
    val = localCreds[key];
  }

  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey() || getSupabaseAnonKey();

  if (!val && url && serviceKey && url.startsWith("https://")) {
    try {
      const supabase = createClient(url, serviceKey);
      const { data, error } = await supabase
        .from("app_credentials")
        .select("value")
        .eq("key", key)
        .maybeSingle();

      if (!error && data && data.value) {
        val = data.value;
      } else {
        // Check app_settings as secondary DB source
        const { data: appSettings } = await supabase
          .from("app_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (appSettings) {
          const colKey = key.toLowerCase();
          if (appSettings[colKey]) {
            val = appSettings[colKey];
          }
        }
      }
    } catch (e) {
      // Database not ready or table missing
    }
  }

  if (!val) {
    val = process.env[key] || "";
  }

  // Filter out dummy/placeholder values
  if (key === "GMAIL_USER") {
    const cleanUser = val.trim().toLowerCase();
    if (!cleanUser || cleanUser === "test@gmail.com" || cleanUser.includes("example.com")) {
      return "";
    }
    return cleanUser;
  }

  if (key === "GMAIL_APP_PASSWORD") {
    const cleanPass = val.trim().replace(/\s+/g, "").replace(/["']/g, "");
    if (!cleanPass || cleanPass === "abcdefghijklmnop" || cleanPass.length < 14) {
      return "";
    }
    return cleanPass;
  }

  return val;
}

/**
 * Stores an application credential securely in the database, local storage, and runtime environment.
 */
export async function setAppCredentialInDB(key: string, value: string, description?: string): Promise<boolean> {
  let sanitizedVal = (value || "").trim();
  if (key === "GMAIL_USER") {
    sanitizedVal = sanitizedVal.toLowerCase();
  } else if (key === "GMAIL_APP_PASSWORD") {
    sanitizedVal = sanitizedVal.replace(/\s+/g, "").replace(/["']/g, "");
  }

  // 1. Update runtime environment and .env file
  try {
    process.env[key] = sanitizedVal;
    saveToEnvFile({ [key]: sanitizedVal });
  } catch (envErr) {
    console.warn("[Credentials] Note updating .env for key:", key, envErr);
  }

  // 2. Update local credentials cache file
  writeLocalCredentialsFile(key, sanitizedVal);

  // 3. Update Supabase if available
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey() || getSupabaseAnonKey();

  if (!url || !serviceKey || !url.startsWith("https://")) {
    return true;
  }

  try {
    const supabase = createClient(url, serviceKey);

    // Try app_credentials table
    try {
      await supabase
        .from("app_credentials")
        .upsert({
          key,
          value: sanitizedVal,
          description: description || "",
          updated_at: new Date().toISOString()
        }, { onConflict: "key" });
    } catch (_) {}

    // Fallback to app_settings table
    try {
      const colKey = key.toLowerCase();
      await supabase
        .from("app_settings")
        .upsert({ id: "00000000-0000-0000-0000-000000000000", [colKey]: sanitizedVal, updated_at: new Date().toISOString() });
    } catch (_) {}
  } catch (supabaseErr) {
    console.warn("[Credentials] Supabase client error:", supabaseErr);
  }

  return true;
}
