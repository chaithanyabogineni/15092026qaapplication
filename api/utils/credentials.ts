import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceKey, getSupabaseAnonKey, saveToEnvFile } from "./db.ts";

/**
 * Retrieves an application credential securely from the Supabase database.
 * Falls back to process.env if the database is not reachable or table is not created.
 */
export async function getAppCredentialFromDB(key: string): Promise<string> {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey() || getSupabaseAnonKey();

  if (url && serviceKey && url.startsWith("https://")) {
    try {
      const supabase = createClient(url, serviceKey);
      const { data, error } = await supabase
        .from("app_credentials")
        .select("value")
        .eq("key", key)
        .maybeSingle();

      if (!error && data && data.value) {
        return data.value;
      }

      // Check app_settings as secondary DB source
      const { data: appSettings } = await supabase
        .from("app_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (appSettings) {
        const colKey = key.toLowerCase();
        if (appSettings[colKey]) {
          return appSettings[colKey];
        }
      }
    } catch (e) {
      // Database not ready or table missing
    }
  }

  return process.env[key] || "";
}

/**
 * Stores an application credential securely in the Supabase database and syncs to runtime environment.
 */
export async function setAppCredentialInDB(key: string, value: string, description?: string): Promise<boolean> {
  // Always update runtime environment and .env file for instant availability and resilience
  try {
    process.env[key] = value;
    saveToEnvFile({ [key]: value });
  } catch (envErr) {
    console.warn("[Credentials] Note updating .env for key:", key, envErr);
  }

  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey() || getSupabaseAnonKey();

  if (!url || !serviceKey || !url.startsWith("https://")) {
    // Stored in environment/.env successfully even if DB is not currently attached
    return true;
  }

  let dbSaved = false;
  try {
    const supabase = createClient(url, serviceKey);

    // 1. Save to app_credentials table
    try {
      const { error } = await supabase
        .from("app_credentials")
        .upsert({
          key,
          value,
          description: description || "",
          updated_at: new Date().toISOString()
        }, { onConflict: "key" });

      if (!error) {
        dbSaved = true;
      } else {
        console.warn("[Credentials] app_credentials table notice:", error.message);
      }
    } catch (err) {
      console.warn("[Credentials] Error upserting to app_credentials:", err);
    }

    // 2. Fallback to app_settings table
    if (!dbSaved) {
      try {
        const colKey = key.toLowerCase();
        const updateObj: Record<string, any> = {
          [colKey]: value,
          updated_at: new Date().toISOString()
        };
        const { error: settingsError } = await supabase
          .from("app_settings")
          .upsert({ id: "default_settings", ...updateObj });

        if (!settingsError) dbSaved = true;
      } catch (err) {
        console.warn("[Credentials] Error updating app_settings:", err);
      }
    }
  } catch (supabaseErr) {
    console.warn("[Credentials] Supabase client error:", supabaseErr);
  }

  return true;
}
