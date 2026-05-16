import * as XLSX from "xlsx";
import { formatRupiah, formatDate, formatPhoneDisplay } from "./formatters";
import type { Deposit, WithdrawalRequest, Profile, MemberBalance } from "../types";

interface ReportData {
  deposits: (Deposit & { member?: Profile })[];
  withdrawals: (WithdrawalRequest & { member?: Profile })[];
  members: Profile[];
  balances: MemberBalance[];
}

export function exportMonthlyReport(data: ReportData, month: string) {
  const wb = XLSX.utils.book_new();

  const totalDepositsKg = data.deposits.reduce((s, d) => s + d.weight_kg, 0);
  const totalDepositsRp = data.deposits.reduce((s, d) => s + d.total_rupiah, 0);
  const totalWithdrawn = data.withdrawals
    .filter((w) => w.status === "completed")
    .reduce((s, w) => s + w.total_amount, 0);

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["Laporan Bulanan Bank Sampah Digital"],
    ["Periode", month],
    [],
    ["Total Anggota", data.members.length],
    ["Total Deposit (kg)", totalDepositsKg],
    ["Total Deposit (Rp)", formatRupiah(totalDepositsRp)],
    ["Total Penarikan", formatRupiah(totalWithdrawn)],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const depositRows = [
    ["Tanggal", "Nama Anggota", "Kategori", "Jenis Sampah", "Berat (kg)", "Harga/kg", "Total (Rp)"],
    ...data.deposits.map((d) => [
      formatDate(d.deposit_date),
      d.member?.full_name ?? "-",
      d.trash_type?.category ?? "-",
      d.trash_type?.name ?? "-",
      d.weight_kg,
      formatRupiah(d.price_per_kg),
      formatRupiah(d.total_rupiah),
    ]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(depositRows), "Detail Deposit");

  const withdrawalRows = [
    ["Tanggal", "Nama Anggota", "Jumlah (Rp)", "Metode", "Status"],
    ...data.withdrawals.map((w) => [
      formatDate(w.created_at),
      w.member?.full_name ?? "-",
      formatRupiah(w.total_amount),
      w.withdrawal_type === "manual" ? "Tunai" : "Transfer Bank",
      w.status,
    ]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(withdrawalRows), "Detail Penarikan");

  const balanceRows = [
    ["Nama Anggota", "No. HP", "Total Ditarik (Rp)", "Saldo Saat Ini (Rp)"],
    ...data.members.map((m) => {
      const bal = data.balances.find((b) => b.member_id === m.id);
      return [
        m.full_name,
        formatPhoneDisplay(m.phone_number),
        formatRupiah(bal?.total_withdrawn ?? 0),
        formatRupiah(bal?.total_balance ?? 0),
      ];
    }),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(balanceRows), "Saldo Anggota");

  XLSX.writeFile(wb, `laporan-${month}.xlsx`);
}
