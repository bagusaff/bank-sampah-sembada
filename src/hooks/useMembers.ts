import { useQuery } from "@tanstack/react-query";
import { getAllMembers, searchMembers, getMemberById } from "../services/member.service";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: getAllMembers,
  });
}

export function useSearchMembers(query: string) {
  return useQuery({
    queryKey: ["members", "search", query],
    queryFn: () => searchMembers(query),
    enabled: query.length >= 2,
  });
}

export function useMemberById(id: string) {
  return useQuery({
    queryKey: ["members", id],
    queryFn: () => getMemberById(id),
    enabled: !!id,
  });
}
