import { X, Clock, TrendingUp } from "lucide-react";
import { usePriceHistory } from "../../../hooks/usePrices";
import { formatRupiah } from "../../../utils/formatters";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { TrashType } from "../../../types";

interface PriceHistoryProps {
  trashType: TrashType;
  onClose: () => void;
}

function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy", { locale: id });
}

export default function PriceHistory({ trashType, onClose }: PriceHistoryProps) {
  const { data: history, isLoading } = usePriceHistory(trashType.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900">Riwayat Harga</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {trashType.category} — {trashType.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp size={28} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">
                Belum ada riwayat harga
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    h.is_active
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        h.is_active
                          ? "bg-emerald-100 border-emerald-200 text-emerald-600"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}
                    >
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {formatShortDate(h.effective_date)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {h.is_active ? "Aktif" : "Tidak Aktif"}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-black ${
                      h.is_active ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {formatRupiah(h.price_per_kg)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}


