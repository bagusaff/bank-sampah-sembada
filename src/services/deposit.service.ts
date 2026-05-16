import { supabase } from "../lib/supabase";
import type { Deposit, DepositWithRelations } from "../types";

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
