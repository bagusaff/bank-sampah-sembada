import { createContext, useContext, useState, type ReactNode } from "react";
import type { Notification } from "../types";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (n: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  setNotifications: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, setNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
