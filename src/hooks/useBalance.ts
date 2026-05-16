import { useQuery } from "@tanstack/react-query";
import { getBalanceByMember } from "../services/balance.service";

export function useBalance(memberId: string) {
  return useQuery({
    queryKey: ["balance", memberId],
    queryFn: () => getBalanceByMember(memberId),
    enabled: !!memberId,
  });
}
