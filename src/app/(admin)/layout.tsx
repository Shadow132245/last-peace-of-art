"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { FadeInView } from "@/components/ui/fade-in-view";

const navItems = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/projects", label: "Projects", icon: "📁" },
  { href: "/admin/posts", label: "Posts", icon: "📝" },
  { href: "/admin/threads", label: "Threads", icon: "💬" },
  { href: "/admin/reports", label: "Reports", icon: "🚩" },
  { href: "/admin/appeals", label: "Appeals", icon: "📨" },
  { href: "/admin/tickets", label: "Tickets", icon: "🎫" },
  { href: "/admin/applications", label: "Applications", icon: "📋" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      const data = res.data;
      if (!data) {
        router.push("/login");
        return;
      }
      const user = data.user as any;
      if (user.banned) {
        router.push("/banned");
        return;
      }
      if (user.suspended) {
        router.push("/suspended");
        return;
      }
      const role = user.role;
      if (role !== "admin" && role !== "founder") {
        router.push("/login");
        return;
      }
      setSession(data);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-6 px-4 py-8">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.7 }}
        className="hidden w-56 shrink-0 md:block"
      >
        <nav className="sticky top-24 flex flex-col gap-1.5 rounded-2xl border border-zinc-200/80 bg-white/60 p-4 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/50">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Admin Panel</p>
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10 dark:bg-white dark:text-zinc-900 dark:shadow-white/10"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="admin-active"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-current"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
          <div className="my-2 border-t border-zinc-200 dark:border-zinc-700" />
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <span className="text-lg">←</span>
            <span>Dashboard</span>
          </Link>
        </nav>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.6, delay: 0.1 }}
        className="min-w-0 flex-1"
      >
        <FadeInView>{children}</FadeInView>
      </motion.main>
    </div>
  );
}
