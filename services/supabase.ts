import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Use expo-secure-store for persistent storage on all platforms.
import * as SecureStore from "expo-secure-store";

let storage;
if (Platform.OS !== "web") {
  // Import SecureStore dynamically for native platforms.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SecureStore = require("expo-secure-store");
  storage = {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (e) {
        console.error("SecureStore getItem failed", e);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (e) {
        console.error("SecureStore setItem failed", e);
      }
    },
    removeItem: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {
        console.error("SecureStore deleteItem failed", e);
      }
    },
  };
} else {
  // No‑op storage for web builds.
  storage = {
    getItem: async (_key: string) => null,
    setItem: async (_key: string, _value: string) => {},
    removeItem: async (_key: string) => {},
  };
}

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? process.env.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️  Supabase URL or ANON KEY not configured. Check your .env or app.config.js");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
