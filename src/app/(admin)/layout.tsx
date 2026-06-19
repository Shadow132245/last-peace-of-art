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
  { href: "/admin/roles", label: "Roles & Badges", icon: "🏅" },
  { href: "/admin/applications", label: "Applications", icon: "📋" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (!session) return null;

  const sidebarContent = (
    <nav className="flex flex-col gap-1.5">
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
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-6 px-4 py-8">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed left-4 top-20 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-md md:hidden dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Open admin menu"
      >
        <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-full w-64 overflow-y-auto border-r border-zinc-200 bg-white p-4 shadow-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold">Admin Panel</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.7 }}
        className="hidden w-56 shrink-0 md:block"
      >
        <div className="sticky top-24 rounded-2xl border border-zinc-200/80 bg-white/60 p-4 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/50">
          {sidebarContent}
        </div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.6, delay: 0.1 }}
        className="min-w-0 flex-1 md:ml-0"
      >
        <FadeInView>{children}</FadeInView>
      </motion.main>
    </div>
  );
}
