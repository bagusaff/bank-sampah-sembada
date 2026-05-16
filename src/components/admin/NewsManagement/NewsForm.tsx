import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Loader2,
  Newspaper,
  FileText,
  Type,
  Calendar,
  ImagePlus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useCreateNews, useUpdateNews } from "../../../hooks/useNews";
import { uploadNewsImage } from "../../../services/news.service";
import type { News } from "../../../types";

// ─── Schema ──────────────────────────────────────────────────────────────────

const newsSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200, "Maksimal 200 karakter"),
  type: z.enum(["announcement", "price_update", "tips", "general"]),
  content: z.string().default(""),
  published_at: z.string().min(1, "Tanggal publish wajib diisi"),
});

type NewsFormData = z.infer<typeof newsSchema>;

const TYPE_OPTIONS: { value: News["type"]; label: string }[] = [
  { value: "announcement", label: "Pengumuman" },
  { value: "price_update", label: "Update Harga" },
  { value: "tips", label: "Tips" },
  { value: "general", label: "Umum" },
];

// ─── Image preview item ───────────────────────────────────────────────────────

function ImageThumb({
  src,
  onRemove,
}: {
  src: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
      <img src={src} alt="" className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewsForm({
  news,
  onClose,
}: {
  news?: News | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const isEditing = !!news;
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Existing URLs (from DB when editing), new File objects + their preview URLs
  const [existingUrls, setExistingUrls] = useState<string[]>(news?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImages = existingUrls.length + newFiles.length;
  const canAddMore = totalImages < 3;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      type: "general",
      content: "",
      published_at: new Date().toISOString().slice(0, 16),
    },
  });

  useEffect(() => {
    if (news) {
      reset({
        title: news.title,
        type: news.type,
        content: news.content,
        published_at: news.published_at.slice(0, 16),
      });
      setExistingUrls(news.images ?? []);
    }
  }, [news, reset]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 3 - totalImages;
    const toAdd = files.slice(0, remaining);

    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ]);

    if (files.length > remaining) {
      toast.error("Maksimal 3 gambar per berita");
    }
    e.target.value = "";
  }

  function removeExisting(idx: number) {
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeNew(idx: number) {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(data: NewsFormData) {
    const hasContent = data.content.trim().length > 0;
    const hasImages = totalImages > 0;

    if (!hasContent && !hasImages) {
      toast.error("Isi konten teks atau tambahkan minimal 1 gambar");
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const url = await uploadNewsImage(file);
        uploadedUrls.push(url);
      }

      const allImages = [...existingUrls, ...uploadedUrls];
      const payload = {
        title: data.title,
        content: data.content,
        type: data.type,
        published_at: new Date(data.published_at).toISOString(),
        images: allImages,
      };

      if (isEditing && news) {
        updateMutation.mutate({ id: news.id, payload }, { onSuccess: onClose });
      } else {
        createMutation.mutate(
          { payload: payload as Omit<News, "id" | "created_at">, createdBy: user?.id ?? "" },
          { onSuccess: onClose }
        );
      }
    } catch {
      toast.error("Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  }

  const isSaving = isPending || uploading;
  const titleValue = watch("title") ?? "";
  const contentValue = watch("content") ?? "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-brand-600" />
            <h2 className="text-sm font-black text-slate-900">
              {isEditing ? "Edit Berita" : "Tambah Berita"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Judul
            </label>
            <div className="relative">
              <Type size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                {...register("title")}
                placeholder="Judul berita..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all placeholder-slate-400 ${
                  errors.title
                    ? "border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                    : "border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                }`}
              />
            </div>
            {errors.title && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.title.message}</p>
            )}
            <p className="text-[10px] text-slate-400 font-medium mt-1 text-right">
              {titleValue.length}/200
            </p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Tipe Berita
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                {...register("type")}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm font-medium bg-white"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-900">
                Gambar <span className="font-medium text-slate-400">(opsional, maks. 3)</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400">{totalImages}/3</span>
            </div>

            {/* Previews */}
            {totalImages > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingUrls.map((url, i) => (
                  <ImageThumb key={`ex-${i}`} src={url} onRemove={() => removeExisting(i)} />
                ))}
                {newPreviews.map((url, i) => (
                  <ImageThumb key={`new-${i}`} src={url} onRemove={() => removeNew(i)} />
                ))}
              </div>
            )}

            {/* Upload button */}
            {canAddMore && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all"
                >
                  <ImagePlus size={15} />
                  Tambah Gambar
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-900">
                Konten <span className="font-medium text-slate-400">(opsional)</span>
              </label>
            </div>
            <textarea
              {...register("content")}
              rows={5}
              placeholder="Isi konten berita..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 text-sm font-medium outline-none transition-all placeholder-slate-400 resize-none"
            />
            <p className="text-[10px] text-slate-400 font-medium mt-1 text-right">
              {contentValue.length} karakter
            </p>
          </div>

          {/* Published at */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Tanggal & Waktu Publish
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="datetime-local"
                {...register("published_at")}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                  errors.published_at
                    ? "border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-100"
                    : "border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                }`}
              />
            </div>
            {errors.published_at && (
              <p className="text-xs text-red-600 font-medium mt-1">{errors.published_at.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 disabled:opacity-60 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-1.5"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
              {uploading ? "Mengunggah..." : isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
