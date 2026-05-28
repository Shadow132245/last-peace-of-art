"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CVPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setBio(data.profile.bio ?? "");
          setSkills((data.profile.skills ?? []).join(", "));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save profile");
    } else {
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Edit CV / Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
          <textarea
            className="min-h-[120px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </div>
        <Input label="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="TypeScript, React, Design" />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {saved && <p className="text-sm text-green-500">Profile saved!</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>Save Profile</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>Back</Button>
        </div>
      </form>
    </div>
  );
}
