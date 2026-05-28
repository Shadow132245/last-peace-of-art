import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Last Peace of Art",
  description: "Create, share, and connect. Your space for projects, blogs, profiles, and discussions.",
  openGraph: {
    title: "Last Peace of Art",
    description: "Create, share, and connect. Your space for projects, blogs, profiles, and discussions.",
  },
};

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:pb-32 sm:pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 to-transparent dark:from-transparent dark:to-transparent" />
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-100/30 blur-3xl dark:bg-transparent" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
        <div className="mx-auto max-w-5xl text-center" style={{ animation: "fadeInUp 0.6s ease both" }}>
          <h1 className="relative text-4xl font-bold tracking-tight sm:text-6xl">
            Your space to{" "}
            <span className="bg-gradient-to-r from-amber-700 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-300 dark:to-white">
              create, share, connect
            </span>
          </h1>
          <p className="relative mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400" style={{ animation: "fadeInUp 0.6s ease 0.2s both" }}>
            Showcase your projects, write about your passions, share your profile, or start a discussion.
            The last peace of art is where your ideas find their home.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animation: "fadeInUp 0.6s ease 0.4s both" }}>
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/projects"
                  className="rounded-lg border border-zinc-300 bg-white/50 px-8 py-3 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white active:scale-95 dark:border-zinc-600 dark:bg-transparent dark:text-zinc-300 dark:shadow-none dark:hover:bg-zinc-800/30"
                >
                  Browse Projects
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-white px-4 py-20 dark:border-zinc-800 dark:bg-transparent">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">What you can do</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {!session && (
        <section className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-4 py-20 text-center dark:border-zinc-800 dark:bg-transparent dark:from-transparent dark:to-transparent">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to share your work?</h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400">
              Join our community of creators, writers, and thinkers.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

const features = [
  { icon: "🚀", title: "Projects", desc: "Upload and showcase your work with rich media, tags, and links." },
  { icon: "✍️", title: "Posts", desc: "Write about any topic and share your knowledge with the world." },
  { icon: "📄", title: "Profile", desc: "Create a stunning public profile to present your skills and experience." },
  { icon: "💬", title: "Forum", desc: "Start discussions, ask questions, and connect with the community." },
];

function FeatureCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  return (
    <div
      className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none"
      style={{ animation: `fadeInUp 0.5s ease ${index * 0.15}s both` }}
    >
      <div className="mb-4 text-3xl transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
