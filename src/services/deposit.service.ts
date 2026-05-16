import { supabase } from "../lib/supabase";
import type { Deposit, DepositWithRelations, CreateDepositPayload } from "../types";

export async function getDepositsByMember(
  memberId: string
): Promise<DepositWithRelations[]> {
  const { data, error } = await supabase
    .from("deposits")
    .select("*, trash_type:trash_types(*)")
    .eq("member_id", memberId)
    .order("deposit_date", { ascending: false });
  if (error) throw error;
  return data as DepositWithRelations[];
}

export interface DepositStats {
  totalDeposited: number;
  totalWithdrawn: number;
  unwithdrawnCount: number;
}

export async function getDepositStats(
  memberId: string
): Promise<DepositStats> {
  const { data, error } = await supabase
    .from("deposits")
    .select("total_rupiah, is_withdrawn")
    .eq("member_id", memberId);

  if (error) throw error;

  const rows = (data ?? []) as Pick<Deposit, "total_rupiah" | "is_withdrawn">[];

  return rows.reduce<DepositStats>(
    (acc, row) => ({
      totalDeposited: acc.totalDeposited + (row.total_rupiah ?? 0),
      totalWithdrawn: acc.totalWithdrawn + (row.is_withdrawn ? row.total_rupiah : 0),
      unwithdrawnCount: acc.unwithdrawnCount + (row.is_withdrawn ? 0 : 1),
    }),
    { totalDeposited: 0, totalWithdrawn: 0, unwithdrawnCount: 0 }
  );
}

export async function createDeposit(
  payload: CreateDepositPayload
): Promise<Deposit> {
  const { data, error } = await supabase
    .from("deposits")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Deposit;
}

/**
 * Fetch recent deposits across all members (for admin dashboard).
 * Joined with trash_types and member profile info.
 */
export async function getRecentDeposits(limit = 10): Promise<DepositWithRelations[]> {
  const { data, error } = await supabase
    .from("deposits")
    .select("*, trash_type:trash_types(*), member:profiles!deposits_member_id_fkey(id, full_name, phone_number)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as DepositWithRelations[];
}
