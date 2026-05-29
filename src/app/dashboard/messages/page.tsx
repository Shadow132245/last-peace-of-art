"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";

type User = { id: string; name: string; image: string | null };
type Message = { id: string; content: string; createdAt: string; sender: User };

export default function MessagesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();
  const [conversations, setConversations] = useState<(User & { lastMessage: string; lastMessageAt: string })[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (user: User) => {
    const res = await fetch(`/api/messages/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => {
        if (prev.length === data.length && prev[prev.length - 1]?.id === data[data.length - 1]?.id) return prev;
        return data;
      });
    }
  }, []);

  const selectUser = useCallback(async (user: User) => {
    setSelectedUser(user);
    selectedUserIdRef.current = user.id;
    const res = await fetch(`/api/messages/${user.id}`);
    if (res.ok) setMessages(await res.json());
  }, []);

  useEffect(() => {
    if (!session) { router.push("/login"); return; }
    const userId = searchParams.get("userId");
    fetch("/api/messages").then((r) => r.json()).then(async (data) => {
      setConversations(data);
      setLoading(false);
      if (userId) {
        const conv = data.find((c: any) => c.id === userId);
        if (conv) { selectUser(conv); return; }
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const user = await res.json();
          selectUser(user);
        }
      }
    });
  }, [session]);

  useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
      fetchMessages(selectedUser);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/messages");
      if (res.ok) setConversations(await res.json());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedUser.id, content: newMessage }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      fetch("/api/messages").then((r) => r.json()).then(setConversations);
    }
    setSending(false);
  };

  if (!session) return null;

  return (
    <div className="mx-auto flex h-[calc(100vh-12rem)] max-w-4xl px-4 py-6">
      <div className="flex w-full gap-4">
        <div className="w-72 shrink-0 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="font-semibold">{t("messages.title")}</h2>
          </div>
          <div className="overflow-y-auto" style={{ height: "calc(100% - 57px)" }}>
            {loading ? (
              <p className="p-4 text-sm text-zinc-400">{t("messages.loading")}</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-zinc-400">{t("messages.noConversations")}</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectUser(conv)}
                  className={`flex w-full items-center gap-3 p-3 text-start transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${selectedUser?.id === conv.id ? "bg-zinc-50 dark:bg-zinc-800" : ""}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
                    {conv.image ? <img src={conv.image} alt="" className="h-full w-full rounded-full object-cover" /> : conv.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{conv.name}</p>
                    <p className="truncate text-xs text-zinc-400">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
                  {selectedUser.image ? <img src={selectedUser.image} alt="" className="h-full w-full rounded-full object-cover" /> : selectedUser.name[0]}
                </div>
                <span className="font-medium">{selectedUser.name}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.sender.id === session.user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMine ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                        <p>{msg.content}</p>
                        <p className={`mt-1 text-[10px] ${isMine ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} className="flex gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("messages.typePlaceholder")}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {sending ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-zinc-900" />
                  ) : (
                    t("messages.send")
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-zinc-400">{t("messages.selectConversation")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
