"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

type PollData = {
  id: string;
  question: string;
  multiple: boolean;
  totalVotes: number;
  userVotes: string[];
  options: { id: string; text: string; count: number; percentage: number }[];
};

export function PollDisplay({ threadId }: { threadId: string }) {
  const { data: session } = authClient.useSession();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetch(`/api/polls?threadId=${threadId}`)
      .then((r) => r.json())
      .then((data) => {
        setPoll(data);
        if (data?.userVotes?.length > 0) {
          setVoted(true);
          setSelected(data.userVotes);
        }
      })
      .catch(() => {});
  }, [threadId]);

  if (!poll) return null;

  const toggleOption = (optionId: string) => {
    if (poll.multiple) {
      setSelected((prev) => prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]);
    } else {
      setSelected([optionId]);
    }
  };

  const handleVote = async () => {
    if (!session || selected.length === 0 || voting) return;
    setVoting(true);
    const res = await fetch(`/api/polls/${poll.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionIds: selected }),
    });
    if (res.ok) {
      setVoted(true);
      const res2 = await fetch(`/api/polls?threadId=${threadId}`);
      if (res2.ok) setPoll(await res2.json());
    }
    setVoting(false);
  };

  return (
    <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="mb-4 text-lg font-semibold">{poll.question}</h3>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <div
              key={option.id}
              onClick={() => !voted && session && toggleOption(option.id)}
              className={`relative cursor-pointer overflow-hidden rounded-lg border p-3 transition-all ${isSelected ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"} ${voted ? "cursor-default" : "hover:border-zinc-300 dark:hover:border-zinc-600"}`}
            >
              {voted && (
                <div
                  className="absolute left-0 top-0 h-full bg-amber-100 transition-all dark:bg-amber-900/30"
                  style={{ width: `${option.percentage}%` }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!voted && session && (
                    <div className={`h-4 w-4 rounded-full border-2 ${isSelected ? "border-amber-500 bg-amber-500" : "border-zinc-300 dark:border-zinc-500"}`}>
                      {isSelected && <div className="m-0.5 h-2.5 w-2.5 rounded-full bg-white" />}
                    </div>
                  )}
                  <span className="text-sm font-medium">{option.text}</span>
                </div>
                {voted && (
                  <span className="text-sm text-zinc-500">
                    {option.count} ({option.percentage}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!voted && session && (
        <button
          onClick={handleVote}
          disabled={selected.length === 0 || voting}
          className="mt-4 cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {voting ? "Voting..." : "Vote"}
        </button>
      )}

      {!session && (
        <p className="mt-3 text-xs text-zinc-400">Sign in to vote</p>
      )}

      <p className="mt-3 text-xs text-zinc-400">{poll.totalVotes} total votes</p>
    </div>
  );
}
