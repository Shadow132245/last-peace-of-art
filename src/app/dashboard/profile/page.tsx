"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useRef } from "react";
import { useI18n } from "@/providers/i18n-provider";
import { ImageCropDialog } from "@/components/ui/image-crop-dialog";
import { BadgeSelector } from "@/components/badges/badge-selector";

export default function ProfilePage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: session, refetch: refetchSession } = authClient.useSession();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [avatarPrev, setAvatarPrev] = useState<string | null>(null);
  const [bannerPrev, setBannerPrev] = useState<string | null>(null);
  const [avatarSize, setAvatarSize] = useState(80);
  const [bannerHeight, setBannerHeight] = useState(192);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Crop state
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"avatar" | "banner">("avatar");
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const initialLoadDone = useRef(false);
  const [badgeIds, setBadgeIds] = useState<string[]>([]);
  const [badgeSaved, setBadgeSaved] = useState(false);

  useEffect(() => {
    if (session?.user.name) {
      setUsername(session.user.name);
    }

    if (initialLoadDone.current || !session) return;
    initialLoadDone.current = true;

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const avatarVal = data.profile.avatar;
          const social: Record<string, unknown> = data.profile.social ?? {};
          const bannerVal = (social.banner as string) ?? null;
          setAvatar(avatarVal);
          setAvatarPrev(avatarVal);
          setBanner(bannerVal);
          setBannerPrev(bannerVal);
          setAvatarSize((social.avatarSize as number) ?? 80);
          setBannerHeight((social.bannerHeight as number) ?? 192);
          setBio(data.profile.bio ?? "");
          setSkills((data.profile.skills ?? []).join(", "));
        }
      })
      .catch(() => {});

    fetch("/api/badges/user")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBadgeIds(data.map((ub: { badgeId: string }) => ub.badgeId));
      })
      .catch(() => {});
  }, [session]);

  const selectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropType(type);
    setCropFile(file);
    setCropUrl(URL.createObjectURL(file));
    e.target.value = "";
  }, []);

  const handleCropComplete = useCallback(async (croppedBlob: Blob) => {
    if (!cropFile) return;
    setCropUrl(null);
    setCropFile(null);

    setUploadError(null);
    const localUrl = URL.createObjectURL(croppedBlob);
    if (cropType === "avatar") setAvatar(localUrl);
    else setBanner(localUrl);

    setUploading(cropType);
    const formData = new FormData();
    formData.append("file", croppedBlob, cropFile.name);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      let data: { url?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok && data.url) {
        if (cropType === "avatar") setAvatar(data.url);
        else setBanner(data.url);
      } else {
        setUploadError(data.error || t("dashboard.editProfile.uploadFailed"));
        if (cropType === "avatar") setAvatar(avatarPrev);
        else setBanner(bannerPrev);
      }
    } catch {
      setUploadError(t("dashboard.editProfile.networkError"));
      if (cropType === "avatar") setAvatar(avatarPrev);
      else setBanner(bannerPrev);
    }
    setUploading(null);
  }, [cropFile, cropType, avatarPrev, bannerPrev]);

  const handleUsernameUpdate = async () => {
    setSavingUsername(true);
    setUsernameSaved(false);
    setUsernameError("");

    const res = await fetch("/api/profile/update-username", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username.trim() }),
    });

    if (res.ok) {
      setUsernameSaved(true);
      refetchSession();
    } else {
      const data = await res.json();
      setUsernameError(data.error ?? "Failed to update username");
    }
    setSavingUsername(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        avatar,
        social: { banner, avatarSize, bannerHeight },
      }),
    });

    if (res.ok) {
      setSaved(true);
      refetchSession();
    }
    setSaving(false);
  };

  const displayName = session?.user.name ?? t("dashboard.editProfile.username");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-4 py-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8 text-3xl font-bold"
      >
        {t("dashboard.editProfile.title")}
      </motion.h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-4 font-semibold">{t("dashboard.editProfile.profilePhoto")}</h3>
            <div className="flex items-center gap-4">
              <div
                className="overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
                style={{ width: avatarSize, height: avatarSize }}
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl text-zinc-400">
                    {session?.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  {uploading === "avatar" ? t("dashboard.editProfile.uploading") : t("dashboard.editProfile.upload")}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => selectFile(e, "avatar")} />
                </label>
                {avatar && (
                  <button onClick={() => setAvatar(null)} className="text-sm text-red-500 hover:underline">{t("dashboard.editProfile.remove")}</button>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-500">{t("dashboard.editProfile.size").replace("{size}", String(avatarSize))}</label>
              <input
                type="range"
                min={40}
                max={200}
                value={avatarSize}
                onChange={(e) => setAvatarSize(Number(e.target.value))}
                className="mt-1 w-full"
              />
            </div>
          </div>

          {/* Banner */}
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-4 font-semibold">{t("dashboard.editProfile.coverBanner")}</h3>
            {banner && (
              <div
                className="mb-4 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                style={{ height: bannerHeight }}
              >
                <img src={banner} alt="Banner" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                {uploading === "banner" ? t("dashboard.editProfile.uploading") : t("dashboard.editProfile.upload")}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => selectFile(e, "banner")} />
              </label>
              {banner && (
                <button onClick={() => setBanner(null)} className="text-sm text-red-500 hover:underline">{t("dashboard.editProfile.remove")}</button>
              )}
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-500">{t("dashboard.editProfile.height").replace("{height}", String(bannerHeight))}</label>
              <input
                type="range"
                min={100}
                max={400}
                value={bannerHeight}
                onChange={(e) => setBannerHeight(Number(e.target.value))}
                className="mt-1 w-full"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-4 font-semibold">{t("dashboard.editProfile.bio")}</h3>
            <textarea
              className="min-h-[100px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("dashboard.editProfile.bioPlaceholder")}
            />
          </div>

          {/* Skills */}
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-4 font-semibold">{t("dashboard.editProfile.skills")}</h3>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder={t("dashboard.editProfile.skillsPlaceholder")}
            />
          </div>

          {/* Badges */}
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-4 font-semibold">{t("dashboard.editProfile.badges")}</h3>
            <BadgeSelector selected={badgeIds} onChange={(ids) => {
              setBadgeIds(ids);
              setBadgeSaved(false);
              fetch("/api/badges/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ badgeIds: ids }),
              }).then((r) => {
                if (r.ok) setBadgeSaved(true);
              }).catch(() => {});
            }} />
            {badgeSaved && <p className="mt-2 text-xs text-green-500">{t("dashboard.editProfile.badgesSaved")}</p>}
          </div>

          {/* Username */}
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-4 font-semibold">Username</h3>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
            {usernameError && <p className="mt-2 text-sm text-red-500">{usernameError}</p>}
            {usernameSaved && <p className="mt-2 text-sm text-green-500">Username updated!</p>}
            <div className="mt-3">
              <Button onClick={handleUsernameUpdate} loading={savingUsername} variant="outline" size="sm">Update Username</Button>
            </div>
          </div>

          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
          {saved && <p className="text-sm text-green-500">{t("dashboard.editProfile.saved")}</p>}

          <div className="flex gap-4">
            <Button onClick={handleSave} loading={saving}>{t("dashboard.editProfile.save")}</Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>{t("dashboard.editProfile.back")}</Button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800 lg:sticky lg:top-24 lg:self-start">
          <h3 className="mb-4 font-semibold">{t("dashboard.editProfile.livePreview")}</h3>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            {banner && (
              <div
                className="w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                style={{ height: bannerHeight }}
              >
                <img src={banner} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
                  style={{ width: avatarSize, height: avatarSize }}
                >
                  {avatar ? (
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl text-zinc-400">
                      {session?.user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold truncate">{displayName}</h2>
                  {bio && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{bio}</p>}
                  {skills && skills.split(",").map(s => s.trim()).filter(Boolean).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {skills.split(",").map(s => s.trim()).filter(Boolean).map((skill) => (
                        <span key={skill} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs dark:bg-zinc-800">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageCropDialog
        open={!!cropUrl}
        imageUrl={cropUrl ?? ""}
        aspect={cropType === "avatar" ? 1 : 3}
        title={cropType === "avatar" ? "Crop Avatar" : "Crop Banner"}
        onCrop={handleCropComplete}
        onClose={() => { setCropUrl(null); setCropFile(null); }}
      />
      </motion.div>
    );
  }
