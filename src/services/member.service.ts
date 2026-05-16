import { supabase } from "../lib/supabase";
import type { Profile, MemberBalance, MemberWithBalance } from "../types";

export async function getAllMembers(): Promise<MemberWithBalance[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, member_balance:member_balances(*)")
    .eq("role", "member")
    .order("full_name");
  if (error) throw error;
  return data as MemberWithBalance[];
}

export async function searchMembers(query: string): Promise<MemberWithBalance[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, member_balance:member_balances(*)")
    .eq("role", "member")
    .or(`full_name.ilike.%${query}%,phone_number.ilike.%${query}%`)
    .order("full_name")
    .limit(20);
  if (error) throw error;
  return data as MemberWithBalance[];
}

export async function getMemberById(id: string): Promise<MemberWithBalance | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, member_balance:member_balances(*)")
    .eq("id", id)
    .eq("role", "member")
    .maybeSingle();
  if (error) throw error;
  return data as MemberWithBalance | null;
}

export async function getMemberByPhone(phone: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("phone_number", phone)
    .single();
  if (error) return null;
  return data as Profile;
}

export async function getMemberBalance(memberId: string): Promise<MemberBalance | null> {
  const { data, error } = await supabase
    .from("member_balances")
    .select("*")
    .eq("member_id", memberId)
    .single();
  if (error) return null;
  return data as MemberBalance;
}

export async function updateMemberStatus(memberId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", memberId);
  if (error) throw error;
}
