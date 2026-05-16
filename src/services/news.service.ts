import { supabase } from "../lib/supabase";
import type { News } from "../types";

export async function getAllNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data as News[];
}

export async function createNews(
  payload: Omit<News, "id" | "created_at">,
  createdBy: string
): Promise<News> {
  const { data, error } = await supabase
    .from("news")
    .insert({ ...payload, created_by: createdBy })
    .select()
    .single();
  if (error) throw error;
  return data as News;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}
