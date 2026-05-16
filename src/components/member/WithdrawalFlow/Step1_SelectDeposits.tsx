import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Package,
  Check,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useDeposits } from "../../../hooks/useDeposits";
import { useAuth } from "../../../hooks/useAuth";
import { formatRupiah } from "../../../utils/formatters";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { DepositWithRelations } from "../../../types";

interface Step1Props {
  onNext: () => void;
}

function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy", { locale: id });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

// ─── Category group ──────────────────────────────────────────────────────────

function CategoryGroup({
  category,
  deposits,
  selectedIds,
  onToggle,
  onToggleAll,
}: {
  category: string;
  deposits: DepositWithRelations[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
}) {
  const allSelected = deposits.every((d) => selectedIds.includes(d.id));
  const someSelected = deposits.some((d) => selectedIds.includes(d.id)) && !allSelected;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          {category}
        </h3>
        <button
          type="button"
          onClick={() => onToggleAll(deposits.map((d) => d.id))}
          className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-wider transition-colors"
        >
          {allSelected ? "Batal Pilih" : "Pilih Semua"}
        </button>
      </div>

      <div className="space-y-2">
        {deposits.map((deposit) => {
          const isSelected = selectedIds.includes(deposit.id);
          return (
            <button
              key={deposit.id}
              type="button"
              onClick={() => onToggle(deposit.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                isSelected
                  ? "bg-brand-50/60 border-brand-200 shadow-sm"
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "bg-brand-600 border-brand-600 shadow-sm shadow-brand-200"
                    : "bg-white border-slate-300"
                }`}
              >
                {isSelected ? <Check size={12} strokeWidth={4} className="text-white" /> : null}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {deposit.trash_type?.name ?? "-"}
                  </p>
                  <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                    {formatRupiah(deposit.total_rupiah)}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs text-slate-400 font-medium">
                    {formatShortDate(deposit.deposit_date)}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {deposit.weight_kg} kg
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

export default function Step1_SelectDeposits({ onNext }: Step1Props) {
  const { user } = useAuth();
  const memberId = user?.id ?? "";

  const { data: deposits, isLoading, error } = useDeposits(memberId);

  const { watch, setValue } = useFormContext();
  const selectedDepositIds: string[] = watch("selectedDepositIds") ?? [];

  const unwithdrawn = useMemo(
    () => deposits?.filter((d) => !d.is_withdrawn) ?? [],
    [deposits]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, DepositWithRelations[]>();
    for (const d of unwithdrawn) {
      const cat = d.trash_type?.category ?? "Lainnya";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(d);
    }
    return Array.from(map.entries());
  }, [unwithdrawn]);

  const runningTotal = useMemo(() => {
    return unwithdrawn
      .filter((d) => selectedDepositIds.includes(d.id))
      .reduce((sum, d) => sum + d.total_rupiah, 0);
  }, [unwithdrawn, selectedDepositIds]);

  function toggleId(id: string) {
    const next = selectedDepositIds.includes(id)
      ? selectedDepositIds.filter((x) => x !== id)
      : [...selectedDepositIds, id];
    setValue("selectedDepositIds", next, { shouldValidate: true });
  }

  function toggleAll(ids: string[]) {
    const allSelected = ids.every((id) => selectedDepositIds.includes(id));
    const next = allSelected
      ? selectedDepositIds.filter((x) => !ids.includes(x))
      : [...new Set([...selectedDepositIds, ...ids])];
    setValue("selectedDepositIds", next, { shouldValidate: true });
  }

  const canProceed = selectedDepositIds.length > 0;

  if (isLoading) return <Skeleton />;
  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
        <AlertCircle size={16} />
        Gagal memuat data deposit.
      </div>
    );
  }

  if (unwithdrawn.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Package size={32} className="text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">
          Tidak ada deposit yang dapat ditarik
        </p>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Semua deposit Anda sudah ditarik atau belum ada deposit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global select all */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          {unwithdrawn.length} deposit tersedia
        </p>
        <button
          type="button"
          onClick={() => toggleAll(unwithdrawn.map((d) => d.id))}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          {selectedDepositIds.length === unwithdrawn.length
            ? "Batal Pilih Semua"
            : "Pilih Semua"}
        </button>
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {grouped.map(([category, items]) => (
          <CategoryGroup
            key={category}
            category={category}
            deposits={items}
            selectedIds={selectedDepositIds}
            onToggle={toggleId}
            onToggleAll={toggleAll}
          />
        ))}
      </div>

      {/* Running total + next */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-medium">
            Total yang akan ditarik
          </p>
          <p className="text-xl font-black text-slate-900">
            {formatRupiah(runningTotal)}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            {selectedDepositIds.length} deposit dipilih
          </p>
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200"
        >
          Lanjutkan
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
