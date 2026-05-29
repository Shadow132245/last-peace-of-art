"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";
import Link from "next/link";

type Friend = { id: string; name: string; image: string | null; since: string };
type Request = { id: string; sender: { id: string; name: string; image: string | null }; createdAt: string };

export default function FriendsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [tab, setTab] = useState<"friends" | "requests" | "add">("friends");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const loadData = async () => {
    const [f, r] = await Promise.all([
      fetch("/api/friends").then((r) => r.json()),
      fetch("/api/friends/requests").then((r) => r.json()),
    ]);
    setFriends(f);
    setRequests(r);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) { router.push("/login"); return; }
    loadData();
  }, [session]);

  const handleRequest = async (id: string, status: "accepted" | "rejected") => {
    await fetch(`/api/friends/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  };

  const handleUnfriend = async (friendId: string) => {
    await fetch("/api/friends", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    loadData();
  };

  const searchUsers = async (q: string) => {
    setSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data.users?.filter((u: any) => u.id !== session?.user.id) || []);
    }
    setSearching(false);
  };

  const sendRequest = async (receiverId: string) => {
    await fetch("/api/friends/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId }),
    });
    setSearch("");
    setSearchResults([]);
  };

  if (!session) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Friends</h1>

      <div className="mb-6 flex gap-2">
        {(["friends", "requests", "add"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {t === "friends" ? `Friends (${friends.length})` : t === "requests" ? `Requests (${requests.length})` : "Add Friend"}
          </button>
        ))}
      </div>

      {tab === "friends" && (
        <div className="grid gap-3">
          {loading ? (
            <p className="text-sm text-zinc-400">Loading...</p>
          ) : friends.length === 0 ? (
            <p className="text-sm text-zinc-400">No friends yet</p>
          ) : (
            friends.map((friend) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <Link href={`/user/${friend.name}`} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
                    {friend.image ? <img src={friend.image} alt="" className="h-full w-full rounded-full object-cover" /> : friend.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-xs text-zinc-400">Friends since {new Date(friend.since).toLocaleDateString()}</p>
                  </div>
                </Link>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/messages?userId=${friend.id}`}
                    className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  >
                    Message
                  </Link>
                  <button
                    onClick={() => handleUnfriend(friend.id)}
                    className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/50"
                  >
                    Unfriend
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="grid gap-3">
          {loading ? (
            <p className="text-sm text-zinc-400">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-zinc-400">No pending requests</p>
          ) : (
            requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
                    {req.sender.image ? <img src={req.sender.image} alt="" className="h-full w-full rounded-full object-cover" /> : req.sender.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{req.sender.name}</p>
                    <p className="text-xs text-zinc-400">Sent {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(req.id, "accepted")}
                    className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(req.id, "rejected")}
                    className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/50"
                  >
                    Decline
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {tab === "add" && (
        <div>
          <input
            value={search}
            onChange={(e) => searchUsers(e.target.value)}
            placeholder="Search users by name..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <div className="mt-4 grid gap-3">
            {searching ? (
              <p className="text-sm text-zinc-400">Searching...</p>
            ) : searchResults.length === 0 && search.length >= 2 ? (
              <p className="text-sm text-zinc-400">No users found</p>
            ) : (
              searchResults.map((user: any) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium dark:bg-zinc-700">
                      {user.image ? <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" /> : user.name[0]}
                    </div>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <button
                    onClick={() => sendRequest(user.id)}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Add Friend
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
