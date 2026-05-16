import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBankAccountsByUser,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  setDefaultBankAccount,
} from "../services/bankaccount.service";
import toast from "react-hot-toast";
import type { BankAccount } from "../types";

export function useBankAccounts(userId: string) {
  return useQuery({
    queryKey: ["bank-accounts", userId],
    queryFn: () => getBankAccountsByUser(userId),
    enabled: !!userId,
  });
}

export function useCreateBankAccount(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<BankAccount, "id" | "created_at">) =>
      createBankAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts", userId] });
      toast.success("Rekening bank berhasil disimpan");
    },
    onError: () => toast.error("Gagal menyimpan rekening bank"),
  });
}

export function useUpdateBankAccount(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<BankAccount, "id" | "user_id" | "created_at">>;
    }) => updateBankAccount(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts", userId] });
      toast.success("Rekening bank berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui rekening bank"),
  });
}

export function useDeleteBankAccount(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBankAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts", userId] });
      toast.success("Rekening bank berhasil dihapus");
    },
    onError: () => toast.error("Gagal menghapus rekening bank"),
  });
}

export function useSetDefaultBankAccount(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => setDefaultBankAccount(userId, accountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts", userId] });
    },
    onError: () => toast.error("Gagal mengatur rekening utama"),
  });
}
