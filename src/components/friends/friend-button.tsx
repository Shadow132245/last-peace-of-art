"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/providers/i18n-provider";

type FriendStatus = "none" | "sent" | "received" | "friends";

export function AddFriendButton({ userId }: { userId: string }) {
  const { t } = useI18n();
  const { data: session } = authClient.useSession();
  const [status, setStatus] = useState<FriendStatus | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || session.user.id === userId) return;
    fetch(`/api/friends/status?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.status);
        setRequestId(data.requestId ?? null);
      })
      .catch(() => {});
  }, [userId, session]);

  if (!session || session.user.id === userId) return null;

  const handleAction = async () => {
    setLoading(true);
    if (status === "none") {
      const res = await fetch("/api/friends/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });
      if (res.ok) setStatus("sent");
    } else if (status === "sent") {
      if (requestId) {
        await fetch(`/api/friends/requests/${requestId}`, {
          method: "DELETE",
        });
      }
      setStatus("none");
    } else if (status === "received") {
      if (requestId) {
        await fetch(`/api/friends/requests/${requestId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" }),
        });
        setStatus("friends");
      }
    } else if (status === "friends") {
      const res = await fetch("/api/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId: userId }),
      });
      if (res.ok) setStatus("none");
    }
    setLoading(false);
  };

  const btnClass = (base: string) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${base}`;

  if (status === null) return <div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />;

  if (status === "none") {
    return (
      <button onClick={handleAction} disabled={loading} className={btnClass("border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800")}>
        {loading ? <Spinner /> : t("friends.addFriend")}
      </button>
    );
  }

  if (status === "sent") {
    return (
      <button onClick={handleAction} disabled={loading} className={btnClass("bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400")}>
        {loading ? <Spinner /> : t("friends.requestSent")}
      </button>
    );
  }

  if (status === "received") {
    return (
      <button onClick={handleAction} disabled={loading} className={btnClass("bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/70")}>
        {loading ? <Spinner /> : t("friends.accept")}
      </button>
    );
  }

  return (
      <button onClick={handleAction} disabled={loading} className={btnClass("group bg-zinc-200 text-zinc-600 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-red-900/30 dark:hover:text-red-400")}>
      {loading ? <Spinner /> : <><span className="group-hover:hidden">{t("friends.title")}</span><span className="hidden group-hover:inline">{t("friends.unfriend")}</span></>}
    </button>
  );
}

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />;
}
