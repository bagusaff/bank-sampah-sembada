import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10, "Nomor telepon minimal 10 digit")
  .regex(/^(08|\+628)\d{7,11}$/, "Format nomor tidak valid. Gunakan 08xx atau +628xx");

export const otpSchema = z
  .string()
  .length(6, "OTP harus 6 digit")
  .regex(/^\d+$/, "OTP hanya berisi angka");

export const depositSchema = z.object({
  member_id: z.string().uuid(),
  trash_type_id: z.string().uuid(),
  weight_kg: z.number().positive("Berat harus lebih dari 0"),
  deposit_date: z.string(),
  notes: z.string().optional(),
});

export const newsSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  type: z.enum(["announcement", "price_update", "tips", "general"]),
  published_at: z.string(),
});
