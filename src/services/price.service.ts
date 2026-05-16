import { supabase } from "../lib/supabase";
import type { TrashPrice, TrashType } from "../types";

export async function getActivePrices(): Promise<(TrashPrice & { trash_type: TrashType })[]> {
  const { data, error } = await supabase
    .from("trash_prices")
    .select("*, trash_type:trash_types(*)")
    .eq("is_active", true);
  if (error) throw error;
  return data as (TrashPrice & { trash_type: TrashType })[];
}

export async function updatePrice(
  trashTypeId: string,
  pricePerKg: number,
  createdBy: string
): Promise<TrashPrice> {
  await supabase
    .from("trash_prices")
    .update({ is_active: false })
    .eq("trash_type_id", trashTypeId)
    .eq("is_active", true);

  const { data, error } = await supabase
    .from("trash_prices")
    .insert({
      trash_type_id: trashTypeId,
      price_per_kg: pricePerKg,
      effective_date: new Date().toISOString().split("T")[0],
      is_active: true,
      created_by: createdBy,
    })
    .select()
    .single();
  if (error) throw error;
  return data as TrashPrice;
}
