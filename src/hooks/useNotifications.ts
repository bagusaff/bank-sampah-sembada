import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export function useNotifications(userId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationsByUser(userId),
    enabled: !!userId,
  });

  // Unique per hook instance so multiple callers don't collide on the same channel name.
  const instanceId = useRef(Math.random().toString(36).slice(2));

  // Realtime subscription — invalidate cache when a new notification arrives.
  useEffect(() => {
    if (!userId) return;

    const channelName = `notif-${userId}-${instanceId.current}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notif = payload.new as { id: string; title: string; message: string };
          // toast id = notification id → deduplicates across multiple hook instances
          toast(`🔔 ${notif.title}`, { id: notif.id, duration: 6000 });
          qc.invalidateQueries({ queryKey: ["notifications", userId] });
        }
      )
      .subscribe((_status, err) => {
        if (err) console.warn("Realtime subscription error:", err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, qc]);

  return query;
}

export function useMarkNotificationRead(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications", userId] });
    },
    onError: () => toast.error("Gagal menandai notifikasi"),
  });
}

export function useMarkAllNotificationsRead(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications", userId] });
      toast.success("Semua notifikasi ditandai dibaca");
    },
    onError: () => toast.error("Gagal menandai notifikasi"),
  });
}
