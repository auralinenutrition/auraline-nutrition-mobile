import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseUrl = "https://khgmjbsfblabpcktajea.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ21qYnNmYmxhYnBja3RhamVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTA4NTIsImV4cCI6MjA3OTUyNjg1Mn0.PSg5KUqP2gVL6OtS-WbaQQmHoRN-EiqRUAaFvNDsO-A";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === "web",
    },
  }
);
