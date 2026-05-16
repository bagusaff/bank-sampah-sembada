import { supabase } from "../lib/supabase";
import type { WithdrawalRequest } from "../types";

export async function getWithdrawalsByMember(
  memberId: string
): Promise<WithdrawalRequest[]> {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as WithdrawalRequest[];
}

export async function getAllWithdrawals(): Promise<WithdrawalRequest[]> {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as WithdrawalRequest[];
}

export async function createWithdrawalRequest(
  payload: Pick<
    WithdrawalRequest,
    | "member_id"
    | "withdrawal_type"
    | "total_amount"
    | "selected_deposits"
    | "bank_account_id"
    | "notes"
  >
): Promise<WithdrawalRequest> {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .insert({ ...payload, status: "pending" })
    .select()
    .single();
  if (error) throw error;
  return data as WithdrawalRequest;
}

export async function completeWithdrawal(
  id: string,
  completedBy: string
): Promise<void> {
  const { error } = await supabase
    .from("withdrawal_requests")
    .update({
      status: "completed",
      completed_by: completedBy,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function cancelWithdrawal(id: string): Promise<void> {
  const { error } = await supabase
    .from("withdrawal_requests")
    .update({ status: "cancelled" })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Fetch the created_at of the most recent withdrawal request for this member
 * (any status). Returns null if the member has never requested a withdrawal.
 */
export async function getLastWithdrawalDate(
  memberId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("withdrawal_requests")
    .select("created_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.created_at as string) ?? null;
}
