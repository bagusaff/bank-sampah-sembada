import { supabase } from "../lib/supabase";
import type { News } from "../types";

export async function uploadNewsImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("news-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("news-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getAllNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data as News[];
}

/**
 * Fetch published news ordered by published_at desc.
 * Optionally limit the number of results.
 */
export async function getNews(limit?: number): Promise<News[]> {
  let query = supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as News[];
}

/**
 * Fetch a single news item by ID.
 */
export async function getNewsById(id: string): Promise<News> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as News;
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

export async function updateNews(
  id: string,
  payload: Partial<Omit<News, "id" | "created_at" | "created_by">>
): Promise<News> {
  const { data, error } = await supabase
    .from("news")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as News;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}
