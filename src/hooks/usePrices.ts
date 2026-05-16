import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActivePrices, updatePrice } from "../services/price.service";
import toast from "react-hot-toast";

export function usePrices() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: getActivePrices,
  });
}

export function useUpdatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ trashTypeId, pricePerKg, createdBy }: { trashTypeId: string; pricePerKg: number; createdBy: string }) =>
      updatePrice(trashTypeId, pricePerKg, createdBy),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prices"] });
      toast.success("Harga berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui harga"),
  });
}
