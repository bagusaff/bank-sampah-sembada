import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentPrices,
  getActivePrices,
  getAcceptedTypes,
  getAllTrashTypes,
  getPriceHistory,
  createTrashType,
  updateTrashType,
  setNewPrice,
} from "../services/price.service";
import toast from "react-hot-toast";
import type { TrashType } from "../types";

export function usePrices() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: getCurrentPrices,
  });
}

export function useActivePrices() {
  return useQuery({
    queryKey: ["active-prices"],
    queryFn: getActivePrices,
  });
}

export function useAcceptedTypes() {
  return useQuery({
    queryKey: ["accepted-types"],
    queryFn: getAcceptedTypes,
  });
}

export function useAllTrashTypes() {
  return useQuery({
    queryKey: ["trash-types"],
    queryFn: getAllTrashTypes,
  });
}

export function usePriceHistory(trashTypeId: string) {
  return useQuery({
    queryKey: ["price-history", trashTypeId],
    queryFn: () => getPriceHistory(trashTypeId),
    enabled: !!trashTypeId,
  });
}

export function useUpdatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      trashTypeId,
      pricePerKg,
      createdBy,
    }: {
      trashTypeId: string;
      pricePerKg: number;
      createdBy: string;
    }) => setNewPrice(trashTypeId, pricePerKg, createdBy),
    onSuccess: (_, { trashTypeId }) => {
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["active-prices"] });
      qc.invalidateQueries({ queryKey: ["accepted-types"] });
      qc.invalidateQueries({ queryKey: ["trash-types"] });
      qc.invalidateQueries({ queryKey: ["price-history", trashTypeId] });
      toast.success("Harga berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui harga"),
  });
}

export function useCreateTrashType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<TrashType, "id" | "created_at" | "updated_at">) =>
      createTrashType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trash-types"] });
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["accepted-types"] });
      toast.success("Jenis sampah berhasil ditambahkan");
    },
    onError: () => toast.error("Gagal menambahkan jenis sampah"),
  });
}

export function useUpdateTrashType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<TrashType, "id" | "created_at" | "updated_at">>;
    }) => updateTrashType(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trash-types"] });
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["accepted-types"] });
      toast.success("Jenis sampah berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui jenis sampah"),
  });
}
