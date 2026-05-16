import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Send,
  Loader2,
  Info,
  Landmark,
  Banknote,
  Package,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useDeposits } from "../../../hooks/useDeposits";
import { useBankAccounts } from "../../../hooks/useBankAccounts";
import { useCreateWithdrawal } from "../../../hooks/useWithdrawal";
import { formatRupiah } from "../../../utils/formatters";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Step3Props {
  onBack: () => void;
}

function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), "d MMM yyyy", { locale: id });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

export default function Step3_Review({ onBack }: Step3Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const memberId = user?.id ?? "";

  const { watch } = useFormContext();
  const selectedDepositIds: string[] = watch("selectedDepositIds") ?? [];
  const withdrawalType: "manual" | "bank_transfer" = watch("withdrawalType");
  const bankAccountId: string | undefined = watch("bankAccountId");

  const { data: deposits, isLoading: depositsLoading } = useDeposits(memberId);
  const { data: accounts } = useBankAccounts(memberId);
  const createWithdrawal = useCreateWithdrawal();

  const selectedDeposits = useMemo(() => {
    return (
      deposits?.filter(
        (d) => selectedDepositIds.includes(d.id) && !d.is_withdrawn
      ) ?? []
    );
  }, [deposits, selectedDepositIds]);

  const totalAmount = useMemo(
    () => selectedDeposits.reduce((s, d) => s + d.total_rupiah, 0),
    [selectedDeposits]
  );

  const selectedAccount = useMemo(
    () => accounts?.find((a) => a.id === bankAccountId),
    [accounts, bankAccountId]
  );

  async function handleConfirm() {
    await createWithdrawal.mutateAsync({
      member_id: memberId,
      withdrawal_type: withdrawalType,
      total_amount: totalAmount,
      selected_deposits: selectedDepositIds,
      bank_account_id: withdrawalType === "bank_transfer" ? bankAccountId : undefined,
      notes: undefined,
    });
    navigate("/member/withdrawals", { replace: true });
  }

  if (depositsLoading) return <Skeleton />;

  return (
    <div className="space-y-6">
      {/* Total amount card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white shadow-lg shadow-emerald-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider mb-2">
            Total Penarikan
          </p>
          <p className="text-4xl font-black tracking-tight">
            {formatRupiah(totalAmount)}
          </p>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            {selectedDeposits.length} deposit dipilih
          </p>
        </div>
      </div>

      {/* Selected deposits */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] p-5">
        <h3 className="text-sm font-black text-slate-900 mb-3">
          Deposit yang Dipilih
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedDeposits.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 p-3 bg-slate-50/50 rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-brand-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {d.trash_type?.name ?? "-"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {formatShortDate(d.deposit_date)} · {d.weight_kg} kg
                  </p>
                </div>
              </div>
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                {formatRupiah(d.total_rupiah)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Method summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] p-5">
        <h3 className="text-sm font-black text-slate-900 mb-3">
          Metode Penarikan
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            {withdrawalType === "manual" ? (
              <Banknote size={18} className="text-brand-600" />
            ) : (
              <Landmark size={18} className="text-brand-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {withdrawalType === "manual" ? "Tarik Manual" : "Transfer Bank"}
            </p>
            {withdrawalType === "manual" ? (
              <p className="text-xs text-slate-400 font-medium">
                Datang ke lokasi Bank Sampah Sembada
              </p>
            ) : selectedAccount ? (
              <p className="text-xs text-slate-500 font-medium">
                {selectedAccount.bank_name} — {selectedAccount.account_number} —{" "}
                {selectedAccount.account_holder}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Manual withdrawal info */}
      {withdrawalType === "manual" && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-700">
              Info Penarikan Tunai
            </p>
            <p className="text-xs text-blue-600 font-medium mt-0.5">
              Disarankan mengajukan penarikan tunai minimal 2 hari sebelumnya agar admin dapat mempersiapkan uang.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          disabled={createWithdrawal.isPending}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 disabled:opacity-50 transition-all"
        >
          <ChevronLeft size={16} />
          Kembali
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={createWithdrawal.isPending || selectedDeposits.length === 0}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200"
        >
          {createWithdrawal.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {createWithdrawal.isPending ? "Mengirim..." : "Konfirmasi Penarikan"}
        </button>
      </div>
    </div>
  );
}
