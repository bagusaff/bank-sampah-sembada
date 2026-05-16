import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepositsByMember,
  getDepositStats,
  createDeposit,
} from "../services/deposit.service";
import toast from "react-hot-toast";
import type { Deposit } from "../types";

export function useDeposits(memberId: string) {
  return useQuery({
    queryKey: ["deposits", memberId],
    queryFn: () => getDepositsByMember(memberId),
    enabled: !!memberId,
  });
}

export function useDepositStats(memberId: string) {
  return useQuery({
    queryKey: ["deposit-stats", memberId],
    queryFn: () => getDepositStats(memberId),
    enabled: !!memberId,
  });
}

export function useCreateDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Omit<Deposit, "id" | "created_at" | "trash_type">
    ) => createDeposit(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["deposits", vars.member_id] });
      qc.invalidateQueries({ queryKey: ["deposit-stats", vars.member_id] });
      toast.success("Deposit berhasil dicatat");
    },
    onError: () => toast.error("Gagal mencatat deposit"),
  });
}
