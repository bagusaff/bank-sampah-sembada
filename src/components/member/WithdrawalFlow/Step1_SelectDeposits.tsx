import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Package, Check, AlertCircle, ChevronRight, CalendarDays } from "lucide-react";
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
  return format(new Date(dateStr), "EEEE, d MMMM yyyy", { locale: id });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

// ─── Date group card ─────────────────────────────────────────────────────────

function DateGroupCard({
  date,
  deposits,
  selectedIds,
  onToggleDate,
}: {
  date: string;
  deposits: DepositWithRelations[];
  selectedIds: string[];
  onToggleDate: (ids: string[]) => void;
}) {
  const ids = deposits.map((d) => d.id);
  const isSelected = ids.every((id) => selectedIds.includes(id));
  const total = deposits.reduce((sum, d) => sum + d.total_rupiah, 0);

  return (
    <button
      type="button"
      onClick={() => onToggleDate(ids)}
      className={`w-full text-left rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? "bg-brand-50/60 border-brand-300 shadow-sm shadow-brand-100"
          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Date header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${
        isSelected ? "border-brand-200 bg-brand-50/80" : "border-slate-100 bg-slate-50/50"
      }`}>
        {/* Checkbox */}
        <div className={`w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
          isSelected
            ? "bg-brand-600 border-brand-600 shadow-sm shadow-brand-200"
            : "bg-white border-slate-300"
        }`}>
          {isSelected ? <Check size={12} strokeWidth={4} className="text-white" /> : null}
        </div>

        <CalendarDays size={14} className={isSelected ? "text-brand-600" : "text-slate-400"} />

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-black ${isSelected ? "text-brand-700" : "text-slate-900"}`}>
            {formatShortDate(date)}
          </p>
          <p className={`text-[10px] font-bold ${isSelected ? "text-brand-500" : "text-slate-400"}`}>
            {deposits.length} item · {formatRupiah(total)}
          </p>
        </div>

        <p className={`text-base font-black whitespace-nowrap ${isSelected ? "text-brand-700" : "text-slate-900"}`}>
          {formatRupiah(total)}
        </p>
      </div>

      {/* Item breakdown */}
      <div className="divide-y divide-slate-100/80">
        {deposits.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-4 py-2.5 pl-12">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-brand-400" : "bg-slate-300"}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {d.trash_type?.name ?? "-"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {d.weight_kg} kg · {d.trash_type?.category ?? "-"}
                </p>
              </div>
            </div>
            <p className="text-xs font-black text-slate-700 whitespace-nowrap ml-3">
              {formatRupiah(d.total_rupiah)}
            </p>
          </div>
        ))}
      </div>
    </button>
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

  // Group by deposit_date, sorted newest first
  const grouped = useMemo(() => {
    const map = new Map<string, DepositWithRelations[]>();
    for (const d of unwithdrawn) {
      if (!map.has(d.deposit_date)) map.set(d.deposit_date, []);
      map.get(d.deposit_date)!.push(d);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [unwithdrawn]);

  const runningTotal = useMemo(
    () => unwithdrawn.filter((d) => selectedDepositIds.includes(d.id)).reduce((s, d) => s + d.total_rupiah, 0),
    [unwithdrawn, selectedDepositIds]
  );

  function toggleDate(ids: string[]) {
    const allSelected = ids.every((id) => selectedDepositIds.includes(id));
    const next = allSelected
      ? selectedDepositIds.filter((x) => !ids.includes(x))
      : [...new Set([...selectedDepositIds, ...ids])];
    setValue("selectedDepositIds", next, { shouldValidate: true });
  }

  function selectAllDates() {
    const allIds = unwithdrawn.map((d) => d.id);
    const allSelected = allIds.every((id) => selectedDepositIds.includes(id));
    setValue("selectedDepositIds", allSelected ? [] : allIds, { shouldValidate: true });
  }

  const selectedDatesCount = grouped.filter(([, deps]) =>
    deps.every((d) => selectedDepositIds.includes(d.id))
  ).length;

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
        <p className="text-sm font-bold text-slate-500">Tidak ada deposit yang dapat ditarik</p>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Semua deposit Anda sudah ditarik atau belum ada deposit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          {grouped.length} tanggal · {unwithdrawn.length} item
        </p>
        <button
          type="button"
          onClick={selectAllDates}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          {selectedDatesCount === grouped.length ? "Batal Pilih Semua" : "Pilih Semua Tanggal"}
        </button>
      </div>

      {/* Date group cards */}
      <div className="space-y-3">
        {grouped.map(([date, items]) => (
          <DateGroupCard
            key={date}
            date={date}
            deposits={items}
            selectedIds={selectedDepositIds}
            onToggleDate={toggleDate}
          />
        ))}
      </div>

      {/* Running total + next */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-medium">Total yang akan ditarik</p>
          <p className="text-xl font-black text-slate-900">{formatRupiah(runningTotal)}</p>
          <p className="text-xs text-slate-400 font-medium">
            {selectedDatesCount} tanggal · {selectedDepositIds.length} item dipilih
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
