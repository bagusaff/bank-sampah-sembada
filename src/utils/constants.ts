export const WITHDRAWAL_COOLDOWN_DAYS = 2;

export const WITHDRAWAL_TYPES = {
  MANUAL: "manual",
  BANK_TRANSFER: "bank_transfer",
} as const;

export const WITHDRAWAL_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const NOTIFICATION_TYPES = {
  DEPOSIT_CREATED: "deposit_created",
  WITHDRAWAL_REQUESTED: "withdrawal_requested",
  WITHDRAWAL_COMPLETED: "withdrawal_completed",
  PRICE_UPDATE: "price_update",
} as const;

export const NEWS_TYPES = {
  ANNOUNCEMENT: "announcement",
  PRICE_UPDATE: "price_update",
  TIPS: "tips",
  GENERAL: "general",
} as const;

export const TRASH_CATEGORIES = ["Plastik", "Kertas", "Logam", "Kaca"] as const;
