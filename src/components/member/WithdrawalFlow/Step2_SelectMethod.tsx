import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Banknote,
  Landmark,
  ChevronRight,
  ChevronLeft,
  Plus,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useBankAccounts, useCreateBankAccount } from "../../../hooks/useBankAccounts";
import type { BankAccount } from "../../../types";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
      <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

// ─── New account form ────────────────────────────────────────────────────────

function NewAccountForm({
  onSave,
  isSaving,
}: {
  onSave: (data: Omit<BankAccount, "id" | "user_id" | "created_at" | "is_default">) => void;
  isSaving: boolean;
}) {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [saveForLater, setSaveForLater] = useState(false);

  const canSave = bankName.trim() && accountNumber.trim() && accountHolder.trim();

  return (
    <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-1.5">
          Nama Bank
        </label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Contoh: BCA, BRI, Mandiri"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm font-medium placeholder-slate-400"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-1.5">
          Nomor Rekening
        </label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="1234567890"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm font-medium placeholder-slate-400"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-1.5">
          Nama Pemilik Rekening
        </label>
        <input
          type="text"
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          placeholder="Nama sesuai rekening"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm font-medium placeholder-slate-400"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
            saveForLater
              ? "bg-brand-600 border-brand-600"
              : "bg-white border-slate-300"
          }`}
        >
          {saveForLater ? <Check size={10} strokeWidth={4} className="text-white" /> : null}
        </div>
        <input
          type="checkbox"
          checked={saveForLater}
          onChange={(e) => setSaveForLater(e.target.checked)}
          className="sr-only"
        />
        <span className="text-xs font-bold text-slate-600">
          Simpan rekening ini untuk penarikan berikutnya
        </span>
      </label>

      <button
        type="button"
        onClick={() =>
          onSave({
            bank_name: bankName.trim(),
            account_number: accountNumber.trim(),
            account_holder: accountHolder.trim(),
          })
        }
        disabled={!canSave || isSaving}
        className="w-full py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        {isSaving ? "Menyimpan..." : "Gunakan Rekening Ini"}
      </button>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

export default function Step2_SelectMethod({ onNext, onBack }: Step2Props) {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const { data: accounts, isLoading } = useBankAccounts(userId);
  const createAccount = useCreateBankAccount(userId);

  const { watch, setValue, formState } = useFormContext();
  const withdrawalType: "manual" | "bank_transfer" = watch("withdrawalType") ?? "manual";
  const selectedBankAccountId: string | undefined = watch("bankAccountId");
  const [showNewForm, setShowNewForm] = useState(false);

  function handleSelectMethod(type: "manual" | "bank_transfer") {
    setValue("withdrawalType", type, { shouldValidate: true });
    if (type === "manual") {
      setValue("bankAccountId", undefined, { shouldValidate: true });
      setShowNewForm(false);
    }
  }

  function handleSelectAccount(id: string) {
    setValue("bankAccountId", id, { shouldValidate: true });
    setShowNewForm(false);
  }

  async function handleSaveNewAccount(
    data: Omit<BankAccount, "id" | "user_id" | "created_at" | "is_default">
  ) {
    const newAccount = await createAccount.mutateAsync({
      ...data,
      user_id: userId,
      is_default: false,
    });
    setValue("bankAccountId", newAccount.id, { shouldValidate: true });
    setShowNewForm(false);
  }

  const canProceed =
    withdrawalType === "manual" ||
    (withdrawalType === "bank_transfer" && !!selectedBankAccountId);

  if (isLoading) return <Skeleton />;

  return (
    <div className="space-y-6">
      {/* Method selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Manual */}
        <button
          type="button"
          onClick={() => handleSelectMethod("manual")}
          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all text-left ${
            withdrawalType === "manual"
              ? "bg-brand-50/60 border-brand-200 shadow-sm"
              : "bg-white border-slate-100 hover:border-slate-200"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              withdrawalType === "manual"
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <Banknote size={22} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">Tarik Manual</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Datang ke lokasi Bank Sampah
            </p>
          </div>
        </button>

        {/* Bank transfer */}
        <button
          type="button"
          onClick={() => handleSelectMethod("bank_transfer")}
          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all text-left ${
            withdrawalType === "bank_transfer"
              ? "bg-brand-50/60 border-brand-200 shadow-sm"
              : "bg-white border-slate-100 hover:border-slate-200"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              withdrawalType === "bank_transfer"
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <Landmark size={22} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">Transfer Bank</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Transfer ke rekening bank Anda
            </p>
          </div>
        </button>
      </div>

      {/* Bank account selection */}
      {withdrawalType === "bank_transfer" && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Pilih Rekening
          </h3>

          {accounts && accounts.length > 0 && (
            <div className="space-y-2">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectAccount(acc.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    selectedBankAccountId === acc.id
                      ? "bg-brand-50/60 border-brand-200 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedBankAccountId === acc.id
                        ? "border-brand-600"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedBankAccountId === acc.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">
                        {acc.bank_name}
                      </p>
                      {acc.is_default && (
                        <span className="px-1.5 py-0.5 bg-brand-50 text-brand-600 text-[10px] font-black rounded border border-brand-100">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {acc.account_number} — {acc.account_holder}
                    </p>
                  </div>
                </button>
              ))}

              {/* Add new option */}
              <button
                type="button"
                onClick={() => setShowNewForm((s) => !s)}
                className={`w-full flex items-center gap-2 p-4 rounded-xl border border-dashed transition-all text-left ${
                  showNewForm
                    ? "bg-brand-50/30 border-brand-200 text-brand-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <Plus size={16} />
                <span className="text-sm font-bold">
                  {showNewForm ? "Batal" : "Gunakan rekening baru"}
                </span>
              </button>
            </div>
          )}

          {/* Show new form if no accounts or explicitly toggled */}
          {(showNewForm || !accounts || accounts.length === 0) && (
            <NewAccountForm onSave={handleSaveNewAccount} isSaving={createAccount.isPending} />
          )}
        </div>
      )}

      {/* Validation error */}
      {formState.errors.bankAccountId && (
        <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
          <AlertCircle size={14} />
          {formState.errors.bankAccountId.message as string}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all"
        >
          <ChevronLeft size={16} />
          Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200"
        >
          Lanjutkan
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
