import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

export async function sendOtp(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Dev bypass: sign in with email/password, then fetch the user's profile
 * so the caller knows which role to redirect to.
 */
export async function devLogin(email: string, password: string): Promise<Profile> {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) throw signInError;

  const userId = signInData.user?.id;
  if (!userId) {
    await supabase.auth.signOut();
    throw new Error("User ID tidak ditemukan setelah login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    // Rollback session so we don't leave the user half-logged in.
    await supabase.auth.signOut();
    throw new Error(profileError?.message ?? "Profil tidak ditemukan");
  }

  return profile as Profile;
}
