import { supabase } from "../lib/supabase";
import type { Deposit } from "../types";

export async function getDepositsByMember(memberId: string): Promise<Deposit[]> {
  const { data, error } = await supabase
    .from("deposits")
    .select("*, trash_type:trash_types(*)")
    .eq("member_id", memberId)
    .order("deposit_date", { ascending: false });
  if (error) throw error;
  return data as Deposit[];
}

export async function createDeposit(
  payload: Omit<Deposit, "id" | "created_at" | "trash_type">
): Promise<Deposit> {
  const { data, error } = await supabase
    .from("deposits")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Deposit;
}
