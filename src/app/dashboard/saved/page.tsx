"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";

type BookmarkGroup = {
  entityType: string;
  items: { id: string; entityId: string; createdAt: string; entity: { id: string; title?: string; slug?: string; content?: string } | null }[];
};

export default function SavedPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { router.push("/login"); return; }
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) return null;

  const entityLabel = (type: string) => {
    switch (type) {
      case "post": return t("saved.posts") || "Posts";
      case "project": return t("saved.projects") || "Projects";
      case "thread": return t("saved.threads") || "Discussions";
      case "comment": return t("saved.comments") || "Comments";
      default: return type;
    }
  };

  const entityHref = (item: { entityType: string; entity: any }) => {
    if (!item.entity) return "#";
    if (item.entityType === "post" && item.entity.slug) return `/blog/${item.entity.slug}`;
    if (item.entityType === "project") return `/projects/${item.entity.id}`;
    if (item.entityType === "thread") return `/forum/${item.entity.id}`;
    return "#";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-3xl font-bold">
        {t("saved.title") || "Saved Items"}
      </motion.h1>

      {loading ? (
        <p className="text-sm text-zinc-400">{t("saved.loading") || "Loading..."}</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-zinc-400">{t("saved.empty") || "No saved items yet"}</p>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.entityType}>
              <h2 className="mb-4 text-lg font-semibold text-zinc-600 dark:text-zinc-400">{entityLabel(group.entityType)}</h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {item.entity ? (
                      <Link href={entityHref({ entityType: group.entityType, entity: item.entity })} className="block text-sm font-medium text-zinc-900 hover:text-amber-600 dark:text-zinc-100 dark:hover:text-amber-400">
                        {item.entity.title ?? item.entity.content?.slice(0, 80) ?? "Untitled"}
                      </Link>
                    ) : (
                      <p className="text-sm text-zinc-400">{t("saved.deleted") || "Content no longer available"}</p>
                    )}
                    <p className="mt-1 text-xs text-zinc-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
