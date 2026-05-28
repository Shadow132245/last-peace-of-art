"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setAvatar(data.profile.avatar);
          setBanner(data.profile.social?.banner ?? null);
          setBio(data.profile.bio ?? "");
          setSkills((data.profile.skills ?? []).join(", "));
        }
      })
      .catch(() => {});
  }, []);

  // Cleanup blob URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
      if (bannerPreview?.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
    };
  }, [avatarPreview, bannerPreview]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    if (type === "avatar") {
      setAvatarPreview(localUrl);
      setAvatar(localUrl);
    } else {
      setBannerPreview(localUrl);
      setBanner(localUrl);
    }

    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      // Replace blob URL with server URL
      if (type === "avatar") setAvatar(data.url);
      else setBanner(data.url);
    }
    setUploading(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const social = banner ? { banner } : undefined;

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        avatar,
        social,
      }),
    });

    if (res.ok) setSaved(true);
    setSaving(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="mb-4 font-semibold">Profile Photo</h3>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl text-zinc-400">
                  {session?.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
              {uploading === "avatar" ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "avatar")} />
            </label>
            {avatar && (
              <button onClick={() => setAvatar(null)} className="text-sm text-red-500 hover:underline">Remove</button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="mb-4 font-semibold">Cover Banner</h3>
          <div className="space-y-4">
            {banner && (
              <div className="relative h-32 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <img src={banner} alt="Banner" className="h-full w-full object-cover" />
              </div>
            )}
            <label className="inline-block cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
              {uploading === "banner" ? "Uploading..." : "Upload Banner"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "banner")} />
            </label>
            {banner && (
              <button onClick={() => setBanner(null)} className="ml-2 text-sm text-red-500 hover:underline">Remove</button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="mb-4 font-semibold">Account</h3>
          <div className="space-y-3 text-sm">
            <p><span className="text-zinc-500">Name:</span> {session?.user.name}</p>
            <p><span className="text-zinc-500">Email:</span> {session?.user.email}</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="mb-4 font-semibold">Bio</h3>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="mb-4 font-semibold">Skills</h3>
          <input
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="TypeScript, React, Design..."
          />
        </div>

        {saved && <p className="text-sm text-green-500">Settings saved!</p>}

        <div className="flex gap-4">
          <Button onClick={handleSave} loading={saving}>Save Settings</Button>
          <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
