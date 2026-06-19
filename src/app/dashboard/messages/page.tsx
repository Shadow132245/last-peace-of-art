"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";

type User = { id: string; name: string; image: string | null };
type Message = { id: string; content: string; createdAt: string; read: boolean; readAt: string | null; sender: User };

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
  const [sendError, setSendError] = useState("");
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
    setSendError("");
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
    } else {
      const data = await res.json();
      setSendError(data.error || "Failed to send message");
    }
    setSending(false);
  };

  const [showConversations, setShowConversations] = useState(false);

  if (!session) return null;

  const conversationList = (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
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
              onClick={() => {
                selectUser(conv);
                setShowConversations(false);
              }}
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
    </>
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-12rem)] max-w-6xl px-4 py-6">
      <div className="flex w-full gap-4">
        {/* Desktop conversation list */}
        <div className="hidden w-72 shrink-0 rounded-xl border border-zinc-200 bg-white sm:flex sm:flex-col dark:border-zinc-800 dark:bg-zinc-900">
          {conversationList}
        </div>

        <div className="flex flex-1 flex-col rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-2 border-b border-zinc-200 p-3 sm:p-4 dark:border-zinc-800">
                <button
                  onClick={() => setShowConversations(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 sm:hidden dark:hover:bg-zinc-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <Link href={`/user/${encodeURIComponent(selectedUser.name)}`} className="flex items-center gap-3 transition-colors hover:opacity-80">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700 sm:h-9 sm:w-9">
                    {selectedUser.image ? <img src={selectedUser.image} alt="" className="h-full w-full rounded-full object-cover" /> : selectedUser.name[0]}
                  </div>
                  <span className="text-sm font-medium sm:text-base">{selectedUser.name}</span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:p-4">
                {messages.map((msg) => {
                  const isMine = msg.sender.id === session.user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm sm:max-w-[70%] sm:px-4 ${isMine ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                        <p>{msg.content}</p>
                        <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMine ? "justify-end text-zinc-400 dark:text-zinc-500" : "text-zinc-400"}`}>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          {isMine && (
                            <span>
                              {msg.readAt ? (
                                <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12.5 6.9l-1.4-1.4L5.6 11l3.5 3.5 1.4-1.4-2.1-2.1 4.1-4.1zM17.5 6.9l-1.4-1.4L9 13l1.4 1.4 7.1-7.5zM22.5 6.9l-1.4-1.4L12 15l-2.5-2.5-1.4 1.4L12 17.9l10.5-11z"/>
                                </svg>
                              ) : msg.read ? (
                                <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              ) : (
                                <svg className="h-3.5 w-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {sendError && (
                <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {sendError}
                </div>
              )}
              <form onSubmit={sendMessage} className="flex gap-3 border-t border-zinc-200 p-3 dark:border-zinc-800 sm:p-4">
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
              <div className="text-center">
                <p className="text-sm text-zinc-400">{t("messages.selectConversation")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile conversation drawer */}
      <AnimatePresence>
        {showConversations && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConversations(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-zinc-200 bg-white sm:hidden dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
                <h2 className="font-semibold">{t("messages.title")}</h2>
                <button
                  onClick={() => setShowConversations(false)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <p className="p-4 text-sm text-zinc-400">{t("messages.loading")}</p>
                ) : conversations.length === 0 ? (
                  <p className="p-4 text-sm text-zinc-400">{t("messages.noConversations")}</p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        selectUser(conv);
                        setShowConversations(false);
                      }}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
