"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";

const categories = [
  { value: "bug", label: "Bug Report" },
  { value: "security", label: "Security Vulnerability" },
  { value: "feature", label: "Feature Request" },
  { value: "other", label: "Other" },
];

export default function TicketsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bug");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (!res.data) { router.push("/login"); return; }
      setSession(res.data);
      setLoading(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to submit ticket");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  if (loading) return <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" /></div>;

  if (success) return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">🎫</div>
      <h1 className="mb-3 text-3xl font-bold">Ticket Submitted</h1>
      <p className="mb-6 text-zinc-500">Your ticket has been submitted and will be reviewed by the team.</p>
      <motion.button onClick={() => router.push("/")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white dark:bg-white dark:text-zinc-900">
        Back to Home
      </motion.button>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="mb-2 text-3xl font-bold">Report a Bug / Vulnerability</h1>
        <p className="mb-8 text-zinc-500">Found an issue? Submit a ticket and our team will investigate. Bug hunters get special perks!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-white/10">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief summary of the issue" required className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-white/10" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Detailed steps to reproduce, expected vs actual behavior, screenshots if applicable..." required className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-white/10" />
          </div>

          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">{error}</motion.p>}

          <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer rounded-xl bg-zinc-900 py-3 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
            {submitting ? <span className="mx-auto block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-zinc-900" /> : "Submit Ticket"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
