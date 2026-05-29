"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications);
      setUnread(data.unread);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }} className="relative text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" aria-label="Notifications">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -end-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm font-semibold">Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Mark all read</button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-zinc-400">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <Link key={n.id} href={n.link || "#"} onClick={() => setOpen(false)} className={`flex items-start gap-3 border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-zinc-50 last:border-0 dark:border-zinc-800 dark:hover:bg-zinc-800/50 ${!n.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
                    <div className="mt-0.5">
                      {n.type === "message" ? (
                        <span className="text-lg">💬</span>
                      ) : n.type === "ticket" ? (
                        <span className="text-lg">🎫</span>
                      ) : n.type === "application" ? (
                        <span className="text-lg">📋</span>
                      ) : n.type === "update" ? (
                        <span className="text-lg">📢</span>
                      ) : (
                        <span className="text-lg">🔔</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium text-zinc-600 dark:text-zinc-400"}`}>{n.title}</p>
                      {n.message && <p className="mt-0.5 truncate text-xs text-zinc-400">{n.message}</p>}
                      <p className="mt-0.5 text-[10px] text-zinc-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
