import { supabase } from "../lib/supabase";
import type { MemberBalance } from "../types";

export async function getBalanceByMember(
  memberId: string
): Promise<MemberBalance | null> {
  const { data, error } = await supabase
    .from("member_balances")
    .select("*")
    .eq("member_id", memberId)
    .maybeSingle();
  if (error) throw error;
  return data as MemberBalance | null;
}
