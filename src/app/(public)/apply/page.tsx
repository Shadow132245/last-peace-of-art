"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";

const questions = [
  { id: "experience", key: "apply.qExperience", label: "What experience do you have managing online communities or servers?", type: "textarea" },
  { id: "strengths", key: "apply.qStrengths", label: "What are your biggest strengths that would help you as a staff member?", type: "textarea" },
  { id: "weaknesses", key: "apply.qWeaknesses", label: "What areas do you think you need to improve on?", type: "textarea" },
  { id: "situation", key: "apply.qSituation", label: "How would you handle a conflict between two users in the community?", type: "textarea" },
  { id: "activity", key: "apply.qActivity", label: "How many hours per week can you dedicate to managing the site?", type: "text" },
  { id: "reason", key: "apply.qReason", label: "Why do you want to join the staff team?", type: "textarea" },
];

export default function ApplyPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (!res.data) { router.push("/login"); return; }
      setSession(res.data);
      setLoading(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formatted = questions.map((q) => ({ question: q.label, answer: answers[q.id] || "" }));

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: formatted }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("apply.error"));
    } else {
      setDone(true);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {done ? (
          <div className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">{t("apply.successTitle")}</h1>
            <p className="mt-3 text-zinc-500">{t("apply.successDesc")}</p>
            <Button className="mt-6" onClick={() => router.push("/")}>{t("apply.backToHome")}</Button>
          </div>
        ) : (
          <>
            <h1 className="mb-2 text-3xl font-bold">{t("apply.title")}</h1>
            <p className="mb-8 text-zinc-500 dark:text-zinc-400">{t("apply.description")}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {questions.map((q) => (
                <div key={q.id}>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t(q.key)}</label>
                  {q.type === "textarea" ? (
                    <textarea
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      required
                      rows={4}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  ) : (
                    <Input
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                      required
                    />
                  )}
                </div>
              ))}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit" loading={submitting}>{t("apply.submit")}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>{t("apply.cancel")}</Button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
