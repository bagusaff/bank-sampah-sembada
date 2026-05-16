import { useQuery } from "@tanstack/react-query";
import { getNews, getNewsById } from "../services/news.service";

export function useNews(limit?: number) {
  return useQuery({
    queryKey: ["news", limit ?? "all"],
    queryFn: () => getNews(limit),
  });
}

export function useNewsById(id: string) {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
}
