import { supabase } from "../lib/supabase";
import type { BankAccount } from "../types";

export async function getBankAccountsByUser(
  userId: string
): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as BankAccount[];
}

export async function createBankAccount(
  payload: Omit<BankAccount, "id" | "created_at">
): Promise<BankAccount> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as BankAccount;
}

export async function updateBankAccount(
  id: string,
  payload: Partial<Omit<BankAccount, "id" | "user_id" | "created_at">>
): Promise<BankAccount> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as BankAccount;
}

export async function deleteBankAccount(id: string): Promise<void> {
  const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
  if (error) throw error;
}

export async function setDefaultBankAccount(
  userId: string,
  accountId: string
): Promise<void> {
  // Unset all defaults for this user
  const { error: e1 } = await supabase
    .from("bank_accounts")
    .update({ is_default: false })
    .eq("user_id", userId);
  if (e1) throw e1;

  // Set the chosen one as default
  const { error: e2 } = await supabase
    .from("bank_accounts")
    .update({ is_default: true })
    .eq("id", accountId);
  if (e2) throw e2;
}
