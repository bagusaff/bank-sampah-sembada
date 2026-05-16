export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function formatPhoneDisplay(phone: string): string {
  if (phone.startsWith("+62")) {
    return "0" + phone.slice(3);
  }
  return phone;
}

export function formatPhoneStorage(phone: string): string {
  if (phone.startsWith("0")) {
    return "+62" + phone.slice(1);
  }
  return phone;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
